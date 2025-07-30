import type React from "react"
import { AuthProvider } from "@descope/nextjs-sdk"
import "./globals.css"
import { Inter } from "next/font/google"
import ErrorBoundary from "@/components/ErrorBoundary"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: "Descope Custom Screens",
  description: "Custom authentication screens with Descope",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable} suppressHydrationWarning={true}>
        <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || ""}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}