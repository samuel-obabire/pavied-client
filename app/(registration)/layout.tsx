import { ReactNode } from "react";

import BrandName from "@/components/BrandName";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen py-10">
      <header className="flex-none text-center">
        <BrandName />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}
