import { JWTPayload } from "@/lib/jwt";
import { checkIfUserIsAuthenticated, httpStatusResponse } from "@/lib/utils";
import { Transaction } from "@/models/transactions";
import { User } from "@/models/users";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = (await checkIfUserIsAuthenticated()) as JWTPayload;

    const userRecord = await User.findOne({ "auth.email": user.email });

    const transaction = await Transaction.findOne({
      user: userRecord?.id,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      httpStatusResponse(
        200,
        "Last transaction fetched successfully",
        transaction
      ),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      httpStatusResponse(500, (error as Error).message),
      { status: 500 }
    );
  }
}
