import { NextResponse } from "next/server";

import { getUserByEmail } from "@/lib/firebase/user";
import handleError from "@/lib/handlers/error";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ success: false }, { status: 404 });
    } else {
      return NextResponse.json(
        {
          success: true,
          data: user,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
