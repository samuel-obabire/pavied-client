import type { Metadata } from "next";
import { Lato, Federo } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";

import { ThemeProvider } from "@/components/ThemeProvider";

const LatoSans = Lato({
  weight: ["400"],
  subsets: ["latin"],
});

const FederoSans = Federo({
  variable: "--font-federo-sans",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pavied – Fast & Secure Deriv Deposits and Withdrawals",
  description: `Pavied makes funding and cashing out from your Deriv account effortless. 
    Enjoy lightning-fast deposits, 
    instant withdrawals, and bank-level security — all in one simple platform.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${LatoSans.className} ${FederoSans.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>{children}</NuqsAdapter>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
