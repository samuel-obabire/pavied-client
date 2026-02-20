"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import {
  WIDGET_HIDDEN_PREFIXES,
  WIDGET_HIDDEN_ROUTES,
} from "@/lib/constants/widget";
import { WHATSAPP_SUPPORT_NUMBER } from "@/lib/constants/contacts";

export default function WhatsAppWidget() {
  const pathname = usePathname();

  const isExactMatch = WIDGET_HIDDEN_ROUTES.includes(pathname);
  const isPrefixMatch = WIDGET_HIDDEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isExactMatch || isPrefixMatch) {
    return null;
  }

  return (
    <FloatingWhatsApp
      phoneNumber={WHATSAPP_SUPPORT_NUMBER}
      accountName="Pavied Support"
      avatar="/support-agent.webp"
      statusMessage="Typically replies within a few minutes"
      chatMessage="Hello! 👋 Welcome to Pavied. How can we help you today?"
      placeholder="Type a message..."
      notification
      notificationDelay={30}
      allowEsc
    />
  );
}
