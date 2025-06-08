import {
  checkIfUserIsAuthenticated,
  getTransferFee,
  httpStatusResponse,
} from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await checkIfUserIsAuthenticated();

    const amount = request.nextUrl.searchParams.get("q");

    if (isNaN(Number(amount))) {
      return NextResponse.json(httpStatusResponse(400, "Invalid amount"), {
        status: 400,
      });
    }

    const res = await getTransferFee(Number(amount));

    return NextResponse.json(
      httpStatusResponse(200, "Transaction fees fetched successfully", res),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      httpStatusResponse(500, (error as Error).message),
      { status: 500 }
    );
  }
}
