"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Sparkles, User } from "lucide-react"

interface AuthSuccessProps {
  userName?: string
  onContinue: () => void
}

export default function AuthSuccess({ userName, onContinue }: AuthSuccessProps) {
  const [animationComplete, setAnimationComplete] = useState(false)

  // Handle success animation completion
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1500)

    return () => clearTimeout(animationTimer)
  }, [])

  const displayName = userName || "there"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-1500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-1000 ${
              animationComplete 
                ? 'bg-green-500/20 border-2 border-green-400' 
                : 'bg-blue-500/20 border-2 border-blue-400'
            }`}>
              <CheckCircle className={`w-10 h-10 transition-all duration-1000 ${
                animationComplete ? 'text-green-400 scale-110' : 'text-blue-400'
              }`} />
            </div>

            {/* Sparkles Animation */}
            {animationComplete && (
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-8 left-8 w-4 h-4 text-yellow-400 animate-bounce" />
                <Sparkles className="absolute top-12 right-12 w-3 h-3 text-pink-400 animate-bounce delay-300" />
                <Sparkles className="absolute bottom-8 left-12 w-4 h-4 text-blue-400 animate-bounce delay-500" />
                <Sparkles className="absolute bottom-12 right-8 w-3 h-3 text-purple-400 animate-bounce delay-700" />
              </div>
            )}
          </div>

          {/* Success Content */}
          <div className={`text-center transition-all duration-1000 ${
            animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h1 className="text-2xl font-bold text-white mb-2">
              Authentication Successful!
            </h1>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <User className="w-5 h-5 text-gray-300" />
              <p className="text-gray-300 text-lg">
                Welcome back, <span className="text-white font-semibold">{displayName}</span>!
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-gray-300 text-sm leading-relaxed">
                You are now authenticated and can safely close this tab. 
                Your session is active and secure.
              </p>
            </div>

            {/* Success Indicators */}
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Session Active</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Secure Connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Success Message */}
        {animationComplete && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                Successfully authenticated
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
