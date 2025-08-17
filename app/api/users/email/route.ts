import { NextResponse } from "next/server";

import { db } from "@/firebase.config";
import handleError from "@/lib/handlers/error";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    const userRef = db.collection("users").where("email", "==", email);

    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return NextResponse.json({ success: false });
    } else {
      return NextResponse.json({
        success: true,
        data: snapshot.docs[0].data(),
      });
    }
  } catch (error) {
    return handleError(error, "api");
  }
}
