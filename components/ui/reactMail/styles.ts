import { pixelBasedPreset } from "@react-email/components";

export const EMAIL_FONT_FAMILY = "Inter";
export const EMAIL_FONT_FALLBACK = "Helvetica";

export const EMAIL_FONT_WEB = {
  url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  format: "woff2" as const,
};

export const EMAIL_TAILWIND_CONFIG = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        primary: "#1c1655",
        secondary: "#e2a704",
        accent: "#f5f6f8",
        ink: "#101010",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
};

export const EMAIL_HEADING_CLASS =
  "mt-3 mb-0 text-[30px] leading-[36px] font-semibold text-primary";

export const EMAIL_BODY_CLASS = "bg-accent m-0 px-3 py-8 font-sans";

export const EMAIL_CONTAINER_CLASS =
  "mx-auto max-w-[560px] rounded-xl border border-solid border-[#edeef2] bg-white p-8";
