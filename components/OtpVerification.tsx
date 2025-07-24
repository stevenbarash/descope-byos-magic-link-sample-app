"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Shield, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"

interface OtpVerificationProps {
  email: string
  onSubmit: (data: { form: { code: string }, sentTo: { maskedEmail: string } }) => void
  onResendClick: () => void
  onBackClick: () => void
  errorText?: string
  onFormUpdate?: (data: Record<string, string>) => void
  onChange?: () => void
  state?: { error?: { text?: string, code?: string }, screenName?: string, next?: (stepId: string, data?: any) => Promise<void> }
}

export default function OtpVerification({
  email,
  onSubmit,
  onResendClick,
  onBackClick,
  errorText,
  onFormUpdate,
  onChange,
  state,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Reset OTP input when error is E061102
  useEffect(() => {
    if (state?.error?.code === "E061102") {
      setOtp(Array(6).fill(""))
      setIsSubmitting(false)
    }
  }, [state?.error?.code])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(0, 1)
    setOtp(newOtp)

    // Update form state
    if (onFormUpdate) {
      onFormUpdate({ code: newOtp.join('') })
    }
    if (onChange) {
      onChange()
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a valid OTP (numbers only)
    if (!/^\d+$/.test(pastedData)) return

    // Fill the OTP fields with pasted data
    const newOtp = [...otp]
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex((val) => !val)
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      setIsSubmitting(true)
      onSubmit({
        form: {
          code: otpValue
        },
        sentTo: {
          maskedEmail: email
        }
      })

      // Reset submitting state after a delay (in case of error)
      setTimeout(() => {
        setIsSubmitting(false)
      }, 2000)
    }
  }

  // Handle resend click
  const handleResend = () => {
    if (canResend) {
      setIsResending(true)
      onResendClick()

      // Reset the countdown
      setTimeout(() => {
        setIsResending(false)
        setCanResend(false)
        setCountdown(60)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Enter verification code
            </h1>
            <p className="text-gray-300 text-sm">
              We've sent a 6-digit code to {email}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  ref={(el) => { inputRefs.current[index] = el }}
                  className="w-12 h-12 text-center text-xl font-semibold bg-white/5 border border-white/20 rounded-xl text-white focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Error Message */}
            {errorText && (
              <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errorText}</p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 mb-6 ${
              otp.join("").length === 6 && !isSubmitting
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={otp.join("").length !== 6 || isSubmitting}
          >
            <div className="flex items-center justify-center space-x-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                </>
              )}
            </div>
          </button>

          {/* Action Links */}
          <div className="space-y-4">
            <button
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                canResend && !isResending
                  ? 'bg-white/5 border border-white/20 hover:bg-white/10 text-white'
                  : 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleResend}
              disabled={!canResend || isResending}
            >
              <div className="flex items-center justify-center space-x-2">
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resending...</span>
                  </>
                ) : canResend ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend code</span>
                  </>
                ) : (
                  <>
                    <span>Resend code in {countdown}s</span>
                  </>
                )}
              </div>
            </button>

            <button 
              className="w-full py-3 px-4 text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2"
              onClick={onBackClick}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Use a different email address</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
