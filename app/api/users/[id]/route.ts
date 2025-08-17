import { NextResponse } from "next/server";

import { db } from "@/firebase.config";
import { addData } from "@/lib/firebase";
import handleError from "@/lib/handlers/error";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await db.collection("user").doc(id).get();

    return user.exists
      ? NextResponse.json({ user: user.data(), success: true })
      : NextResponse.json({ success: false });
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function POST(request: Request) {
  const user = await request.json();

  try {
    await addData({
      data: user,
      path: "users",
      docId: user?.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, "api");
  }
}
