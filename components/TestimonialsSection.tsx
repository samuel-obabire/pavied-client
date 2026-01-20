import Image from "next/image";

const testimonials = [
  {
    name: "Chinedu Okeke",
    role: "Forex Trader (Lagos)",
    content: "I've tried many payment agents, but Pavied is on another level. The automation is real, I received my withdrawal in less than 2 minutes. No more chasing agents on WhatsApp or waiting for hours. If you're serious about trading, this is your best bet.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Amaka Uzor",
    role: "Digital Entrepreneur (PH)",
    content: "Reliability is everything when you're trading. Pavied has never failed me. The $1 minimum funding is perfect for testing new strategies before going big. The interface is clean, and the support team is actually helpful and responsive.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Tunde Balogun",
    role: "Professional Trader (Ibadan)",
    content: "The rates here are consistently better than what I find elsewhere. Plus, the automated verification took only a few minutes. It's a game-changer for Nigerian Deriv traders who value their time as much as their money.",
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
            Trusted by the Nigeria trading community.
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
