import { JWTPayload } from "@/lib/jwt";
import { checkIfUserIsAuthenticated, httpStatusResponse } from "@/lib/utils";
import { Account } from "@/models/account";
import { findUserByEmail } from "@/models/users";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { email } = (await checkIfUserIsAuthenticated()) as JWTPayload;

    const user = await findUserByEmail(email!);

    const account = await Account.findOne({ user: user?.id });

    return NextResponse.json(
      httpStatusResponse(
        200,
        "User account fetched successfully",
        account?.toObject()
      )
    );
  } catch (error) {
    return NextResponse.json(httpStatusResponse(500, (error as Error).message));
  }
}
