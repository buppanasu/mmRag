import os
from dotenv import load_dotenv
import whisper
from sentence_transformers import SentenceTransformer
from simple_diarizer.diarizer import Diarizer

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
WHISPER_MODEL = whisper.load_model("medium")
SENTENCE_MODEL = SentenceTransformer("all-MiniLM-L6-v2")  # Used for embeddings
DIARIZER = Diarizer(embed_model='xvec', cluster_method='sc')



class QdrantConfig:
    QDRANT_URI = os.getenv("QDRANT_URI")
    QDRANT_COLLECTION_NAME = os.getenv("QDRANT_COLLECTION_NAME")

# MongoDb Configurations
class MongoDbConfig:
    db_name = os.getenv("MONGODB_DATABASE_NAME")
    collection_name = os.getenv("MONGODB_COLLECTION_NAME")
    uri = os.getenv("MONGODB_URI")




# # Check environment variables
# Mongodb = MongoDb()
# print("MONGODB_DATABASE_NAME:", Mongodb.db_name)
# print("MONGODB_COLLECTION_NAME:", Mongodb.collection_name)
# print("MONGODB_URI:", Mongodb.uri)