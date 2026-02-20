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
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-20 md:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8 relative">
          {/* Background Glow */}
          <div className="absolute -top-28 right-2 h-[45rem] w-[45rem] rounded-full bg-gradient-to-r from-secondary/10 to-transparent blur-md pointer-events-none" />
          {/* Left Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:max-w-[600px]">
            {/* Tagline */}
            <div className="inline-flex items-center rounded-full bg-secondary/10 px-4 py-2 text-secondary mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="text-xs">
                Settlement & Payment Infrastructure Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[35px] leading-[48px] md:text-[54px] md:leading-[62px] font-bold text-primary dark:text-white mb-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              Secure Settlement Infrastructure for Online Financial Platforms &
              Traders
            </h1>

            {/* Description */}
            <p className="text-16-medium md:text-20-medium text-black-1/60 dark:text-white/60 mb-8 md:mb-10 max-w-[500px] animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              Automated deposit and payout solutions that support brokerage
              funding, settlement reconciliation, and real-time tracking
              securely, instantly, and at competitive rates.
            </p>

            {/* Action Buttons Box */}
            <div className="w-full max-w-[400px] md:max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="rounded-2xl border border-black-1/5 bg-white/50 p-3 dark:border-white/5 dark:bg-black-1/20 backdrop-blur-sm lg:inline-flex lg:items-center lg:gap-4">
                <Button
                  asChild
                  className="btn-secondary w-full lg:w-64 h-14 px-8 rounded-xl shadow-md group"
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
                  className="w-full lg:w-56 h-14 px-8 rounded-xl mt-3 lg:mt-0 text-16-bold bg-black-1/5 dark:bg-white/5 hover:bg-black-1/10 transition-colors"
                >
                  <Link
                    href={ROUTES.CONTACT}
                    aria-label="Request enterprise access"
                  >
                    Contact Support
                  </Link>
                </Button>
              </div>

              <p className="mt-4 text-14-regular text-black-1/40 dark:text-white/40 md:text-16-regular">
                Secure • Reliable
              </p>
            </div>
          </div>

          {/* Right Image/Mockup */}
          <div className="relative w-full max-w-[650px] lg:max-w-none lg:flex-1 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl shadow-md">
              <Image
                src="/assets/home/hero.png"
                alt="Pavied Dashboard Preview"
                fill
                priority
                className="object-cover object-left"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-black-1/5 bg-white/50 px-4 py-3 text-center text-14-medium text-black-1/70 dark:border-white/5 dark:bg-black-1/20 dark:text-white/70"
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
