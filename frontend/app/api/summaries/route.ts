// import { NextResponse } from 'next/server'
// import { MongoClient } from 'mongodb'

// const uri = process.env.MONGODB_URI
// const client = new MongoClient("mongodb://localhost:27017/")

// export async function GET() {
//   try {
//     await client.connect()
//     const database = client.db('sitnvidia')
//     const collection = database.collection('transcription_summaries')
    
//     const summaries = await collection.find({}).toArray()
    
//     return NextResponse.json(summaries)
//   } catch (error) {
//     console.error('Error fetching summaries:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   } finally {
//     await client.close()
//   }
// }
import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

// Check if MongoDB URI exists
const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables')
}

// Create client with verified URI
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const database = client.db('sitnvidia')
    const collection = database.collection('transcription_summaries')
    
    // Fetch all documents from the transcription_summaries collection, excluding those with array-type file_content
    const summaries = await collection.find({
      file_content: { $not: { $type: "array" } }
    }).toArray()
    
    // Transform the data to match the expected format
    const transformedSummaries = summaries.map(doc => ({
      _id: doc._id.toString(),
      file_id: doc.file_id,
      file_name: doc.file_name,
      file_content: doc.file_content,
      timestamp: doc.timestamp
    }))
    
    return NextResponse.json(transformedSummaries)
  } catch (error) {
    console.error('Error fetching summaries:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await client.close()
  }
}

