import { NextRequest, NextResponse } from "next/server";

import { createUser, getUserById } from "@/lib/firebase/user";
import handleError from "@/lib/handlers/error";

// GET /api/users/:[id]
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getUserById(id);

    return user
      ? NextResponse.json({ data: user, success: true }, { status: 200 })
      : NextResponse.json({ success: false }, { status: 404 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: NextRequest) {
  const user = (await request.json()) as User;

  try {
    await createUser(user.id, user);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
