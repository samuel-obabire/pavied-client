import { NextResponse } from "next/server";

import { getUserByEmail } from "@/lib/firebase/user";
import handleError from "@/lib/handlers/error";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ success: false });
    } else {
      return NextResponse.json({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    return handleError(error, "api");
  }
}
