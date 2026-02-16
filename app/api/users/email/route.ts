import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { prismaAdapter } from "@/lib/prisma-adapters/prisma.adapter";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const user = await prismaAdapter.user.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
