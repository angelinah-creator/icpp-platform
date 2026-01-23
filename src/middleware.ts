import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register", "/forgot-password"]
    const isPublicRoute = publicRoutes.includes(pathname)

    // If not logged in and trying to access protected route, redirect to login
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // If logged in and trying to access login page, redirect to appropriate dashboard
    if (isLoggedIn && pathname === "/login") {
        const role = req.auth?.user?.role
        if (role === "ADMIN" || role === "AUDITOR" || role === "COMMERCIAL") {
            return NextResponse.redirect(new URL("/admin", req.url))
        }
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Role-based access control
    if (isLoggedIn) {
        const role = req.auth?.user?.role

        // Admin routes - only for ADMIN, AUDITOR, COMMERCIAL
        if (pathname.startsWith("/admin")) {
            if (role !== "ADMIN" && role !== "AUDITOR" && role !== "COMMERCIAL") {
                return NextResponse.redirect(new URL("/dashboard", req.url))
            }
        }

        // Client dashboard - only for CLIENT
        if (pathname.startsWith("/dashboard")) {
            if (role !== "CLIENT") {
                return NextResponse.redirect(new URL("/admin", req.url))
            }
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder (images, etc.)
         */
        "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
    ],
}
