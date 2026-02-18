import { redirect } from "next/navigation";
import Link from "next/link";
import EmailVerificationForm from "@/components/forms/EmailVerificationForm";
import { ROUTES } from "@/lib/constants/routes";

type SearchParams = Promise<{ email?: string }>;

export default async function EmailVerification({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  if (!email) redirect(ROUTES.SIGN_UP);

  const maskedEmail = maskEmail(email);

  return (
    <main className="container max-w-lg mx-auto flex flex-col items-center px-6 py-10">
      <div className="w-full space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="space-y-4">
          <h1 className="text-36-bold text-primary dark:text-white tracking-tight">
            Verify your <span className="text-secondary">Email</span>
          </h1>

          <p className="text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium max-w-sm mx-auto">
            We&apos;ve sent a verification link to{" "}
            <strong className="text-primary dark:text-white">
              {maskedEmail}
            </strong>
            . Please check your inbox and click the link to verify your account.
          </p>
        </header>

        <section className="flex flex-col gap-6 text-left">
          <EmailVerificationForm email={email} />
        </section>

        <footer className="pt-4 space-y-4">
          <p className="text-14-regular text-black-1/70 dark:text-white/70">
            Wrong email?{" "}
            <Link
              href={ROUTES.SIGN_UP}
              className="text-secondary font-semibold hover:underline"
            >
              Change email
            </Link>
          </p>
        </footer>
      </div>
    </main>
  );
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;

  const visibleCount = Math.min(3, localPart.length);
  const masked =
    localPart.slice(0, visibleCount) +
    "***";

  return `${masked}@${domain}`;
}
