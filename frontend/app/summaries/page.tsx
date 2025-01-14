// 'use client'

// import { useState, useEffect } from 'react'
// import { Search } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"

// interface Meeting {
//   _id: string;
//   file_id: string;
//   file_name: string;
//   file_content: string;
//   timestamp: number;
// }

// export default function SummariesPage() {
//   const [meetings, setMeetings] = useState<Meeting[]>([])
//   const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")

//   useEffect(() => {
//     const fetchMeetings = async () => {
//       try {
//         const response = await fetch('/api/summaries')
//         if (!response.ok) {
//           throw new Error('Failed to fetch meetings')
//         }
//         const data = await response.json()
//         setMeetings(data)
//         if (data.length > 0) {
//           setSelectedMeeting(data[0])
//         }
//       } catch (error) {
//         console.error('Error fetching meetings:', error)
//       }
//     }
//     fetchMeetings()
//   }, [])

//   const filteredMeetings = meetings.filter(meeting =>
//     meeting?.file_id?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
//   )

//   // Function to format markdown content into sections
//   const formatContent = (content: string | undefined) => {
//     if (!content) {
//       return {
//         summary: '',
//         actionItems: '',
//         decisions: ''
//       }
//     }

//     const sections = {
//       summary: content.match(/\*\*Meeting Summary:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/)?.[1] || '',
//       actionItems: content.match(/\*\*Action Items:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/)?.[1] || '',
//       decisions: content.match(/\*\*Decisions Made:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/)?.[1] || ''
//     }

//     return sections
//   }

//   return (
//     <div className="flex flex-col md:flex-row gap-6">
//       {/* Left Panel */}
//       <div className="w-full md:w-80 shrink-0">
//         <div className="space-y-4">
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search meetings"
//               className="pl-8"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
          
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold">Meeting Summaries</h2>
            
//             {filteredMeetings.map((meeting) => (
//               <Card 
//                 key={meeting._id} 
//                 className={`cursor-pointer hover:bg-accent ${selectedMeeting?._id === meeting._id ? 'bg-accent' : ''}`}
//                 onClick={() => setSelectedMeeting(meeting)}
//               >
//                 <CardHeader className="p-4">
//                   <CardTitle className="text-base">{meeting.file_id}</CardTitle>
//                 </CardHeader>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right Panel */}
//       {selectedMeeting && (
//         <div className="flex-1">
//           <Card className="h-full">
//             <CardHeader>
//               <CardTitle className="text-2xl">{selectedMeeting.file_id}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Tabs defaultValue="summary" className="w-full">
//                 <TabsList>
//                   <TabsTrigger value="summary">Meeting Summary</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="summary" className="mt-6">
//                   {(() => {
//                     const sections = formatContent(selectedMeeting.file_content)
//                     return (
//                       <div className="space-y-8">
//                         {/* Meeting Summary Section */}
//                         <div className="space-y-4">
//                           <h2 className="text-xl font-semibold text-primary">Meeting Summary</h2>
//                           <div className="text-muted-foreground leading-relaxed">
//                             {sections.summary}
//                           </div>
//                         </div>

//                         <Separator />

//                         {/* Action Items Section */}
//                         <div className="space-y-4">
//                           <h2 className="text-xl font-semibold text-primary">Action Items</h2>
//                           <div className="space-y-6">
//                             {sections.actionItems.split(/\d+\.\s+\*\*/).filter(Boolean).map((item, index) => {
//                               const [title, ...details] = item.split(/\*\*\s+/)
//                               return (
//                                 <div key={index} className="space-y-2">
//                                   <h3 className="font-medium text-lg">{title.trim()}</h3>
//                                   <div className="pl-4 space-y-1 text-muted-foreground">
//                                     {details.join('')
//                                       .split('\n')
//                                       .filter(line => line.trim())
//                                       .map((line, i) => (
//                                         <p key={i}>{line.replace(/^\s*-\s*/, '')}</p>
//                                       ))}
//                                   </div>
//                                 </div>
//                               )
//                             })}
//                           </div>
//                         </div>

//                         <Separator />

//                         {/* Decisions Made Section */}
//                         <div className="space-y-4">
//                           <h2 className="text-xl font-semibold text-primary">Decisions Made</h2>
//                           <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
//                             {sections.decisions.split(/\d+\.\s+/).filter(Boolean).map((decision, index) => (
//                               <li key={index} className="leading-relaxed">
//                                 {decision.trim()}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     )
//                   })()}
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Meeting {
  _id: string;
  file_id: string;
  file_name: string;
  file_content: string;
  timestamp: string;
}

export default function SummariesPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch('/api/summaries')
        if (!response.ok) {
          throw new Error('Failed to fetch meetings')
        }
        const data = await response.json()
        setMeetings(data)
        if (data.length > 0) {
          setSelectedMeeting(data[0])
        }
      } catch (error) {
        console.error('Error fetching meetings:', error)
        setError(error instanceof Error ? error.message : 'Failed to load meetings')
      }
    }
    fetchMeetings()
  }, [])

  const filteredMeetings = meetings.filter(meeting =>
    meeting?.file_id?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  )

  // Function to format markdown content into sections
  const formatContent = (content: string | undefined) => {
    if (!content) {
      return {
        summary: '',
        actionItems: '',
        decisions: ''
      }
    }

    const sections = {
      summary: content.match(/\*\*Meeting Summary:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/)?.[1] || '',
      actionItems: content.match(/\*\*Action Items:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/)?.[1] || '',
      decisions: content.match(/\*\*Decisions Made:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/)?.[1] || ''
    }

    return sections
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left Panel */}
      <div className="w-full md:w-80 shrink-0">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Meeting Summaries</h2>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {filteredMeetings.map((meeting) => (
              <Card 
                key={meeting._id} 
                className={`cursor-pointer hover:bg-accent ${selectedMeeting?._id === meeting._id ? 'bg-accent' : ''}`}
                onClick={() => setSelectedMeeting(meeting)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{meeting.file_id}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {selectedMeeting && (
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedMeeting.file_id}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  <TabsTrigger value="summary">Meeting Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-6">
                  {(() => {
                    const sections = formatContent(selectedMeeting.file_content)
                    return (
                      <div className="space-y-8">
                        {/* Meeting Summary Section */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold text-primary">Meeting Summary</h2>
                          <div className="text-muted-foreground leading-relaxed">
                            {sections.summary}
                          </div>
                        </div>

                        <Separator />

                        {/* Action Items Section */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold text-primary">Action Items</h2>
                          <div className="space-y-6">
                            {sections.actionItems.split(/\d+\.\s+\*\*/).filter(Boolean).map((item, index) => {
                              const [title, ...details] = item.split(/\*\*\s+/)
                              return (
                                <div key={index} className="space-y-2">
                                  <h3 className="font-medium text-lg">{title.trim()}</h3>
                                  <div className="pl-4 space-y-1 text-muted-foreground">
                                    {details.join('')
                                      .split('\n')
                                      .filter(line => line.trim())
                                      .map((line, i) => (
                                        <p key={i}>{line.replace(/^\s*-\s*/, '')}</p>
                                      ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <Separator />

                        {/* Decisions Made Section */}
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold text-primary">Decisions Made</h2>
                          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            {sections.decisions.split(/\d+\.\s+/).filter(Boolean).map((decision, index) => (
                              <li key={index} className="leading-relaxed">
                                {decision.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

