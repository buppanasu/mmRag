'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UploadPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Please upload an audio file')
        setAudioFile(null)
        return
      }
      setAudioFile(file)
      setError(null)
      setStatus('idle')
    }
  }

  const handleTranscriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['.txt', '.doc', '.docx']
      const isValid = validTypes.some(type => file.name.toLowerCase().endsWith(type))
      if (!isValid) {
        setError('Please upload a valid transcript file (.txt, .doc, .docx)')
        setTranscriptFile(null)
        return
      }
      setTranscriptFile(file)
      setError(null)
      setStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, type: 'audio' | 'transcript') => {
    e.preventDefault()
    const file = type === 'audio' ? audioFile : transcriptFile
    if (!file) return

    setStatus('uploading')
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process file')
      }

      setStatus('success')
      
      // Reset the file input
      if (type === 'audio') {
        setAudioFile(null)
      } else {
        setTranscriptFile(null)
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during processing')
      setStatus('error')
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Upload Meeting Content</CardTitle>
          <CardDescription>
            Upload your meeting audio file or transcript for AI analysis
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="audio" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio">Audio Upload</TabsTrigger>
            <TabsTrigger value="transcript">Transcript Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio">
            <form onSubmit={(e) => handleSubmit(e, 'audio')}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="audio-file">Audio File</Label>
                    <Input 
                      id="audio-file" 
                      type="file" 
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: MP3, WAV, M4A
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={!audioFile || status === 'uploading'} 
                  className="w-full"
                >
                  {status === 'uploading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Audio...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Audio
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="transcript">
            <form onSubmit={(e) => handleSubmit(e, 'transcript')}>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="transcript-file">Transcript File</Label>
                    <Input 
                      id="transcript-file" 
                      type="file" 
                      accept=".txt,.doc,.docx"
                      onChange={handleTranscriptFileChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">
                      Supported formats: TXT, DOC, DOCX
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={!transcriptFile || status === 'uploading'} 
                  className="w-full"
                >
                  {status === 'uploading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Transcript...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Transcript
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="px-6 pb-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600 px-6 pb-6">
            <Check className="h-4 w-4" />
            <span>File processed successfully</span>
          </div>
        )}
      </Card>
    </div>
  )
}

