import { redirect } from "next/navigation";
import {
  VerificationSuccess,
  VerificationError,
} from "@/components/EmailVerificationResult";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

type SearchParams = Promise<{ error?: string }>;

export default async function EmailVerificationResult({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  if (error) {
    return (
      <main className="container max-w-lg mx-auto flex flex-col items-center px-6 py-10">
        <VerificationError error={error} />
      </main>
    );
  }

  const session = await verifySession();

  if (!session) {
    redirect(`${ROUTES.SIGN_IN}?verified=true`);
  }

  return (
    <main className="container max-w-lg mx-auto flex flex-col items-center px-6 py-10">
      <VerificationSuccess />
    </main>
  );
}
