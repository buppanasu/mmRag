import { NextResponse } from 'next/server'

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }
    
    const lastMessage = messages[messages.length - 1]
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(`${FASTAPI_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: lastMessage.content
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await response.text()

      if (!response.ok) {
        let errorMessage = data
        try {
          const errorJson = JSON.parse(data)
          errorMessage = errorJson.detail || errorJson.error || data
        } catch {
          // If parsing fails, use the raw text
        }
        throw new Error(errorMessage)
      }

      return NextResponse.json({ response: data })
    } catch (fetchError: unknown) {
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Request to FastAPI server timed out')
        }
        throw fetchError
      }
      throw new Error('An unknown error occurred while fetching from the FastAPI server')
    }

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

