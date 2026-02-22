import { type NextRequest, NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { prismaAdapter } from "@/lib/prisma-adapters/prisma.adapter";

// GET /api/users/:[id]
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const user = await prismaAdapter.user.getUserById(id);

    return user
      ? NextResponse.json({ data: user, success: true }, { status: 200 })
      : NextResponse.json({ success: false }, { status: 404 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
