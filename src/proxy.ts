import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"]

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // If not logged in and trying to access protected route, redirect to login
    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // If logged in and on login page, redirect based on role
    if (isLoggedIn && pathname === "/login") {
        const role = req.auth?.user?.role
        if (role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", req.url))
        } else if (role === "AUDITOR" || role === "COMMERCIAL") {
            return NextResponse.redirect(new URL("/auditeur", req.url))
        } else {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
    }

    // NO ROLE-BASED ACCESS CONTROL IN MIDDLEWARE
    // Let the layout pages handle this with requireRole()
    // This prevents infinite redirect loops

    return NextResponse.next()
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images and other static assets
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)",
    ],
}
