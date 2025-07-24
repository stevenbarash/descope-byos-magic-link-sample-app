"use client"
import { useState, useEffect } from "react"
import { CheckCircle, Mail, RefreshCw, AlertCircle } from "lucide-react"

interface MagicLinkSentProps {
  email: string;
  onPolling: () => void;
  onResendClick: () => void;
  onChange: () => void;
  errorText?: string;
  state?: any;
}

export default function MagicLinkSent({ 
  email, 
  onPolling, 
  onResendClick, 
  onChange, 
  errorText, 
  state 
}: MagicLinkSentProps) {
  const [canResend, setCanResend] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  // Handle polling for magic link authentication
  useEffect(() => {
    const pollInterval = setInterval(() => {
      onPolling()
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [onPolling])

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCountdown])

  const handleResend = async () => {
    if (canResend) {
      setIsResending(true)
      setCanResend(false)
      setResendCountdown(60) // 60 second countdown
      await onResendClick()
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Check your email
            </h1>
            <p className="text-gray-300 text-sm">
              We've sent a magic link to your inbox
            </p>
          </div>

          {/* Email Display */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <p className="text-gray-400 text-sm mb-1">Magic link sent to:</p>
            <p className="text-white font-medium break-all">{email}</p>
          </div>

          {/* Instructions */}
          <div className="text-center mb-8">
            <p className="text-gray-300 text-sm leading-relaxed">
              Click the link in your email to sign in. The link will expire in 10 minutes.
            </p>
          </div>

          {/* Loading State */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <span className="text-gray-300 text-sm">Checking for authentication...</span>
            </div>
          </div>

          {/* Error Message */}
          {errorText && (
            <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{errorText}</p>
            </div>
          )}

          {/* Resend Section */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
            <p className="text-gray-300 text-sm text-center mb-4">
              Didn't receive the email?
            </p>
            <button
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                canResend && !isResending
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleResend}
              disabled={!canResend || isResending}
            >
              <div className="flex items-center justify-center space-x-2">
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : canResend ? (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send again</span>
                  </>
                ) : (
                  <>
                    <span>Send again in {resendCountdown}s</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Help Links */}
          <div className="text-center space-y-3">
            <a 
              href="#" 
              className="block text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
            >
              Get help signing in
            </a>
            <a 
              href="#" 
              className="block text-gray-400 hover:text-gray-300 text-xs transition-colors duration-200"
            >
              Learn more about our security
            </a>
          </div>
        </div>

        {/* Back to Sign In */}
        <div className="text-center mt-6">
          <button
            onClick={onChange}
            className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    </div>
  )
} 