import { NextResponse } from "next/server";
import { httpStatusResponse } from "@/lib/utils";
import { clearTokenCookie } from "@/lib/jwt";

export async function POST() {
  try {
    const response = NextResponse.json(
      httpStatusResponse(200, "Logged out successfully"),
      { status: 200 }
    );

    // Clear the token cookie
    clearTokenCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      httpStatusResponse(500, "SERVER_ERROR: An unexpected error occurred."),
      { status: 500 }
    );
  }
}