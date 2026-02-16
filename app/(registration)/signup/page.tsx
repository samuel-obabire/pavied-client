import Link from "next/link";
import { redirect } from "next/navigation";
import SocialLogin from "@/components/SocialLogin";
import SignupForm from "@/components/forms/SignupForm";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

export default async function Signup() {
  const session = await verifySession();

  if (session) redirect(ROUTES.DASHBOARD);

  return (
    <main className="container max-w-lg mx-auto flex flex-col items-center px-6 py-10">
      <div className="w-full space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="space-y-4">
          <h1 className="text-36-bold text-primary dark:text-white tracking-tight">
            Create <span className="text-secondary">Account</span>
          </h1>

          <p className="text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium max-w-sm mx-auto">
            Join thousands of traders using Pavied for fast and secure Deriv
            transactions.
          </p>
        </header>

        <section className="flex flex-col gap-6 text-left">
           <SignupForm />

           <div className="flex items-center gap-2 text-12-regular text-black-1/40 dark:text-white/40 italic justify-center">
            <span className="h-px w-8 bg-black-1/10 dark:bg-white/10" />
            <span>Or continue with</span>
            <span className="h-px w-8 bg-black-1/10 dark:bg-white/10" />
          </div>

          <SocialLogin />
        </section>

        <footer className="pt-4 space-y-4">
           <p className="text-14-regular text-black-1/70 dark:text-white/70">
            Already have an account?{" "}
            <Link href={ROUTES.SIGN_IN} className="text-secondary font-semibold hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-12-regular text-black-1/50 dark:text-white/50 max-w-xs mx-auto">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}
