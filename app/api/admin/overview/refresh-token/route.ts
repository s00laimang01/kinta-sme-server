import { connectToDatabase } from "@/lib/connect-to-db";
import { JWTPayload } from "@/lib/jwt";
import { checkIfUserIsAuthenticated, httpStatusResponse } from "@/lib/utils";
import { App } from "@/models/app";
import { User } from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = (await checkIfUserIsAuthenticated()) as JWTPayload;

    const user = await User.findOne({ "auth.email": email });

    if (!user) {
      return NextResponse.json(
        httpStatusResponse(404, "USER_NOT_FOUND: Please contact the admin"),
        { status: 404 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        httpStatusResponse(
          401,
          "UNAUTHORIZED_REQUEST: You are not authorized to perform this action"
        ),
        { status: 401 }
      );
    }

    await connectToDatabase();

    const app = await App.findOne({});

    if (!app) {
      return NextResponse.json(
        httpStatusResponse(
          404,
          "APP_CONFIG_NOT_FOUND: Please contact the admin"
        ),
        { status: 404 }
      );
    }

    app.buyVtu = {
      accessToken: "",
      expiredAt: "",
      url: "",
    };

    await app.save({ validateModifiedOnly: false });

    return NextResponse.json(httpStatusResponse(200), { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
