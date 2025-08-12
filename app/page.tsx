import BrandName from "@/components/BrandName";
import SocialLogin from "@/components/SocialLogin";

export default function Home() {
  return (
    <main className="container max-w-lg space-y-10  pt-32">
      <div className="text-center">
        <BrandName />
      </div>

      <section className="space-y-5">
        <h1 className="text-28-bold text-primary">
          Register <span className="text-secondary">account</span>
        </h1>

        <p className="text-14-medium md:text-20-medium">
          Please log in or create an account to continue. You can do this
          quickly using your Google.
        </p>
      </section>

      <section className="flex-center flex flex-col gap-4">
        <SocialLogin />
      </section>
    </main>
  );
}
