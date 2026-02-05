import { Timestamp } from "firebase-admin/firestore";
import { type NextRequest, NextResponse } from "next/server";
import { DbCollections } from "@/lib/constants/dbCollections";
import { db } from "@/lib/firebase/firebase.config";
import { firestoreAdapter } from "@/lib/firebase/firestore.adapter";
import handleError from "@/lib/handlers/error";

// GET /api/users/:[id]
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const user = await firestoreAdapter.user.getUserById(id);

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
    const userRef = db.collection(DbCollections.USERS).doc(user.id);
    const statsRef = db.collection(DbCollections.USER_STATS).doc(user.id);

    await db.runTransaction(async (t) => {
      const userRes = await t.get(userRef);
      const statsRes = await t.get(statsRef);

      if (userRes.exists || statsRes.exists)
        throw new Error("User already exist in the database");

      const userStats = {
        userId: user.id,
        totalDeposits: 0,
        totalFailedTransactions: 0,
        totalSuccessfulTransactions: 0,
        totalTransactions: 0,
        totalWithdrawals: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies UserStats;

      t.set(userRef, {
        ...user,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      t.set(statsRef, userStats);
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
