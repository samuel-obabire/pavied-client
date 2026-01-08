"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import BrandName from "./BrandName";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Contact us", href: ROUTES.CONTACT },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black-1/5 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-black-2/80">
      <div className="max-w-[1300px] mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="transition-opacity hover:opacity-90">
          <BrandName />
        </Link>

        {/* Desktop Navigation (Centered) */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-16-medium transition-colors hover:text-black-1 dark:hover:text-white",
                  isActive 
                    ? "font-semibold text-secondary" 
                    : "text-black-1/70 dark:text-white/70"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions (Right) */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={ROUTES.SIGN_IN}
            className="text-16-bold text-black-1/80 transition-colors hover:text-black-1 dark:text-white/80 dark:hover:text-white w-20"
          >
            Sign up
          </Link>
          <Button asChild className="btn-secondary h-11 w-28 rounded-lg shadow-sm">
            <Link href={ROUTES.SIGN_IN}>Log in</Link>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] border-l border-black-1/5 bg-white p-0 dark:border-white/5 dark:bg-black-2">
            <SheetHeader className="flex h-20 items-center justify-between border-b border-black-1/5 px-6 dark:border-white/5">
              <div className="scale-90 origin-left">
                <BrandName />
              </div>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 p-8">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-18-medium transition-colors hover:text-black-1 dark:hover:text-white",
                        isActive 
                          ? "font-semibold text-secondary" 
                          : "text-black-1/70 dark:text-white/70"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-4 flex flex-col gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 border-black-1/10 text-16-bold dark:border-white/10"
                >
                  <Link href={ROUTES.SIGN_IN} onClick={() => setIsOpen(false)}>
                    Sign up
                  </Link>
                </Button>
                <Button asChild className="btn-secondary h-12 text-16-bold shadow-sm">
                  <Link href={ROUTES.SIGN_IN} onClick={() => setIsOpen(false)}>
                    Log in
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
