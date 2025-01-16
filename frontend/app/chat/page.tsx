// 'use client'

// import { useState, useRef } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Send, Loader2, Upload } from 'lucide-react'
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"

// type Message = {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
// };

// export default function ChatPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [input, setInput] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInput(e.target.value)
//   }

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     // Check if file is an Excel file
//     if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
//       setError('Please upload an Excel file (.xlsx or .xls)')
//       return
//     }

//     setIsUploading(true)
//     setError(null)

//     const formData = new FormData()
//     formData.append('file', file)

//     try {
//       const response = await fetch('/api/chat/upload', {
//         method: 'POST',
//         body: formData,
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to upload file')
//       }

//       // Add system message about successful upload
//       setMessages(prev => [...prev, {
//         id: Date.now().toString(),
//         role: 'assistant',
//         content: `Successfully processed questions from ${file.name}. You can now chat about the questions from the Excel file.`
//       }])
//     } catch (err) {
//       console.error("Error uploading file:", err)
//       setError(err instanceof Error ? err.message : 'Failed to upload file')
//     } finally {
//       setIsUploading(false)
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
  
//     if (!input.trim()) return
  
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: input.trim()
//     }
  
//     setMessages(prev => [...prev, userMessage])
//     setInput('')
//     setIsLoading(true)
//     setError(null)
  
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messages: [userMessage]
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to get response')
//       }

//       setMessages(prev => [...prev, {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: data.response
//       }])
//     } catch (err) {
//       console.error("Error sending message:", err)
//       setError(err instanceof Error ? err.message : 'An unknown error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <Card className="h-[80vh]">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Chat with MeetingMinds</CardTitle>
//           <div className="flex items-center gap-2">
//             <Input
//               type="file"
//               accept=".xlsx,.xls"
//               className="hidden"
//               onChange={handleFileUpload}
//               ref={fileInputRef}
//               disabled={isUploading}
//             />
//             <Button
//               variant="outline"
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isUploading}
//             >
//               {isUploading ? (
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//               ) : (
//                 <Upload className="h-4 w-4 mr-2" />
//               )}
//               Upload Questions
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="flex flex-col h-[calc(80vh-5rem)]">
//           <ScrollArea className="flex-1 pr-4">
//             <div className="space-y-4">
//               {messages.length === 0 && (
//                 <div className="text-center text-gray-500">
//                   Start a conversation by sending a message below or upload an Excel file containing questions.
//                 </div>
//               )}
              
//               {error && (
//                 <Alert variant="destructive" className="mb-4">
//                   <AlertDescription>
//                     Error: {error}. Please try again or contact support if the issue persists.
//                   </AlertDescription>
//                 </Alert>
//               )}

//               {messages.map(m => (
//                 <div
//                   key={m.id}
//                   className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
//                 >
//                   <div
//                     className={`rounded-lg px-4 py-2 max-w-[80%] ${
//                       m.role === 'user'
//                         ? 'bg-black text-white'
//                         : 'bg-gray-100 text-black'
//                     }`}
//                   >
//                     {m.content}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
          
//           <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
//             <input
//               value={input}
//               onChange={handleInputChange}
//               placeholder="Ask about your meetings..."
//               className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
//               disabled={isLoading}
//             />
//             <Button 
//               type="submit" 
//               className="bg-black text-white hover:bg-gray-800"
//               disabled={isLoading || !input.trim()}
//             >
//               {isLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Send className="h-4 w-4" />
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// } 


// 'use client'

// import { useState, useRef } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Send, Loader2, Upload } from 'lucide-react'
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Input } from "@/components/ui/input"

// type Message = {
//   id: string;
//   role: 'user' | 'assistant' | 'system';
//   content: string;
// };


// export default function ChatPage() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [input, setInput] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInput(e.target.value)
//   }

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
  
//     // Check if file is an Excel file
//     if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
//       setError('Please upload an Excel file (.xlsx or .xls)');
//       return;
//     }
  
//     setIsUploading(true);
//     setError(null);
  
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('type', 'excel'); // Add explicit file type
  
//     try {
//       const response = await fetch('/api/process', {
//         method: 'POST',
//         body: formData,
//       });
  
//       const data = await response.json();
  
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to upload file');
//       }
  
//       setMessages(prev => [
//         ...prev,
//         {
//           id: Date.now().toString(),
//           role: 'assistant',
//           content: `Successfully processed the Excel file ${file.name}. You can now chat about the content.`,
//         },
//       ]);
//     } catch (err) {
//       console.error('Error uploading file:', err);
//       setError(err instanceof Error ? err.message : 'Failed to upload file');
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!input.trim()) return

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: input.trim()
//     }

//     setMessages(prev => [...prev, userMessage])
//     setInput('')
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messages: [userMessage]
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to get response')
//       }

//       setMessages(prev => [...prev, {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: data.response
//       }])
//     } catch (err) {
//       console.error("Error sending message:", err)
//       setError(err instanceof Error ? err.message : 'An unknown error occurred')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <Card className="h-[80vh]">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Chat with MeetingMinds</CardTitle>
//           <div className="flex items-center gap-2">
//             <Input
//               type="file"
//               accept=".xlsx,.xls"
//               className="hidden"
//               onChange={handleFileUpload}
//               ref={fileInputRef}
//               disabled={isUploading}
//             />
//             <Button
//               variant="outline"
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isUploading}
//             >
//               {isUploading ? (
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//               ) : (
//                 <Upload className="h-4 w-4 mr-2" />
//               )}
//               Upload Questions
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="flex flex-col h-[calc(80vh-5rem)]">
//           <ScrollArea className="flex-1 pr-4">
//             <div className="space-y-4">
//               {messages.length === 0 && (
//                 <div className="text-center text-gray-500">
//                   Start a conversation by sending a message below or upload an Excel file containing questions.
//                 </div>
//               )}
              
//               {error && (
//                 <Alert variant="destructive" className="mb-4">
//                   <AlertDescription>
//                     {error}
//                   </AlertDescription>
//                 </Alert>
//               )}

//               {messages.map(m => (
//                 <div
//                   key={m.id}
//                   className={`flex ${
//                     m.role === 'user' 
//                       ? 'justify-end' 
//                       : m.role === 'system' 
//                         ? 'justify-center' 
//                         : 'justify-start'
//                   }`}
//                 >
//                   <div
//                     className={`rounded-lg px-4 py-2 max-w-[80%] ${
//                       m.role === 'user'
//                         ? 'bg-black text-white'
//                         : m.role === 'system'
//                         ? 'bg-gray-100 text-gray-600 text-sm'
//                         : 'bg-gray-100 text-black'
//                     }`}
//                   >
//                     {m.role === 'system' ? (
//                       <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
//                     ) : (
//                       m.content
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
          
//           <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
//             <Input
//               value={input}
//               onChange={handleInputChange}
//               placeholder="Ask about your meetings..."
//               className="flex-1"
//               disabled={isLoading}
//             />
//             <Button 
//               type="submit" 
//               className="bg-black text-white hover:bg-gray-800"
//               disabled={isLoading || !input.trim()}
//             >
//               {isLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Send className="h-4 w-4" />
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Upload, Download } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
  const [processedFilePath, setProcessedFilePath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload an Excel file (.xlsx or .xls)')
      return
    }

    setProcessingStatus('uploading')
    setError(null)
    setProcessedFilePath(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'excel')

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file')
      }

      setProcessingStatus('completed')
      if (data.filePath) {
        setProcessedFilePath(data.filePath)
      }

      // Add success message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Successfully processed the Excel file ${file.name}. You can now download the updated file with answers.`
      }])
    } catch (err) {
      console.error("Error uploading file:", err)
      setError(err instanceof Error ? err.message : 'Failed to upload file')
      setProcessingStatus('error')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDownload = async () => {
    if (!processedFilePath) return

    try {
      const response = await fetch(`/api/download?file=${processedFilePath}`)
      if (!response.ok) throw new Error('Failed to download file')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'processed_questions.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error downloading file:", err)
      setError(err instanceof Error ? err.message : 'Failed to download file')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [userMessage]
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response
      }])
    } catch (err) {
      console.error("Error sending message:", err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[80vh]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chat with MeetingMinds</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileUpload}
              ref={fileInputRef}
              disabled={processingStatus === 'uploading' || processingStatus === 'processing'}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={processingStatus === 'uploading' || processingStatus === 'processing'}
            >
              {processingStatus === 'uploading' || processingStatus === 'processing' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload Questions
            </Button>
            {processedFilePath && (
              <Button
                variant="outline"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Processed File
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(80vh-5rem)]">
          {(processingStatus === 'uploading' || processingStatus === 'processing') && (
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  {processingStatus === 'uploading' ? 'Uploading...' : 'Processing questions...'}
                </span>
                <span className="text-sm text-muted-foreground">
                  Please wait while we process your file
                </span>
              </div>
              <Progress value={processingStatus === 'uploading' ? 30 : 70} className="h-2" />
            </div>
          )}

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500">
                  Start a conversation by sending a message below or upload an Excel file containing questions.
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      m.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your meetings..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-black text-white hover:bg-gray-800"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

