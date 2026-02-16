import ResetPasswordForm from "@/components/forms/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <main className="container max-w-lg mx-auto flex flex-col items-center px-6 py-10">
      <div className="w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="space-y-4">
          <h1 className="text-36-bold text-primary dark:text-white tracking-tight">
            Reset <span className="text-secondary">Password</span>
          </h1>

          <p className="text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium max-w-sm mx-auto">
            Enter your new password below.
          </p>
        </header>

        <section className="flex flex-col gap-6 text-left">
           <ResetPasswordForm />
        </section>
      </div>
    </main>
  );
}
