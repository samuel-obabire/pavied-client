import Image from "next/image";

const testimonials = [
  {
    name: "Jesse Hiss",
    role: "Founder, Fresh Sends",
    content: "I was spending way too many hours every month on sales tax. And if you wanted someone on customer support from my tax service, there was no one. Pavied has made it possible to identify and know the transaction laws. And then on your behalf, registering, managing everything, is kind of taking the worry off my plate.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Chen",
    role: "Digital Nomad",
    content: "The speed of Deriv transactions on this platform is unmatched. I used to wait hours for my withdrawals to hit my local bank, but with Pavied, it's almost instant. The interface is clean and the customer support team actually answers your questions within minutes. Highly recommended for any serious trader.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Marcus Thorne",
    role: "Trading Expert",
    content: "Automating my deposits was the best decision I made this year. I no longer have to manually verify every single transaction. Pavied handles the heavy lifting, allowing me to focus entirely on my trading strategies. It's safe, secure, and incredibly reliable. A must-have tool for Deriv users.",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full bg-secondary/10 px-4 py-1 text-secondary">
            <span className="text-12-medium md:text-14-medium">Testimonials</span>
          </div>
          <h2 className="text-[36px] font-bold leading-[44px] text-primary dark:text-white md:text-[56px] md:leading-[64px]">
            These are what our users has to say about us.
          </h2>
        </div>

        {/* Scrollable Container */}
        <div className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-8 md:mx-0 md:px-0">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex min-w-[320px] flex-col gap-6 rounded-[24px] border border-black-1/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-black-1/20 md:min-w-[550px] md:flex-row md:p-8"
            >
              {/* Profile Image with Info Overlay */}
              <div className="relative h-[250px] w-full shrink-0 overflow-hidden rounded-xl md:h-[280px] md:w-[220px]">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white p-3 shadow-lg dark:bg-black-2">
                  <h4 className="text-14-bold text-black-1 dark:text-white">{t.name}</h4>
                  <p className="text-12-regular text-black-1/60 dark:text-white/60">{t.role}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <p className="text-16-medium leading-relaxed text-black-1/80 dark:text-white/80 md:text-18-medium">
                  {t.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
