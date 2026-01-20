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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pavied.com"),
  title: {
    default: "Pavied – Fast & Secure Deriv Deposits and Withdrawals",
    template: "%s | Pavied",
  },
  description:
    "Pavied makes funding and cashing out from your Deriv account effortless. Enjoy lightning-fast deposits, instant withdrawals, and bank-level security — all in one simple platform.",
  keywords: [
    "Deriv deposits",
    "Deriv withdrawals",
    "funding deriv account",
    "withdraw from deriv",
    "synthetic indices funding",
    "forex trading deposits",
    "pavied",
    "instant payments",
  ],
  authors: [{ name: "Pavied Team" }],
  creator: "Pavied",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Pavied – Fast & Secure Deriv Deposits and Withdrawals",
    description:
      "The easiest way to fund and withdraw from your Deriv account. Instant processing, secure transactions, and 24/7 support.",
    siteName: "Pavied",
    images: [
      {
        url: "/assets/home/hero.webp",
        width: 1200,
        height: 630,
        alt: "Pavied - Deriv Deposits and Withdrawals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pavied – Fast & Secure Deriv Deposits and Withdrawals",
    description:
      "The easiest way to fund and withdraw from your Deriv account. Instant processing, secure transactions, and 24/7 support.",
    images: ["/assets/home/hero.webp"],
    creator: "@pavied",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/favicon.ico",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Pavied",
                  url: process.env.NEXT_PUBLIC_APP_URL || "https://pavied.com",
                  logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://pavied.com"}/favicon.ico`,
                  sameAs: [
                    "https://twitter.com/pavied",
                    "https://facebook.com/pavied",
                    "https://instagram.com/pavied",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+1-234-567-8900",
                    contactType: "customer service",
                    areaServed: "Worldwide",
                    availableLanguage: "English",
                  },
                }),
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
