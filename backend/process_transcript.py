from process_audio_test import generate_summary_and_action_items, semantic_chunker, transform_and_index_parsed_content
from docx import Document
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

def extract_text_from_docx(file_path):
    """Extract text from a DOCX file."""
    doc = Document(file_path)
    full_text = []
    for paragraph in doc.paragraphs:
        full_text.append(paragraph.text)
    return '\n'.join(full_text)


def process_transcript(file_path):
    # Extract text from DOCX file
    try:
        transcription_text = extract_text_from_docx(file_path)
    except Exception as e:
        print(f"Error extracting text from document: {str(e)}")
        return json.dumps({"error": "Failed to extract text from document"})

    # Generate the structured summary and action items using the transcription text
    structured_content = generate_summary_and_action_items(transcription_text)

    # Prepare to store the meeting data in MongoDB
    file_id = os.path.basename(file_path)
    file_name = file_path
    mongodb_client.store_meeting_data(file_id, file_name, structured_content)

    # JSON to be stored for afterwards indexing
    json_response_from_chunking = semantic_chunker(transcription_text, file_name)
    cleaned_json_response = json_response_from_chunking.strip('```json').strip('```')
    cleaned_json_response = cleaned_json_response.replace("\n", "").replace("\\n", "").strip()
    parsed_content = json.loads(cleaned_json_response)
    transform_and_index_parsed_content(parsed_content)
    mongodb_client.store_meeting_data(file_id, file_name, parsed_content)

    # Prepare the JSON response
    response = {
        "transcription": transcription_text,  # Changed from summary to transcription
        "file_id": file_id,
        "file_name": file_name
    }

    return json.dumps(response)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_transcript.py <file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    result = process_transcript(file_path)
    print(result)