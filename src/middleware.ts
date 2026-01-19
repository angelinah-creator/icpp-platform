import { auth } from "@/lib/auth"

export default auth((req) => {
    // Add custom middleware logic here if needed
    // For now, just use default auth middleware
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
    ],
}
