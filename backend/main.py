from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
import traceback
import os
from openai import OpenAI
from config import OPENAI_API_KEY, WHISPER_MODEL, DIARIZER

class ChatRequest(BaseModel):
    message: str


openai_client = OpenAI()
app = FastAPI()

# Update CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Qdrant client and Sentence Transformer model
qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
client = QdrantClient(url=qdrant_url)
model = SentenceTransformer('all-MiniLM-L6-v2')

def query_qdrant(query: str):
    try:
        query_embedding = model.encode([query])[0]
        result = client.search(
            collection_name="mm_collection",
            query_vector=query_embedding.tolist(),
            limit=1,
        )
        
        if not result:
            return ["No relevant documents found."]
        
        documents = []
        for hit in result:
            if isinstance(hit.payload, dict):
                # Check for 'text' key, fallback to string representation of payload
                doc = hit.payload.get('text', str(hit.payload))
            else:
                doc = str(hit.payload)
            documents.append(doc)
        
        return documents
    except Exception as e:
        print(f"Error in query_qdrant: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Qdrant query error: {str(e)}")

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        user_message = request.message
        
        if not user_message:
            raise HTTPException(status_code=400, detail="Empty message")

        relevant_docs = query_qdrant(user_message)

        if not relevant_docs:
            return "I couldn't find any relevant information in the meeting summaries. Please try asking something else."

        prompt = f"""
        You are an AI assistant designed to help answer the user's questions which will be related to what transpired in the meeting. 
        Below is the context provided to you, for you to make use of to help answer the user's queries:
        {chr(10).join(relevant_docs)}
        
        User's Question: "{user_message}"
        """

        # Call OpenAI GPT model (make sure this part is correctly implemented)
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=16384,
            temperature=0
        )
        
        return response.choices[0].message.content

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

