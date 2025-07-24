"use client"
import { useState, useEffect } from "react"
import { Mail, ArrowRight, AlertCircle } from "lucide-react"

interface EmailInputProps {
  onFormUpdate: (data: Record<string, string>) => void;
  onClick: () => void;
  onChange: () => void;
  errorText?: string;
}

export default function EmailInput({ onFormUpdate, onClick, onChange, errorText }: EmailInputProps) {
  const [email, setEmail] = useState("")
  const [focused, setFocused] = useState(false)
  const [valid, setValid] = useState(true)
  const [animating, setAnimating] = useState(false)

  // Email validation
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setValid(emailRegex.test(email))
    } else {
      setValid(true)
    }
  }, [email])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    onFormUpdate({ [e.target.name]: e.target.value })
    onChange()
  }

  const handleSubmit = () => {
    if (email && valid) {
      setAnimating(true)
      setTimeout(() => {
        onClick()
      }, 600)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && email && valid) {
      handleSubmit()
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
              Welcome back
            </h1>
            <p className="text-gray-300 text-sm">
              Enter your email to sign in or create an account
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className={`w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 transition-all duration-200 ${
                  focused 
                    ? 'border-blue-500/50 bg-white/10' 
                    : 'border-white/20 hover:border-white/30'
                } ${
                  !valid && email 
                    ? 'border-red-500/50 bg-red-500/5' 
                    : ''
                }`}
                required
              />
              <Mail className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                focused ? 'text-blue-400' : 'text-gray-400'
              }`} />
            </div>

            {/* Validation Error */}
            {!valid && email && (
              <div className="flex items-center space-x-2 mt-3 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Please enter a valid email address</span>
              </div>
            )}

            {/* Server Error */}
            {errorText && (
              <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{errorText}</p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 mb-6 ${
              valid && email && !animating
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={!valid || !email || animating}
          >
            <div className="flex items-center justify-center space-x-2">
              {animating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </div>
          </button>

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
      </div>
    </div>
  )
}
