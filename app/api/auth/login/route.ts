import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/connect-to-db";
import { findUserByEmail } from "@/models/users";
import { httpStatusResponse } from "@/lib/utils";
import { generateToken, setTokenCookie } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        httpStatusResponse(
          400,
          "INVALID_CREDENTIALS: Please provide email and password."
        ),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const user = await findUserByEmail(email, {
      includePassword: true,
      throwOn404: false,
    });

    // If user not found
    if (!user) {
      return NextResponse.json(
        httpStatusResponse(
          404,
          "USER_NOT_FOUND: If you don't have an account, please sign up."
        ),
        { status: 404 }
      );
    }

    // Check if account is inactive
    if (user.status === "inactive") {
      return NextResponse.json(
        httpStatusResponse(403, "USER_INACTIVE: Your account is inactive."),
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.auth.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        httpStatusResponse(
          401,
          "PASSWORD_MISMATCH: You entered an invalid password."
        ),
        { status: 401 }
      );
    }

    // Create user payload for token
    const userPayload = {
      id: user._id.toString(),
      email: user.auth.email,
      phoneNumber: user.phoneNumber,
      role: user.role || "user",
      name: user.fullName.split(" ")[0] || user.auth.email.split("@")[0],
    };

    // Generate JWT token
    const token = generateToken(userPayload);

    // Create response
    const response = NextResponse.json(
      httpStatusResponse(200, "Login successful", { user: userPayload, token }),
      { status: 200 }
    );

    // Set token in cookie
    setTokenCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      httpStatusResponse(500, "SERVER_ERROR: An unexpected error occurred."),
      { status: 500 }
    );
  }
}
