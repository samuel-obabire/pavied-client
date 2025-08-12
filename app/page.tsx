import BrandName from "@/components/BrandName";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Button } from "@/components/ui/button";

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
          quickly using your Google or Apple account.
        </p>
      </section>

      <section className="flex-center flex flex-col gap-4">
        <Button
          className="cursor-pointer bg-white text-2xl shadow-sm outline-none"
          variant="ghost"
          size="lg"
        >
          <FcGoogle className="!h-6 !w-6" />
          <span className="text-16-bold">Continue with Google</span>
        </Button>

        <Button
          className="cursor-pointer bg-gray-900 text-2xl text-white shadow-sm outline-none"
          variant="ghost"
          size="lg"
        >
          <FaApple className="!h-6 !w-6" />
          <span className="text-16-bold">Continue with Apple</span>
        </Button>
      </section>
    </main>
  );
}
