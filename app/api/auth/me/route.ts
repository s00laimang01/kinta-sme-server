import { NextResponse } from "next/server";
import { httpStatusResponse } from "@/lib/utils";
import { getTokenFromCookies, getUserFromToken } from "@/lib/jwt";

export async function GET() {
  try {
    // Get token from cookies
    const token = await getTokenFromCookies();

    // Get user from token
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        httpStatusResponse(401, "UNAUTHENTICATED: Please sign in to continue."),
        { status: 401 }
      );
    }

    return NextResponse.json(
      httpStatusResponse(200, "User retrieved successfully", { user }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      httpStatusResponse(500, "SERVER_ERROR: An unexpected error occurred."),
      { status: 500 }
    );
  }
}
