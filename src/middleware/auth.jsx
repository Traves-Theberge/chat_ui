// Import necessary modules for NextResponse and Supabase client creation
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define the middleware function
export async function middleware(req) {
  // Initialize the response with the default NextResponse
  const res = NextResponse.next();
  // Create a Supabase client instance with the request and response
  const supabase = createMiddlewareClient({ req, res });
  
  // Fetch the current session from Supabase
  const { data: { session } } = await supabase.auth.getSession();

  // Check if the user is not logged in and trying to access the chat
  if (!session && req.nextUrl.pathname.startsWith('/chat')) {
    // Redirect the user to the login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check if the user is logged in and trying to access the login or signup pages
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    // Redirect the user to the chat page
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  // If none of the above conditions are met, return the default response
  return res;
}

// Configuration for the middleware to match specific routes
export const config = {
  matcher: ['/chat/:path*', '/login', '/signup'],
};
