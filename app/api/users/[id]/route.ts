import { NextResponse } from "next/server";

import { createUser, getUserById } from "@/lib/firebase/user";
import handleError from "@/lib/handlers/error";

// GET /api/users/:[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await getUserById(id);

    return user
      ? NextResponse.json({ data: user, success: true })
      : NextResponse.json({ success: false });
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function POST(request: Request) {
  const user = (await request.json()) as User;

  try {
    await createUser(user.id, user);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, "api");
  }
}
