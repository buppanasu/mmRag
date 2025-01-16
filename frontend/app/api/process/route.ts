// import { NextResponse } from 'next/server'
// import { writeFile } from 'fs/promises'
// import { exec } from 'child_process'
// import { promisify } from 'util'

// const execAsync = promisify(exec)

// export async function POST(request: Request) {
//   const formData = await request.formData()
//   const file = formData.get('file') as File

//   if (!file) {
//     return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
//   }

//   // Save the file temporarily
//   const bytes = await file.arrayBuffer()
//   const buffer = Buffer.from(bytes)
//   const path = `/tmp/${file.name}`
//   await writeFile(path, buffer)

//   try {
//     // Call the Python script to process the file
//     await execAsync(`python3 ${process.cwd()}/../backend/process_audio_test.py ${path}`)

//     return NextResponse.json({ message: 'File processed successfully' })
//   } catch (error) {
//     console.error('Error processing file:', error)
//     return NextResponse.json({ error: 'Error processing file' }, { status: 500 })
//   }
// }

// import { NextResponse } from 'next/server'
// import { writeFile } from 'fs/promises'
// import { exec } from 'child_process'
// import { promisify } from 'util'

// const execAsync = promisify(exec)

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get('file') as File
//     const type = formData.get('type') as string

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
//     }

//     // Save the file temporarily
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)
//     const path = `/tmp/${file.name}`
//     await writeFile(path, buffer)

//     try {
//       // Call the appropriate processing script based on file type
//       if (type === 'audio') {
//         await execAsync(`python3 ${process.cwd()}/../backend/process_audio_test.py ${path}`);
//       } else if (type === 'transcript') {
//         await execAsync(`python3 ${process.cwd()}/../backend/process_transcript.py ${path}`);
//       } else if (type === 'excel' && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
//         await execAsync(`python3 ${process.cwd()}/../backend/process_excel.py ${path}`);
//       } else {
//         throw new Error('Invalid file type');
//       }

//       return NextResponse.json({ message: 'File processed successfully' })
//     } catch (error) {
//       console.error('Error processing file:', error)
//       return NextResponse.json({ error: 'Error processing file' }, { status: 500 })
//     }
//   } catch (error) {
//     console.error('Error handling upload:', error)
//     return NextResponse.json({ error: 'Error handling upload' }, { status: 500 })
//   }
// }

// import { NextResponse } from 'next/server'
// import { writeFile } from 'fs/promises'
// import { exec } from 'child_process'
// import { promisify } from 'util'
// import path from 'path'
// import fs from 'fs'

// const execAsync = promisify(exec)

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get('file') as File
//     const type = formData.get('type') as string

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
//     }

//     // Save the file temporarily
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)
//     const tempDir = '/tmp'
//     const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
//     const filePath = path.join(tempDir, safeName)
//     await writeFile(filePath, buffer)

//     try {
//       // Call the appropriate processing script based on file type
//       if (type === 'audio') {
//         await execAsync(`python3 ${process.cwd()}/../backend/process_audio_test.py ${filePath}`);
//       } else if (type === 'transcript') {
//         await execAsync(`python3 ${process.cwd()}/../backend/process_transcript.py ${filePath}`);
//       } else if (type === 'excel' && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
//         await execAsync(`python3 ${process.cwd()}/../backend/process_excel.py ${filePath}`);
//       } else {
//         throw new Error('Invalid file type');
//       }

//       return NextResponse.json({ 
//         message: 'File processed successfully',
//         filePath: safeName // Return the safe file name for later download
//       })
//     } catch (error: unknown) {
//       console.error('Error processing file:', error)
//       if (error instanceof Error) {
//         if (error.message === 'Invalid file type') {
//           return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
//         }
//         return NextResponse.json({ error: error.message }, { status: 500 })
//       } else {
//         return NextResponse.json({ error: 'An unknown error occurred while processing the file' }, { status: 500 })
//       }
//     }
//   } catch (error: unknown) {
//     console.error('Error handling upload:', error)
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 500 })
//     } else {
//       return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
//     }
//   }
// }


import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Save the file temporarily
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempDir = '/tmp'
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = path.join(tempDir, safeName)
    await writeFile(filePath, buffer)

    try {
      // Call the appropriate processing script based on file type
      if (type === 'audio') {
        await execAsync(`python3 ${process.cwd()}/../backend/process_audio_test.py ${filePath}`);
      } else if (type === 'transcript') {
        await execAsync(`python3 ${process.cwd()}/../backend/process_transcript.py ${filePath}`);
      } else if (type === 'excel' && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        const { stdout, stderr } = await execAsync(`python3 ${process.cwd()}/../backend/process_excel.py "${filePath}"`);
        
        if (stderr) {
          console.error('Python script error:', stderr);
          return NextResponse.json({ error: 'Error processing Excel file' }, { status: 500 });
        }

        try {
          const result = JSON.parse(stdout);
          if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
          }
          
          return NextResponse.json({ 
            message: result.message,
            filePath: path.basename(result.filePath)
          });
        } catch (parseError) {
          console.error('Error parsing Python script output:', parseError);
          return NextResponse.json({ error: 'Error processing response' }, { status: 500 });
        }
      } else {
        throw new Error('Invalid file type');
      }

      return NextResponse.json({ message: 'File processed successfully' })
    } catch (error: unknown) {
      console.error('Error processing file:', error)
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
    }
  } catch (error: unknown) {
    console.error('Error handling upload:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 })
  }
}

