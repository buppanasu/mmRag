from qdrant_client import QdrantClient as QC
from qdrant_client.http.models import PointStruct, VectorParams, Distance
from config import QdrantConfig, SENTENCE_MODEL
import uuid

class QdrantClient:
    """
    A client for interacting with Qdrant.
    This class provides methods to interact with a Qdrant instance, 
    while handling client initialization and connections.
    """
    def __init__(self):
        self.client = self.initialize_client()

    def initialize_client(self):
        """
        Set up and return a client connected to the Qdrant server.

        :return: QdrantClient object to interact with Qdrant
        """
        try:
            client = QC(url=QdrantConfig.QDRANT_URI)
            self.collection_name = QdrantConfig.QDRANT_COLLECTION_NAME
            self.sentence_model = SENTENCE_MODEL
            return client
        except Exception as e:
            print(f"Error initializing Qdrant client: {e}")
            raise

    def embed_and_index_transcription(self, transcription_text):
        """
        Split the transcription into semantic chunks using an LLM, generate embeddings for each chunk,
        and index the chunks into Qdrant.

        :param transcription_text: The transcription text to be processed
        :param sentence_model: The sentence transformer model used to generate embeddings
        """
        # Step 1: Chunk the transcription semantically using an LLM
        chunks = self.chunk_transcription_with_llm(transcription_text)

        # Step 2: Generate embeddings for the chunks
        embeddings = self.sentence_model.encode(chunks, convert_to_tensor=True)

        # Step 3: Prepare points for indexing in Qdrant
        points = [
            PointStruct(
                id=str(uuid.uuid4()),  # Generate a unique ID for each chunk
                vector=embedding.tolist(),
                payload={"chunk": chunk}
            )
            for embedding, chunk in zip(embeddings, chunks)
        ]

        # Step 4: Index the chunks into Qdrant
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

        print(f"Indexed {len(points)} semantic chunks into Qdrant collection.")

    def chunk_transcription_with_llm(self, transcription_text):
        """
        Use an LLM to semantically chunk the transcription text.
        
        :param transcription_text: The transcription text to be chunked
        :return: List of semantic chunks
        """
        prompt = f"Please split the following transcription into meaningful chunks, based on natural breaks in content. Each chunk should be put on a new line and represent a coherent idea or topic:\n\n{transcription_text}"
        
        try:
            # Call the LLM API (e.g., OpenAI GPT-3 or GPT-4) to chunk the transcription
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",  # Use GPT-3 or GPT-4 model
                messages=[{"role": "user", "content": prompt}],
                max_tokens=16384,  # Adjust as needed for the length of your transcription
                temperature=0 # Adjust for creativity in chunking
            )

            # Return the content of the response
            chunked_text = response.choices[0].message.content
            
            # Split the chunked text into individual chunks (you can further adjust how the chunks are split)
            chunks = chunked_text.split("\n")  # Split by new lines (assuming each chunk is on a new line)
            return [chunk.strip() for chunk in chunks if chunk.strip()]
        
        except Exception as e:
            print(f"Error while chunking transcription with LLM: {e}")
            return [transcription_text]  # Return the original text if there's an error