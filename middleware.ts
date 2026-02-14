import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard', '/competitions', '/admin'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user has auth token (Firebase stores it in localStorage on client)
  // Note: For better security, consider using cookies instead
  // This middleware is mainly for redirecting unauthenticated users

  // Allow health check and API routes
  if (pathname.startsWith('/api/') || pathname === '/api/health') {
    return NextResponse.next();
  }

  // For now, we're relying on client-side auth checks via useAuth hook
  // since Firebase authentication is client-side only
  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
