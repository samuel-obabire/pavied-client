import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidateTag("rates-tag", { expire: 0 });

  return NextResponse.json({ success: true }, { status: 201 });
}
