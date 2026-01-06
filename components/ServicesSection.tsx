
const services = [
  {
    id: "I",
    title: "Automated Deposits",
    description: "Flexible funding starting at just $1 till any amount desired.",
  },
  {
    id: "II",
    title: "Automated Withdrawals",
    description: "No limits- Withdraw any amount quickly and easily. It's simple, transparent and secure.",
  },
  {
    id: "III",
    title: "Real-Time Notifications",
    description: "Stay updated at every step of your transaction with our real-time updates and notifications.",
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
              <span className="text-12-medium md:text-14-medium">Our Services</span>
            </div>
            
            <h2 className="text-[36px] font-bold leading-[44px] text-primary dark:text-white md:text-[56px] md:leading-[64px]">
              Experience our top services on Pavied
            </h2>
            
            <p className="mt-6 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
              Connect your accounts and let us manage your transactions with speed and reliability from start to finish.
            </p>
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
