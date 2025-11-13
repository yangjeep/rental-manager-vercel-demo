import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  const user = process.env.DEMO_USER || "demo";
  const pass = process.env.DEMO_PASS || "demo123";
  const authHeader = req.headers.get("authorization") || "";
  const expected = encodeBasicHeader(user, pass);
  if (authHeader === expected) return NextResponse.next();
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' }
  });
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};

function encodeBasicHeader(user: string, pass: string): string {
  const credentials = `${user}:${pass}`;
  if (typeof globalThis.btoa === "function") {
    return "Basic " + globalThis.btoa(credentials);
  }
  if (typeof Buffer !== "undefined") {
    return "Basic " + Buffer.from(credentials, "utf-8").toString("base64");
  }
  throw new Error("Base64 encoding is not available in this runtime");
}
