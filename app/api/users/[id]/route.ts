import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/firebase.config";
import { getUserById } from "@/lib/firebase/user";
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

// POST /api/users/:[id]
export async function POST(request: NextRequest) {
  const user = (await request.json()) as User;

  try {
    const userRef = db.collection("users").doc(user.id)

    await db.runTransaction(async (t) => {
        const res = await t.get(userRef);

        if (res.exists) throw new Error("User already exist in the database");

        t.set(userRef, { ...user, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), });
      });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
