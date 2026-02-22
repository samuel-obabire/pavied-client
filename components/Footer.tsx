import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

// Settlement & payment infrastructure footer positioning update.
const Footer = () => {
  return (
    <footer className="bg-secondary pt-[180px] pb-10">
      <div className="max-w-[1300px] mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-black-1/10 pb-10 md:flex-row">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Go to homepage"
            className="transition-opacity hover:opacity-90"
          >
            <div className="text-32-normal font-federo text-primary dark:text-white">
              <span className="relative left-1">Pa</span>
              <span className="relative inline-block h-10 w-9 ">
                <Image
                  className="absolute top-[3px]  left-2"
                  src="/assets/pavied-mark-white.png"
                  width={60.61}
                  height={33.8}
                  alt="check-mark"
                />
              </span>
              <span className="relative right-2">ied</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav
            aria-label="Footer navigation"
            className="flex items-center gap-6 md:gap-12"
          >
            <Link
              href="/"
              className="text-16-bold text-black-1 transition-colors hover:text-black-1/70"
            >
              Trading Platforms
            </Link>
            <Link
              href="/"
              className="text-16-bold text-black-1 transition-colors hover:text-black-1/70"
            >
              Settlement Partners
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="text-16-bold text-black-1 transition-colors hover:text-black-1/70"
            >
              Enterprise
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <Link
              href="#"
              aria-label="Twitter"
              className="text-black-1 transition-transform hover:scale-110"
            >
              <Twitter className="size-6" />
            </Link>
            <Link
              href="#"
              aria-label="Facebook"
              className="text-black-1 transition-transform hover:scale-110"
            >
              <Facebook className="size-6" />
            </Link>
            <Link
              href="#"
              aria-label="Instagram"
              className="text-black-1 transition-transform hover:scale-110"
            >
              <Instagram className="size-6" />
            </Link>
            <Link
              href="#"
              aria-label="Github"
              className="text-black-1 transition-transform hover:scale-110"
            >
              <Github className="size-6" />
            </Link>
          </div>
        </div>

        {/* Bottom Footer Content */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-14-medium text-black-1/70 max-w-[620px] text-center md:text-left">
            Pavied is a digital payment facilitation and settlement service
            supporting financial platforms and trading ecosystems.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-14-medium text-black-1/60">
            © Copyright 2026, All Rights Reserved
          </p>

          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-14-medium text-black-1 transition-colors hover:text-black-1/70"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="text-14-medium text-black-1 transition-colors hover:text-black-1/70"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
