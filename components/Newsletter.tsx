import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Enterprise settlement section adaptation while preserving newsletter signup behavior.
const Newsletter = () => {
  const enterprisePoints = [
    "Dedicated support channels",
    "Scalable transaction capacity",
    "Structured liquidity management",
    "Custom settlement configurations",
  ] as const;

  return (
    <div className="relative z-10 -mb-[120px] px-4">
      <div className="mx-auto max-w-[1100px] rounded-[32px] border border-black-1/5 bg-white p-8 text-center shadow-xl dark:border-white/5 dark:bg-black-2 md:p-16">
        <h2 className="text-[32px] font-bold leading-tight text-black-1 dark:text-white md:text-[56px]">
          Enterprise Settlement Solutions
        </h2>
        <p className="mt-4 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
          For high-volume operators and fintech platforms, Pavied offers:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {enterprisePoints.map((point) => (
            <div
              key={point}
              className="rounded-xl border border-black-1/5 bg-[#F5F6F8] px-4 py-3 text-14-medium text-black-1/70 dark:border-white/5 dark:bg-white/5 dark:text-white/70"
            >
              {point}
            </div>
          ))}
        </div>

        <Button
          asChild
          className="btn-secondary h-14 rounded-xl px-10 text-16-bold mt-8"
        >
          <Link href={ROUTES.CONTACT}>Contact Enterprise Team</Link>
        </Button>

        <form
          aria-label="Newsletter subscription form"
          className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row"
        >
          <div className="w-full max-w-[450px]">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Input Email address"
              autoComplete="email"
              required
              className="h-14 rounded-xl border-black-1/5 bg-[#F5F6F8] px-6 text-16-regular dark:bg-white/5"
            />
          </div>
          <Button
            type="submit"
            className="btn-secondary h-14 w-full rounded-xl px-10 text-16-bold md:w-auto"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
