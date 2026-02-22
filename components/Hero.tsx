import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "./ui/button";

// Settlement & payment infrastructure positioning update for hero and trust strip copy.
const Hero = () => {
  const trustItems = [
    "Encrypted Transactions",
    "Real-Time Settlement Monitoring",
    "Automated Reconciliation",
    "Compliance-Aware Infrastructure",
  ] as const;

  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-24 md:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          {/* Background Glow */}
          <div className="pointer-events-none absolute -top-28 right-2 h-[45rem] w-[45rem] rounded-full bg-gradient-to-r from-secondary/10 to-transparent blur-md" />
          {/* Left Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:max-w-[600px]">
            {/* Tagline */}
            <div className="mb-5 inline-flex items-center rounded-full bg-secondary/10 px-4 py-2 text-secondary animate-in fade-in slide-in-from-top-4 duration-700 md:mb-10">
              <span className="text-xs">
                Settlement & Payment Infrastructure Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="mb-5 text-[33px] leading-[44px] font-bold text-primary animate-in fade-in slide-in-from-left-4 duration-700 delay-100 dark:text-white md:mb-6 md:text-[54px] md:leading-[62px]">
              Secure Settlement Infrastructure for Online Financial Platforms &
              Traders
            </h1>

            {/* Description */}
            <p className="mb-7 max-w-[500px] text-16-medium text-black-1/60 animate-in fade-in slide-in-from-left-4 duration-700 delay-200 dark:text-white/60 md:mb-10 md:text-20-medium">
              Automated deposit and payout solutions that support brokerage
              funding, settlement reconciliation, and real-time tracking
              securely, instantly, and at competitive rates.
            </p>

            {/* Action Buttons Box */}
            <div className="w-full max-w-[400px] md:max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="rounded-2xl border border-black-1/5 bg-white/60 p-2.5 shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-black-1/25 lg:inline-flex lg:items-center lg:gap-4 lg:p-3">
                <Button
                  asChild
                  className="group btn-secondary h-12 w-full rounded-xl px-6 shadow-md lg:h-14 lg:w-64 lg:px-8"
                >
                  <Link
                    href={ROUTES.SIGN_UP}
                    aria-label="Get started"
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="text-16-bold">Get Started</span>
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="mt-2.5 h-12 w-full rounded-xl bg-black-1/5 px-6 text-16-bold transition-colors hover:bg-black-1/10 dark:bg-white/5 lg:mt-0 lg:h-14 lg:w-56 lg:px-8"
                >
                  <Link
                    href={ROUTES.CONTACT}
                    aria-label="Request enterprise access"
                  >
                    Contact Support
                  </Link>
                </Button>
              </div>

              <p className="mt-3 text-14-regular text-black-1/40 dark:text-white/40 md:mt-4 md:text-16-regular">
                Secure • Reliable
              </p>
            </div>
          </div>

          {/* Right Image/Mockup */}
          <div className="relative w-full max-w-[650px] lg:max-w-none lg:flex-1 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl border border-black-1/5 shadow-xl dark:border-white/10">
              <div className="pointer-events-none absolute opacity-90 inset-0 z-10 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              <Image
                src="/assets/home/hero.webp"
                alt="Pavied dashboard preview"
                fill
                priority
                className="object-cover object-center scale-[1.07] md:scale-100"
              />
              <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-lg border border-white/40 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-primary shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black-2/80 dark:text-white md:left-5 md:top-5 md:text-12-medium">
                Settlement Queue
              </div>
              <div className="pointer-events-none absolute right-3 top-14 z-20 rounded-lg border border-white/40 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-primary shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black-2/80 dark:text-white md:right-5 md:top-20 md:text-12-medium">
                Reconciliation Log
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-lg border border-secondary/30 bg-secondary/95 px-3 py-1.5 text-[11px] font-semibold text-black shadow-sm md:bottom-6 md:left-6 md:text-12-medium">
                Payout Confirmed
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-2.5 md:mt-8 md:grid-cols-2 md:gap-3 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-black-1/5 bg-white/60 px-3.5 py-2.5 text-center text-14-medium text-black-1/70 shadow-sm transition-colors dark:border-white/5 dark:bg-black-1/20 dark:text-white/70 md:px-4 md:py-3"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
