import { JWTPayload } from "@/lib/jwt";
import { checkIfUserIsAuthenticated, httpStatusResponse } from "@/lib/utils";
import { findUserByEmail, User } from "@/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pin, confirmPin } = await request.json();

    const { email } = (await checkIfUserIsAuthenticated()) as JWTPayload;

    if (pin !== confirmPin) {
      return NextResponse.json(
        httpStatusResponse(400, "Transaction pin does not match"),
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email!);

    if (!user)
      return NextResponse.json(httpStatusResponse(404, "User not found"), {
        status: 404,
      });

    if (user?.hasSetPin) {
      return NextResponse.json(
        httpStatusResponse(400, "Transaction pin already set"),
        { status: 400 }
      );
    }

    await User.findOneAndUpdate(
      { "auth.email": email },
      {
        $set: {
          "auth.transactionPin": pin,
          hasSetPin: true,
        },
      },
      {
        runValidators: true,
      }
    );

    return NextResponse.json(
      httpStatusResponse(200, "Transaction pin successfully set"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      httpStatusResponse(500, (error as Error).message),
      { status: 500 }
    );
  }
}
