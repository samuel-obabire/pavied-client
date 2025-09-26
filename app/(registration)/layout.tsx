import { ReactNode } from "react";

import BrandName from "@/components/BrandName";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="mt-8">
      <header className="text-center">
        <BrandName />
      </header>

      {children}
    </div>
  );
}
