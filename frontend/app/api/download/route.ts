import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('file')

    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 })
    }

    // Ensure we only access files from the temp directory
    const fullPath = path.join('/tmp', path.basename(filePath))
    
    try {
      const fileBuffer = await readFile(fullPath)
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="processed_questions.xlsx"`,
        },
      })
    } catch (error) {
      console.error('Error reading file:', error)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error handling download:', error)
    return NextResponse.json({ error: 'Error processing download request' }, { status: 500 })
  }
}

