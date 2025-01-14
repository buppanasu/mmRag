'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setStatus('idle')
      setResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setStatus('uploading')

    const formData = new FormData()
    formData.append('file', file)

    try {
      setStatus('processing')

      const processResponse = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      if (!processResponse.ok) {
        throw new Error('Processing failed')
      }

      const data = await processResponse.json()
      setResult(data.result)
      setStatus('success')
    } catch (error) {
      console.error('Error:', error)
      setStatus('error')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload and Process Audio File</CardTitle>
          <CardDescription>Upload your meeting audio file for analysis</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="audio-file">Audio File</Label>
                <Input id="audio-file" type="file" accept="audio/*" onChange={handleFileChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2">
            <Button type="submit" disabled={!file || status !== 'idle'} className="w-full">
              {status === 'uploading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {status === 'processing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {status === 'idle' && <Upload className="mr-2 h-4 w-4" />}
              {status === 'idle' && 'Upload and Process'}
              {status === 'uploading' && 'Uploading...'}
              {status === 'processing' && 'Processing...'}
              {status === 'success' && 'Completed'}
              {status === 'error' && 'Try Again'}
            </Button>
            {status === 'success' && (
              <div className="flex items-center text-green-600">
                <Check className="w-4 h-4 mr-2" />
                <span>File processed successfully</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>Error occurred during processing</span>
              </div>
            )}
            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md">
                <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

