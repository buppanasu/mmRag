import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <h1 className="text-4xl font-bold mb-4 text-center text-black">Welcome to MeetingMinds</h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Upload your meeting recordings and get meeting summaries and insights
      </p>
      <div className="flex space-x-4">
        <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
          <Link href="/upload">Upload Recording</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-gray-200">
          <Link href="/summaries">View Summaries</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="bg-black text-white hover:bg-gray-800">
          <Link href="/chat">Question and Answer</Link>
        </Button>
      </div>
    </div>
  )
}

