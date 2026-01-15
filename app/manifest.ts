import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pavied",
    short_name: "Pavied",
    description: "Fast & Secure Deriv Deposits and Withdrawals",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/assets/pavied-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
