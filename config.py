import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_DATABASE_NAME = os.getenv("MONGODB_DATABASE_NAME")
MONGODB_COLLECTION_NAME = os.getenv("MONGODB_COLLECTION_NAME")
MONGODB_URI = os.getenv("MONGODB_URI")



class MongoDb:
    db_name = os.getenv("MONGODB_DATABASE_NAME")
    collection_name = os.getenv("MONGODB_COLLECTION_NAME")
    uri = os.getenv("MONGODB_URI")


# # Check environment variables
# Mongodb = MongoDb()
# print("MONGODB_DATABASE_NAME:", Mongodb.db_name)
# print("MONGODB_COLLECTION_NAME:", Mongodb.collection_name)
# print("MONGODB_URI:", Mongodb.uri)