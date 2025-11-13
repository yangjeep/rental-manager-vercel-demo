import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper functions for Edge runtime (no external imports)
function readEnv(key: string): string | undefined {
  return process.env[key];
}

function envFlag(key: string): boolean {
  const value = readEnv(key);
  if (!value) return false;
  return value === "1" || value.toLowerCase() === "true";
}

function decodeBasic(value: string): string {
  // Use Web API atob for Edge runtime compatibility
  if (typeof atob === "function") {
    return atob(value);
  }
  // Fallback (shouldn't be needed in Edge runtime)
  throw new Error("No base64 decoder available");
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Handle Basic Auth
  const user = readEnv("DEMO_USER");
  const pass = readEnv("DEMO_PASS");
  
  if (user && pass) {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Rentals"',
        },
      });
    }
    
    const decoded = decodeBasic(authHeader.slice(6));
    const [providedUser, providedPass] = decoded.split(":");
    
    if (providedUser !== user || providedPass !== pass) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Rentals"',
        },
      });
    }
  }
  
  // Handle X-Robots-Tag for DEMO_NOINDEX
  const noIndex = envFlag("DEMO_NOINDEX");
  if (noIndex) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|txt|woff|woff2|ttf|eot|otf|json|pdf)).*)',
  ],
};

