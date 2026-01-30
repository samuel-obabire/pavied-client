import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";
import { ROUTES } from "@/lib/constants/routes";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-20 md:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8 relative">
          {/* Background Glow */}
          <div className="absolute -top-28 right-2 h-[45rem] w-[45rem] rounded-full bg-gradient-to-r from-secondary/10 to-transparent blur-md pointer-events-none" />
          {/* Left Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:max-w-[600px]">
            
            {/* Tagline */}
            <div className="inline-flex items-center rounded-full bg-secondary/10 px-4 py-2 text-secondary mb-6 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="text-12-medium md:text-14-medium whitespace-nowrap">
                Fully Automated Deriv Funding & Withdrawal Service
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-bold text-primary dark:text-white mb-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              Convert Your Deriv <br className="hidden md:block" /> Assets to Naira Instantly.
            </h1>

            {/* Description */}
            <p className="text-16-medium md:text-20-medium text-black-1/60 dark:text-white/60 mb-8 md:mb-10 max-w-[500px] animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              The fastest, most secure way to fund and withdraw from your Deriv account. No delays, no manual verification hassles.
            </p>

            {/* Action Buttons Box */}
            <div className="w-full max-w-[400px] md:max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="rounded-2xl border border-black-1/5 bg-white/50 p-3 dark:border-white/5 dark:bg-black-1/20 backdrop-blur-sm lg:inline-flex lg:items-center lg:gap-4">
                <Button 
                  asChild 
                  className="btn-secondary w-full lg:w-48 h-14 px-8 rounded-xl shadow-md group"
                >
                  <Link href={ROUTES.SIGN_IN} className="flex items-center justify-center gap-2">
                    <span className="text-16-bold">Get Started Now</span>
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="ghost" 
                  className="w-full lg:w-32 h-14 px-8 rounded-xl mt-3 lg:mt-0 text-16-bold bg-black-1/5 dark:bg-white/5 hover:bg-black-1/10 transition-colors"
                >
                  <Link href={ROUTES.SIGN_IN}>Log in</Link>
                </Button>
              </div>
              
              <p className="mt-4 text-12-regular text-black-1/40 dark:text-white/40 md:text-14-regular">
                Simple T&Cs, lightning-fast verification process.
              </p>
            </div>
          </div>

          {/* Right Image/Mockup */}
          <div className="relative w-full max-w-[650px] lg:max-w-none lg:flex-1 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl shadow-md">
              <Image
                src="/assets/home/hero.webp"
                alt="Pavied Dashboard Preview"
                fill
                priority
                className="object-cover object-left"
              />
              
  
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
