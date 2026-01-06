import Link from "next/link";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="bg-secondary pt-[180px] pb-10">
      <div className="max-w-[1300px] mx-auto px-4 md:px-6">
        
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-between gap-8 border-b border-black-1/10 pb-10 md:flex-row">
          {/* Logo */}
          <Link href="/" className="transition-opacity hover:opacity-90">
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
    </div>          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 md:gap-12">
            <Link href="/" className="text-16-bold text-black-1 transition-colors hover:text-black-1/70">
              Deriv
            </Link>
            <Link href="/" className="text-16-bold text-black-1 transition-colors hover:text-black-1/70">
              Referral
            </Link>
            <Link href="/" className="text-16-bold text-black-1 transition-colors hover:text-black-1/70">
              Contact us
            </Link>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <Link href="#" className="text-black-1 transition-transform hover:scale-110">
              <Twitter className="size-6" />
            </Link>
            <Link href="#" className="text-black-1 transition-transform hover:scale-110">
              <Facebook className="size-6" />
            </Link>
            <Link href="#" className="text-black-1 transition-transform hover:scale-110">
              <Instagram className="size-6" />
            </Link>
            <Link href="#" className="text-black-1 transition-transform hover:scale-110">
              <Github className="size-6" />
            </Link>
          </div>
        </div>

        {/* Bottom Footer Content */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-14-medium text-black-1/60">
            © Copyright 2026, All Rights Reserved
          </p>
          
          <div className="flex items-center gap-8">
            <Link href="/" className="text-14-medium text-black-1 transition-colors hover:text-black-1/70">
              Privacy Policy
            </Link>
            <Link href="/" className="text-14-medium text-black-1 transition-colors hover:text-black-1/70">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
