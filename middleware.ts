// middleware.js
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  "file://", // Capacitor WebView
  "capacitor://localhost", // Capacitor scheme
  "http://localhost", // Local dev
  "http://localhost:3000", // Next.js dev
  "http://localhost:3001", // Additional local port
  "https://kinta-sme-app.com", // Your hosted app
  "https://kinta-sme-app.vercel.app",
  // Add your local IP for live reload, e.g., 'http://192.168.x.x:3000'
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export function middleware(request: NextRequest) {
  // Get the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin) || origin === ""; // Handle null/empty origins

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    const preflightHeaders = {
      "Access-Control-Allow-Origin": isAllowedOrigin ? origin || "*" : "",
      ...corsOptions,
    };
    return new NextResponse(null, {
      status: 204, // Standard for preflight
      headers: preflightHeaders,
    });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
