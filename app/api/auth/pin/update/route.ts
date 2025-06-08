import { JWTPayload } from "@/lib/jwt";
import { checkIfUserIsAuthenticated, httpStatusResponse } from "@/lib/utils";
import { User } from "@/models/users";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const { oldPin, newPin, confirmPin } = await request.json();

    if (oldPin === newPin) {
      return NextResponse.json(
        httpStatusResponse(400, "New pin cannot be the same as the old pin"),
        { status: 400 }
      );
    }

    if (newPin !== confirmPin) {
      return NextResponse.json(
        httpStatusResponse(400, "New pin and confirm pin do not match"),
        { status: 400 }
      );
    }

    const { email } = (await checkIfUserIsAuthenticated()) as JWTPayload;

    const user = await User.findOne({ "auth.email": email });

    if (!user) {
      return NextResponse.json(httpStatusResponse(404, "User not found"), {
        status: 404,
      });
    }

    await user?.verifyTransactionPin(oldPin);

    user.auth.transactionPin = newPin;

    await user.save({ validateModifiedOnly: true });

    return NextResponse.json(
      httpStatusResponse(200, "Transaction pin updated successfully"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      httpStatusResponse(500, (error as Error).message),
      { status: 500 }
    );
  }
}
