import pymongo, os, datetime
from config import MongoDbConfig
from pymongo import MongoClient

class MongoDBClient:
    """
    A client interface for interacting with MongoDB using pymongo.
    This class provides methods to insert and delete documents from a MongoDB
    database, while handling client initialization and connections.
    """
    def __init__(self):
        self.mongodb_client = self.initialize_client()

    def initialize_client(self):
        """
        Set up and return a client connected to the MongoDB server

        :return: mongodb_client object to interact with MongoDB
        """
        try:
            self.client = MongoClient(MongoDbConfig.uri)
            self.db = self.client[MongoDbConfig.db_name]
            self.collection = self.db[MongoDbConfig.collection_name]
        except Exception as e:
            print(f"Error initializing MongoDB client: {e}")
            raise

    def store_meeting_data(self, file_id, file_name, file_content):
        """
        Store meeting data (file ID, file name, content) in the MongoDB collection.

        :param file_id: ID of the file (e.g., filename or unique ID)
        :param file_name: Name of the file
        :param file_content: Content of the file (e.g., transcription or summary)
        """

        # Create the document to store in MongoDB
        meeting_data = {
            "file_id": file_id,
            "file_name": file_name,
            "file_content": file_content,
            # "timestamp": datetime.datetime.fromtimestamp(os.path.getmtime(file_name)).strftime('%Y-%m-%d')
            "timestamp": datetime.datetime.fromtimestamp(os.stat(file_name).st_ctime).strftime('%Y-%m-%d')
        }

        # Insert the meeting data into MongoDB
        try:
            result = self.collection.insert_one(meeting_data)
            print(f"Inserted document with ID: {result.inserted_id}")
        except Exception as e:
            print(f"Error inserting data into MongoDB: {e}")
            raise
        
    def store_transcription_result(self, transcription_document):
        """
        Store the transcription result document in MongoDB.
        
        transcription_document: dict
            The document containing the transcription content and metadata.
        """
        try:
            # Insert the transcription result into the collection
            self.collection.insert_one(transcription_document)
            print("Transcription result stored successfully.")
        except Exception as e:
            print(f"Error storing transcription result: {e}")
    

    


