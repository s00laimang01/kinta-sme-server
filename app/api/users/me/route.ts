import {
  checkIfUserIsAuthenticated,
  httpStatusResponse,
  restrictPropertyModification,
} from "@/lib/utils";
import { NextResponse } from "next/server";
import { findUserByEmail, User } from "@/models/users";
import { connectToDatabase } from "@/lib/connect-to-db";
import { Exam } from "@/models/exam";
import { JWTPayload } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const session = (await checkIfUserIsAuthenticated()) as JWTPayload;

    await connectToDatabase();

    const user = await findUserByEmail(session?.email || "");

    return NextResponse.json(
      httpStatusResponse(
        200,
        "Account details fetched successfully",
        user?.toObject()
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

export async function PATCH(request: Request) {
  try {
    const session = (await checkIfUserIsAuthenticated()) as JWTPayload;

    const updates = await request.json();

    await connectToDatabase();

    //   Prevent the user from modifying some certain properties
    restrictPropertyModification(updates, [
      "isEmailVerified",
      "isPhoneNumberVerified",
      "role",
      "balance",
      "createdAt",
      "auth",
      "auth.password",
      "status",
    ]);

    //   Get the user and update the user information
    const user = await User.findOneAndUpdate(
      { "auth.email": session?.email },
      {
        $set: updates,
      },
      {
        new: true,
      }
    );

    return NextResponse.json(
      httpStatusResponse(
        200,
        "User Information updated successfully",
        user?.toObject()
      ),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      httpStatusResponse(500, (error as Error).message),
      { status: 500 }
    );
  }
}
