import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Headphones,
  MessageSquare,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

type WhyFeature = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

// Settlement & payment infrastructure copy adaptation for core features.
const whyFeatures: WhyFeature[] = [
  {
    title: "Automated Settlement Routing",
    description:
      "Route user deposits securely to supported financial platforms with minimal delay.",
    Icon: Clock,
  },
  {
    title: "Structured Payout Automation",
    description:
      "Process withdrawals with optimized liquidity management and fast turnaround times.",
    Icon: MessageSquare,
  },
  {
    title: "Real-Time Transaction Monitoring",
    description:
      "Access detailed logs, user-level tracking, and settlement history from your dashboard.",
    Icon: Zap,
  },
  {
    title: "Dynamic Account Infrastructure",
    description:
      "Utilize virtual account mapping to streamline inbound settlement tracking.",
    Icon: Wallet,
  },
  {
    title: "Transparent Rates & Liquidity Management",
    description:
      "Competitive, structured pricing with clear conversion breakdowns.",
    Icon: Headphones,
  },
  {
    title: "Security & Compliance Controls",
    description:
      "Built with encryption, audit-aware logging, and risk-aware settlement operations.",
    Icon: ShieldCheck,
  },
];

const WhySection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-secondary/10 px-4 py-2 text-secondary">
            <span className="text-12-medium md:text-14-medium font-semibold">
              Core Features
            </span>
          </div>
          <h2 className="max-w-4xl text-[32px] font-bold leading-[40px] text-primary dark:text-white md:text-[48px] md:leading-[56px]">
            Powering Fast, Reliable Settlement Flows
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-6 rounded-2xl border border-black-1/5 bg-white/50 p-8 transition-all duration-300 hover:border-secondary/50 hover:shadow-xl dark:border-white/5 dark:bg-black-1/20 backdrop-blur-sm"
            >
              <div className="flex size-14 items-center justify-center rounded-xl bg-secondary text-white transition-transform duration-300 group-hover:scale-110">
                <feature.Icon className="size-7" />
              </div>
              <div className="space-y-3">
                <h3 className="text-20-medium text-black-1 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-14-regular leading-relaxed text-black-1/60 dark:text-white/60">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
