import Link from "next/link";
import { redirect } from "next/navigation";
import SocialLogin from "@/components/SocialLogin";
import SigninForm from "@/components/forms/SigninForm";
import { ROUTES } from "@/lib/constants/routes";
import { verifySession } from "@/lib/server";

export default async function Signin() {
  const session = await verifySession();

  if (session) redirect(ROUTES.DASHBOARD);

  return (
    <main className="container max-w-lg mx-auto flex flex-col items-center px-6">
      <div className="w-full space-y-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="space-y-4">
          <h1 className="text-36-bold text-primary dark:text-white tracking-tight">
            Sign <span className="text-secondary">In</span>
          </h1>

          <p className="text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium max-w-sm mx-auto">
            Welcome back! Please enter your details.
          </p>
        </header>

        <section className="flex flex-col items-center gap-8">
          <SigninForm />

          <div className="flex items-center gap-2 text-12-regular text-black-1/40 dark:text-white/40 italic w-full">
            <span className="h-px w-full bg-black-1/10 dark:bg-white/10" />
            <span className="shrink-0">Or continue with</span>
            <span className="h-px w-full bg-black-1/10 dark:bg-white/10" />
          </div>

          <SocialLogin />
        </section>

        <footer className="pt-4 space-y-4">
           <p className="text-14-regular text-black-1/70 dark:text-white/70">
            Don't have an account?{" "}
            <Link href={ROUTES.SIGN_UP} className="text-secondary font-semibold hover:underline">
              Sign up
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
