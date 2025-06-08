import { JWTPayload } from "@/lib/jwt";
import { checkIfUserIsAuthenticated, httpStatusResponse } from "@/lib/utils";
import { RecentlyUsedContact } from "@/models/recently-used-contact";
import { findUserByEmail } from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = (await checkIfUserIsAuthenticated()) as JWTPayload;

    const q = request.nextUrl.searchParams;

    const type = q.get("type");
    const limit = Number(q.get("limit") || 5);

    const user = await findUserByEmail(session?.email!);

    const recentlyUsedContact = await RecentlyUsedContact.find({
      uid: user?.id,
      type,
    }).limit(limit);

    return NextResponse.json(
      httpStatusResponse(
        200,
        "Recent contacts fetched successfully",
        recentlyUsedContact
      )
    );
  } catch (error) {
    return NextResponse.json(
      httpStatusResponse(500, (error as Error).message),
      { status: 500 }
    );
  }
}
