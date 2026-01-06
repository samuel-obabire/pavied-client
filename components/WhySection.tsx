import { Clock, MessageSquare, ShieldCheck, Zap, Wallet, Headphones } from "lucide-react";

const whyFeatures = [
  {
    title: "Automated Transactions",
    description: "Our support team is a chat away from assisting you with any technical issues",
    Icon: Clock,
  },
  {
    title: "Flexible Funding Amounts",
    description: "Our support team is a chat away from assisting you with any technical issues",
    Icon: MessageSquare,
  },
  {
    title: "Fast & Reliable",
    description: "Our support team is a chat away from assisting you with any technical issues",
    Icon: Zap,
  },
  {
    title: "Affordable Rates",
    description: "Our support team is a chat away from assisting you with any technical issues",
    Icon: Wallet,
  },
  {
    title: "24/7 Availability",
    description: "Our support team is a chat away from assisting you with any technical issues",
    Icon: Headphones,
  },
  {
    title: "Secure & Trusted",
    description: "Our support team is a chat away from assisting you with any technical issues",
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
            <span className="text-12-medium md:text-14-medium font-semibold">Why Chose Pavied?</span>
          </div>
          <h2 className="max-w-4xl text-[32px] font-bold leading-[40px] text-primary dark:text-white md:text-[48px] md:leading-[56px]">
            A new simplified way to turn your Deriv assets to cash and your cash to Deriv assets.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyFeatures.map((feature, index) => (
            <div
              key={index}
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
