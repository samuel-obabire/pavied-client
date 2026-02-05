import type { MetadataRoute } from "next";
import { ENV } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = ENV.NEXT_PUBLIC_APP_URL || "https://pavied.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/settings/", "/onboarding/", "/transactions/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
