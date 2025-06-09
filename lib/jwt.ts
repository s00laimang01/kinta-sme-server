import jwt from "jsonwebtoken";
import { IUser, IUserRole } from "@/types";
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export interface JWTPayload {
  id: string;
  email: string;
  role: IUserRole;
  phoneNumber?: string;
  name?: string;
}

// JWT token expiration time (30 days in seconds)
const JWT_EXPIRATION = 30 * 24 * 60 * 60;

// Generate a JWT token
export const generateToken = (user: JWTPayload): string => {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: JWT_EXPIRATION,
  });
};

// Verify a JWT token
export const verifyToken = (token?: string): JWTPayload | null => {
  try {
    const user = jwt.verify(token!, process.env.JWT_SECRET!) as JWTPayload;
    return user;
  } catch (error) {
    return null;
  }
};

// Set JWT token in cookies
export const setTokenCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: false,
    //sameSite: "strict",
    maxAge: JWT_EXPIRATION,
    path: "/",
  });

  return response;
};

// Get JWT token from cookies in API route
export const getTokenFromCookies = async () => {
  const cookieStore = await cookies();
  const _headerStore = await headers();
  return _headerStore.get("Authorization") || cookieStore.get("token")?.value;
};

// Clear JWT token cookie
export const clearTokenCookie = (response: NextResponse) => {
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
};

// Get user from token
export const getUserFromToken = async (token: string | undefined) => {
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return payload;
};
