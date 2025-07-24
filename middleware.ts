import { authMiddleware } from '@descope/nextjs-sdk/server'

export default authMiddleware({
  // The Descope project ID to use for authentication
  // Defaults to process.env.DESCOPE_PROJECT_ID
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,

  // The URL to redirect to if the user is not authenticated
  redirectUrl: "/",

  // An array of public routes that do not require authentication
  publicRoutes: ["/"],
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
