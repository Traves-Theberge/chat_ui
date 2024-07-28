import { NextResponse } from 'next/server'; // Import NextResponse from next/server
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'; // Import createMiddlewareClient from @supabase/auth-helpers-nextjs

// Define the middleware function
export async function middleware(req) {
  const res = NextResponse.next(); // Create a NextResponse object
  const supabase = createMiddlewareClient({ req, res }); // Create a Supabase client with the request and response
  
  const { data: { session } } = await supabase.auth.getSession(); // Get the user session from Supabase

  // If there is no session and the request is for a chat page, redirect to the login page
  if (!session && req.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If there is a session and the request is for the login or signup page, redirect to the chat page
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  return res; // Return the response
}

// Export the config object with the matcher property
export const config = {
  matcher: ['/chat/:path*', '/login', '/'], // Define the paths that the middleware should match
};