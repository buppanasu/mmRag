import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Save the file temporarily
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const path = `/tmp/${file.name}`
  await writeFile(path, buffer)

  try {
    // Call the Python script to process the file
    await execAsync(`python3 ${process.cwd()}/../backend/process_audio_test.py ${path}`)

    return NextResponse.json({ message: 'File processed successfully' })
  } catch (error) {
    console.error('Error processing file:', error)
    return NextResponse.json({ error: 'Error processing file' }, { status: 500 })
  }
}

