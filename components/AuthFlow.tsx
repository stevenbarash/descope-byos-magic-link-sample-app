"use client"

import { useState, useEffect } from "react"
import { Descope } from "@descope/nextjs-sdk"
import { useSession } from "@descope/nextjs-sdk/client"
import { useRouter } from "next/navigation"
import EmailInput from "./EmailInput"
import MagicLinkSent from "./MagicLinkSent"
import UserNamePrompt from "./UserNamePrompt"

// BYOS Screen Names - These must match exactly with the screen names in your Descope flow
// Each screen in your flow must have a unique name to avoid conflicts
const emailScreenName = "Welcome BYOS Magic Link"
const magicLinkSentScreenName = "Magic Link Sent"
const nameScreenName = "User Information"

// Form state interface to track data between screens
// This object maintains state throughout your flow, collecting and passing data between screens
interface FormState {
  email?: string;
  fullName?: string;
}

export default function AuthFlow() {
  const router = useRouter()
  const { isAuthenticated } = useSession()
  
  // BYOS State Management:
  // - state: Contains the flow state, including screen name, errors, and the next function
  // - form: Manages form data that gets passed between screens
  // - next: Function to proceed to the next screen in the flow
  const [state, setState] = useState<{ error: { text?: string }, screenName?: string, next?: (stepId: string, data?: any) => Promise<void> }>({ error: {} })
  const [form, setForm] = useState<FormState>({})

  // Check if already authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      {/* 
        BYOS Implementation with Descope Component:
        
        Key Components:
        1. flowId: Specifies which flow to use from your Descope console
        2. onScreenUpdate: Callback that determines when to use custom screens vs Descope's default screens
        3. onSuccess: Handles successful authentication completion
        
        Critical BYOS Concepts:
        - Interaction IDs: Each next step has a unique Interaction ID (found in flow builder)
        - Screen Names: Must match exactly with names in your flow
        - Inputs/Outputs: Each screen expects specific inputs and produces specific outputs
      */}
      <Descope
        flowId="sign-up-or-in-magic-link"
        onScreenUpdate={(screenName: string, state: { error: {} }, next: any) => {
          console.log("STATE", screenName, state)
          // Update local state with flow state, including screen name and next function
          setState((prevState) => ({ ...prevState, ...state, next, screenName }))

          // Return true to use custom screen, false to use Descope's default screen
          // This determines which screens we want to replace with our own components
          return screenName === emailScreenName || screenName === magicLinkSentScreenName || screenName === nameScreenName
        }}
        onSuccess={() => {
          console.log("success")
          setState((prevState) => ({ ...prevState }))
          router.push("/dashboard")
        }}
      >
        {/* 
          Custom Email Input Screen:
          
          This replaces the default welcome screen from the flow.
          The component receives:
          - onFormUpdate: Function to update form state (required for next screens)
          - onClick: Handler for proceeding to next step
          - errorText: Error information from the flow state
          
          When user clicks continue, we call state.next() with:
          - Interaction ID: 'oQK_Zn381E' (found in flow builder for this button)
          - Form data: { email: form.email } (required output for next screen)
        */}
        {state?.screenName === emailScreenName &&
          <EmailInput
            onFormUpdate={setForm}
            onClick={async () => {
              if (state.next) {
                // Call the "next" function with the next step's Interaction ID and required inputs
                // The Interaction ID 'oQK_Zn381E' corresponds to the "Continue" button in the flow
                await state.next('oQK_Zn381E', { email: form.email })
              }
            }}
            errorText={state?.error?.text}
            onChange={() => {
              setState(prevState => ({ ...prevState }))
            }}
          />}
        
        {/* 
          Custom Magic Link Sent Screen:
          
          This replaces the default "Magic Link Sent" screen from the flow.
          Handles two main interactions:
          1. Polling: Checks if user has clicked the magic link
          2. Resend: Allows user to request a new magic link
          
          Each interaction uses a different Interaction ID:
          - 'polling': For checking authentication status
          - 'resend': For sending a new magic link
        */}
        {state?.screenName === magicLinkSentScreenName &&
          <MagicLinkSent
            email={form.email || ''}
            onPolling={async () => {
              if (state.next) {
                // Polling interaction - checks if user has authenticated via magic link
                await state.next('polling', {})
              }
            }}
            onResendClick={async () => {
              if (state.next) {
                // Resend interaction - sends a new magic link
                await state.next('resend', {})
              }
            }}
            errorText={state?.error?.text}
            onChange={() => {
              setState(prevState => ({ ...prevState }))
            }}
            state={state}
          />}
        
        {/* 
          Custom User Name Prompt Screen:
          
          This replaces the default "User Information" screen from the flow.
          Collects additional user information (full name) after successful authentication.
          
          When user submits, we call state.next() with:
          - Interaction ID: '8rXwiVLKmp' (found in flow builder for submit button)
          - Form data: { fullName: form.fullName } (required output for flow completion)
        */}
        {state?.screenName === nameScreenName &&
          <UserNamePrompt
            onFormUpdate={setForm}
            onSubmit={async () => {
              if (state.next) {
                // Call the "next" function with the submit Interaction ID and required form data
                // The Interaction ID '8rXwiVLKmp' corresponds to the "Submit" button in the flow
                await state.next('8rXwiVLKmp', { fullName: form.fullName })
              }
            }}
            errorText={state?.error?.text}
            onChange={() => {
              setState(prevState => ({ ...prevState }))
            }}
          />}

      </Descope>
    </div>
  )
}
