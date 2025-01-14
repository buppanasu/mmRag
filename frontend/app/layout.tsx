import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MeetingMinds',
  description: 'Upload and manage your meeting recordings and summaries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-white">
          <header className="border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="text-xl font-bold text-black">MeetingMinds</Link>
                <nav>
                  <ul className="flex space-x-4">
                    <li>
                      <Button variant="ghost" asChild className="text-gray-600 hover:text-black">
                        <Link href="/upload">Upload</Link>
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" asChild className="text-gray-600 hover:text-black">
                        <Link href="/summaries">Meeting Summaries</Link>
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" asChild className="text-gray-600 hover:text-black">
                        <Link href="/chat">Question and Answer</Link>
                      </Button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
              © 2025 MeetingMinds. A DSAIL Project
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
