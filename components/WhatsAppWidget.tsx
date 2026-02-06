"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { WIDGET_HIDDEN_PREFIXES, WIDGET_HIDDEN_ROUTES } from "@/lib/constants/widget";
import { WHATSAPP_SUPPORT_LINK } from "@/lib/constants/contacts";

export default function WhatsAppWidget() {
  const pathname = usePathname();

  // Check if current path is in excluded routes (exact match)
  const isExactMatch = WIDGET_HIDDEN_ROUTES.includes(pathname);

  // Check if current path starts with any excluded prefix
  const isPrefixMatch = WIDGET_HIDDEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // If match found, do not render the widget
  if (isExactMatch || isPrefixMatch) {
    return null;
  }

  return (
    <Link
      href={WHATSAPP_SUPPORT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <Image
        src="/assets/whatsapp.png"
        alt="WhatsApp"
        width={56}
        height={56}
        className="h-full w-full object-contain"
        priority
      />
    </Link>
  );
}
