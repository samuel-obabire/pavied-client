import BrandName from "@/components/BrandName";
import SocialLogin from "@/components/SocialLogin";

export default async function Home() {
  return (
    <main className="container max-w-lg space-y-10  pt-32">
      <div className="text-center">
        <BrandName />
      </div>

      <header className="space-y-5">
        <h1 className="text-28-bold text-primary dark:text-white">
          Create <span className="text-secondary">account</span>
        </h1>

        <p className="text-14-medium md:text-20-medium">
          Please log in or create an account to continue. You can do this
          quickly using your Google account.
        </p>
      </header>

      <section className="flex-center flex flex-col gap-4">
        <SocialLogin />
      </section>
    </main>
  );
}
