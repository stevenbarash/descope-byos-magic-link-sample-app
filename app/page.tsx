"use client"

import { useEffect, useState } from "react"
import { useSession } from "@descope/nextjs-sdk/client"
import { useRouter } from "next/navigation"
import AuthFlow from "@/components/AuthFlow"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useSession()
  const [isClient, setIsClient] = useState(false)

  // Ensure client-side rendering to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  // Show loading state during hydration
  if (!isClient) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 animate-pulse"></div>
              <div className="h-8 bg-gray-600/50 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-600/30 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full">
      <AuthFlow />
    </main>
  )
}
