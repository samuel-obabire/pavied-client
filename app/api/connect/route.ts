import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tgid = searchParams.get("tgid");

  if (!tgid) return notFound();

  const cookieStore = await cookies();
  cookieStore.set("tgid", tgid, {
    maxAge: 86400,
  });

  return redirect("/");
}
