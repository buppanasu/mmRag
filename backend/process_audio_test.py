import os, sys, librosa, noisereduce as nr, soundfile as sf

from openai import OpenAI
from config import OPENAI_API_KEY, WHISPER_MODEL, DIARIZER
import json
import datetime
from qdrant_service import QdrantClient
from mongodb_service import MongoDBClient

openai_client = OpenAI()
qdrant_client = QdrantClient()
mongodb_client = MongoDBClient()

def transform_and_index_parsed_content(parsed_content):
    """
    Transforms parsed_content dictionaries by concatenating metadata with text 
    into a human-readable string.
    
    Parameters:
        parsed_content (list): A list of dictionaries containing "text" and "metadata".
    
    Returns:
        list: A list of transformed human-readable strings.
    """
    transformed_content = []
    for entry in parsed_content:
        text = entry["text"]
        metadata = entry["metadata"]
        transformed_entry = (
            f"For the meeting '{metadata['filename']}', held on {metadata['timestamp']}, "
            f"as part of '{metadata['category']}', {metadata['speaker']} said: '{text}'"
        )
        qdrant_client.embed_and_index_transcription(transformed_entry)



def semantic_chunker(transcription_text, file_name):
    """
    This function sends the transcription text to an LLM, asking it to break the text into 
    semantically meaningful chunks, and returns the output in a JSON format, including metadata such as filename, timestamp, and speaker.
    
    Parameters:
        transcription_text (str): The text of the meeting transcription.
        file_name (str): The filename of the meeting transcript (used for metadata).
    
    Returns:
        str: A JSON string containing the semantically chunked text with metadata.
    """
    
    # Get the creation timestamp of the file
    timestamp = os.path.getctime(file_name)
    formatted_timestamp = datetime.datetime.fromtimestamp(os.stat(file_name).st_ctime).strftime('%Y-%m-%d')

    prompt = f"""
    You are given a transcript of a meeting with dialogue between different speakers. 
    Your task is to break the conversation into meaningful chunks and provide the output in JSON format.
    Each chunk should have a "text" field containing the chunk content and a "metadata" field with relevant details like category (e.g., Meeting Summary, Action Items, etc.), speaker information, the filename, and the timestamp of the transcript.

    Additionally:
    - If consecutive chunks have the same speaker and category, merge them into a single chunk. 
    - Ensure that the "text" field of the merged chunk combines the content in the order it appears in the transcript, separated by spaces.
    - Retain the metadata for the merged chunk based on the speaker, filename, and timestamp.

    The format should be:
    [
        {{
            "text": "combined chunk text here",
            "metadata": {{
                "category": "category name here",
                "speaker": "Speaker X",
                "filename": "{file_name}",
                "timestamp": "{formatted_timestamp}"
            }}
        }},
        ...
    ]

    Here's the meeting transcription text:

    {transcription_text}
    """

    try:
        # Send the prompt to the LLM model (assuming it's set up for edge functions)
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=16384,  # Adjust the token limit based on your needs
            temperature=0
        )

        refined_text = response.choices[0].message.content
        return refined_text
        
    except Exception as e:
        print(f"Error occurred: {e}")
        return json.dumps({"error": "An error occurred during semantic chunking."})

def refine_transcription_with_llm(transcription_text):
    """
    Pass the full transcription text to an LLM to refine it without losing any content.
    
    transcription_text: str
        The full transcription text to be refined by the LLM.
    
    Returns:
        str: The refined transcription text.
    """
    prompt = f"Please refine the following transcription without losing any content. Improve readability and flow while preserving the original meaning:\n\n{transcription_text}"
    
    try:
        # Call OpenAI GPT model to generate structured content (summary, action items, decisions)
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",  # Use "gpt-4" or "gpt-3.5-turbo"
            messages=[{"role": "user", "content": prompt}],
            max_tokens=16384,  # Adjust the token limit based on your needs
            temperature=0
        )
        
        refined_text = response.choices[0].message.content
        return refined_text
    except Exception as e:
        print(f"Error while refining transcription with LLM: {e}")
        return transcription_text  # Return the original text if there's an error


def generate_summary_and_action_items(transcription_text):
    # Define the prompt to extract summary, action items, and decisions
    prompt = f"""
    You are given a transcript of a meeting, with dialogue between different speakers. Your task is to summarize the content covered in the meeting and extract the action items in the format below. 
    Please focus on the key topics discussed, decisions made, and action items that need to be followed up on. The format should include:
    
    Meeting Summary: A high-level summary of the key topics discussed in the meeting.
    Action Items: A list of actionable tasks, including who is responsible for each task.
    Decisions Made: A list of any decisions that were made during the meeting.
    
    The input for this prompt will be in the format here:

    {transcription_text}
    """

    # Call OpenAI GPT model to generate structured content (summary, action items, decisions)
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",  # Use "gpt-4" or "gpt-3.5-turbo"
        messages=[{"role": "user", "content": prompt}],
        max_tokens=16384,  # Adjust the token limit based on your needs
        temperature=0
    )
    
    # Return the content of the response
    return response.choices[0].message.content

def process_audio(file_path):
    # Load and denoise the audio file
    audio, sr = librosa.load(file_path, sr=None)
    reduced_noise_audio = nr.reduce_noise(y=audio, sr=sr, prop_decrease=0.9, stationary=True)
    
    # Save the denoised audio to a temporary file
    denoised_audio_file = '/tmp/denoised_audio.wav'
    sf.write(denoised_audio_file, reduced_noise_audio, sr)

    # Perform speaker diarization using simple_diarizer
    segments = DIARIZER.diarize(denoised_audio_file, num_speakers=2)

    # Process each speaker segment and transcribe
    speaker_transcriptions = []
    current_speaker = None

    # Reload the denoised audio data for segmentation
    audio, sr = librosa.load(denoised_audio_file, sr=None)

    # Generate the transcription text
    transcription_text = ""
    for segment in segments:
        start_time = segment['start']
        end_time = segment['end']
        speaker_label = segment['label']

        # Convert the start and end times from seconds to sample indices
        start_sample = int(start_time * sr)
        end_sample = int(end_time * sr)

        # Extract the audio segment corresponding to the current speaker's time frame
        segment_audio = audio[start_sample:end_sample]

        # Save the extracted audio segment to a temporary file for Whisper to transcribe
        temp_segment_path = f"/tmp/temp_speaker_{speaker_label}_{int(start_time)}.wav"
        sf.write(temp_segment_path, segment_audio, sr)

        # Transcribe the audio segment using Whisper, forcing it to use English language
        transcription_result = WHISPER_MODEL.transcribe(temp_segment_path, language="en")

        # transcription_text += transcription_result["text"] + " "
        transcription_text += f"Speaker {speaker_label}: {transcription_result['text'].strip()} "

        # Delete the temporary file after processing
        os.remove(temp_segment_path)

        # Update the current speaker for the next iteration
        current_speaker = speaker_label

    # Delete the denoised audio file after processing
    os.remove(denoised_audio_file)

    # Generate the structured summary and action items using the transcription text
    structured_content = generate_summary_and_action_items(transcription_text)

    # Prepare to store the meeting data in MongoDB
    file_id = os.path.basename(file_path)  # You can use file name or generate a unique ID
    file_name = file_path
    mongodb_client.store_meeting_data(file_id, file_name, structured_content)

    # JSON to be stored for afterwards indexing
    json_response_from_chunking = semantic_chunker(transcription_text,file_name)
    cleaned_json_response = json_response_from_chunking.strip('```json').strip('```')
    cleaned_json_response = cleaned_json_response.replace("\n", "").replace("\\n", "").strip()
    # Parsed_content is the entire JSON output, maybe instead of storing 
    parsed_content = json.loads(cleaned_json_response)
    transform_and_index_parsed_content(parsed_content)
    # Okay now i want
    mongodb_client.store_meeting_data(file_id, file_name, parsed_content)


    # Prepare the JSON response
    response = {
        "summary": transcription_text,
        "file_id": file_id,
        "file_name": file_name
    }

    # Return the JSON string
    return json.dumps(response)


def process_transcript(file_path):
    # Generate the structured summary and action items using the transcription text
    structured_content = generate_summary_and_action_items(transcription_text)

    # Prepare to store the meeting data in MongoDB
    file_id = os.path.basename(file_path)  # You can use file name or generate a unique ID
    file_name = file_path
    mongodb_client.store_meeting_data(file_id, file_name, structured_content)

    # JSON to be stored for afterwards indexing
    json_response_from_chunking = semantic_chunker(transcription_text,file_name)
    cleaned_json_response = json_response_from_chunking.strip('```json').strip('```')
    cleaned_json_response = cleaned_json_response.replace("\n", "").replace("\\n", "").strip()
    # Parsed_content is the entire JSON output, maybe instead of storing 
    parsed_content = json.loads(cleaned_json_response)
    transform_and_index_parsed_content(parsed_content)
    # Okay now i want
    mongodb_client.store_meeting_data(file_id, file_name, parsed_content)


    # Prepare the JSON response
    response = {
        "summary": transcription_text,
        "file_id": file_id,
        "file_name": file_name
    }

    # Return the JSON string
    return json.dumps(response)


# Add the if __name__ == "__main__" block here:
if __name__ == "__main__":
    # Get the file path from the command-line arguments
    if len(sys.argv) < 2:
        print("Usage: python process_audio.py <file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]  
    process_audio(file_path)
