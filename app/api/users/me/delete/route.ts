import { JWTPayload } from "@/lib/jwt";
import { checkIfUserIsAuthenticated, httpStatusResponse } from "@/lib/utils";
import { User } from "@/models/users";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    // Check if user is authenticate
    const session = (await checkIfUserIsAuthenticated()) as JWTPayload;

    await User.findOneAndDelete({ "auth.email": session?.email });

    return NextResponse.json(
      httpStatusResponse(200, "Account deleted successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      httpStatusResponse(500, (error as Error).message),
      { status: 500 }
    );
  }
}
