import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import NewPasswordForm from "@/components/forms/NewPasswordForm";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string; error?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

  const hasError = !!error || !token;

  return (
    <main className="container max-w-lg mx-auto flex flex-col items-center px-6 py-10">
      <div className="w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {hasError ? (
          <div className="flex flex-col items-center justify-center space-y-6 pt-4">
            <div className="flex size-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <AlertTriangle className="size-10" />
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-24-bold text-primary dark:text-white">
                Invalid or Expired Link
              </h1>
              <p className="text-16-medium text-black-1/60 dark:text-white/60 max-w-sm mx-auto">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>
            </div>

            <div className="grid w-full gap-4">
              <Button asChild className="btn-primary w-full shadow-md">
                <Link href={ROUTES.FORGOT_PASSWORD}>
                  Request New Reset Link
                </Link>
              </Button>

              <Button
                asChild
                variant="link"
                className="w-full text-black-1/50 dark:text-white/50"
              >
                <Link href={ROUTES.SIGN_IN}>Back to Sign In</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <header className="space-y-4">
              <h1 className="text-36-bold text-primary dark:text-white tracking-tight">
                Reset <span className="text-secondary">Password</span>
              </h1>
              <p className="text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium max-w-sm mx-auto">
                Enter your new password below.
              </p>
            </header>

            <section className="flex flex-col gap-6 text-left">
              <NewPasswordForm token={token} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
