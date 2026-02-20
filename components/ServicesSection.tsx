type Service = {
  id: string;
  title: string;
  description: string;
};

// Settlement & payment infrastructure copy adaptation for what-we-do and who-we-serve content.
const services: Service[] = [
  {
    id: "A",
    title: "Utility Bills",
    description:
      "Pay electricity, water, and other bills seamlessly through our platform.",
  },
  {
    id: "B",
    title: "Cable Subscription",
    description:
      "Subscribe or renew DSTV, GOtv, StarTimes, and other cable services instantly.",
  },

  {
    id: "C",
    title: "Betting",
    description:
      "Fund your betting accounts instantly or withdraw winnings securely.",
  },
  {
    id: "D",
    title: "Merchant Payments",
    description:
      "Pay vendors, brokers, freelancers, and contractors directly through the platform.",
  },
  {
    id: "E",
    title: "Online Earnings",
    description:
      "Withdraw your online earnings to your local bank account in Nigeria and across Africa using our secure payout options.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
          {/* Left Content */}
          <div className="flex flex-col items-start lg:max-w-[450px]">
            <div className="mb-6 inline-flex items-center rounded-full bg-secondary/10 px-4 py-2 text-secondary">
              <span className="text-12-medium md:text-14-medium">
                What We Do
              </span>
            </div>

            <h2 className="text-[36px] font-bold leading-[44px] text-primary dark:text-white md:text-[56px] md:leading-[64px]">
              Built for Modern Financial Operators
            </h2>

            <p className="mt-6 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
              Pavied provides digital payment facilitation and settlement
              services for online brokerage platforms, fintech applications, and
              high-volume traders.
            </p>
            <p className="mt-3 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
              We enable fast deposit routing and structured payout automation
              with full transaction visibility and ledger tracking.
            </p>

            <div className="mt-8">
              <h3 className="text-20-bold text-black-1 dark:text-white md:text-24-bold">
                Payment Processing
              </h3>
              <p className="mt-3 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
                We provide payment processing services across Sub-Saharan Africa
                with multiple methods, including cash, mobile payments,
                debit/credit cards, and local agents. Pavied acts as the payment
                facilitation layer between clients and merchants, helping funds
                move quickly and securely.
              </p>
            </div>
          </div>

          {/* Right Content - Service Cards */}
          <div className="flex flex-1 flex-col gap-6 lg:max-w-[600px]">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative rounded-2xl border border-black-1/5 bg-white p-8 transition-all duration-300 hover:border-secondary/50 hover:shadow-xl dark:border-white/5 dark:bg-black-1/20 ml-4"
              >
                {/* Roman Numeral Badge */}
                <div className="absolute -left-3 top-8 flex size-10 items-center justify-center rounded-lg bg-secondary text-white text-14-bold shadow-md md:-left-5 scale-90 group-hover:scale-100 transition-transform">
                  {service.id}
                </div>

                <div className="pl-6 md:pl-8">
                  <h3 className="text-[20px] font-bold text-black-1 dark:text-white md:text-[24px]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-14-regular leading-relaxed text-black-1/60 dark:text-white/60 md:text-16-regular">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
