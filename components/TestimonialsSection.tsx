"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import amaka from "@/public/assets/home/amaka.webp";
import chinedu from "@/public/assets/home/chinedu.webp";
import tunde from "@/public/assets/home/tunde.webp";

type Testimonial = {
  name: string;
  role: string;
  content: string;
  image: typeof amaka;
};

// Settlement & payment infrastructure social-proof messaging adaptation.
const testimonials: Testimonial[] = [
  {
    name: "Verified Platform User",
    role: "Operations Lead (Lagos)",
    content:
      "Pavied has streamlined our deposit and payout processing with reliable execution and transparent records.",
    image: chinedu,
  },
  {
    name: "Verified Platform User",
    role: "Finance Manager (PH)",
    content:
      "Settlement visibility and execution speed improved significantly after we integrated Pavied into our operations.",
    image: amaka,
  },
  {
    name: "Verified Platform User",
    role: "Product Owner (Ibadan)",
    content:
      "From routing to reconciliation, the platform delivers consistency, audit-ready logs, and confidence for our team.",
    image: tunde,
  },
];

const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2; // scroll-fast
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <section className="overflow-hidden py-16 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 max-w-3xl md:mb-12">
          <div className="mb-5 inline-flex items-center rounded-full bg-secondary/10 px-4 py-1 text-secondary md:mb-6">
            <span className="text-12-medium md:text-14-medium">
              Testimonials
            </span>
          </div>
          <h2 className="text-[36px] font-bold leading-[44px] text-primary dark:text-white md:text-[56px] md:leading-[64px]">
            Trusted by Financial Operators
          </h2>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 md:mb-10 md:grid-cols-3 md:gap-4">
          <div className="rounded-xl border border-black-1/5 bg-white/60 p-3.5 text-center shadow-sm dark:border-white/5 dark:bg-black-1/20 md:p-4">
            <p className="text-20-bold text-primary dark:text-white">10,000+</p>
            <p className="text-14-medium text-black-1/60 dark:text-white/60">
              Transactions Processed
            </p>
          </div>
          <div className="rounded-xl border border-black-1/5 bg-white/60 p-3.5 text-center shadow-sm dark:border-white/5 dark:bg-black-1/20 md:p-4">
            <p className="text-20-bold text-primary dark:text-white">99%+</p>
            <p className="text-14-medium text-black-1/60 dark:text-white/60">
              Successful Settlement Rate
            </p>
          </div>
          <div className="rounded-xl border border-black-1/5 bg-white/60 p-3.5 text-center shadow-sm dark:border-white/5 dark:bg-black-1/20 md:p-4">
            <p className="text-20-bold text-primary dark:text-white">24/7</p>
            <p className="text-14-medium text-black-1/60 dark:text-white/60">
              Real-Time Processing Infrastructure
            </p>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className={`no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-6 md:mx-0 md:gap-6 md:px-0 md:pb-8 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
        >
          {testimonials.map((t) => (
            <div
              key={t.name + t.role}
              className="flex min-w-[300px] select-none flex-col gap-5 rounded-[24px] border border-black-1/5 bg-white/85 p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-white/5 dark:bg-black-1/20 md:min-w-[550px] md:flex-row md:gap-6 md:p-8"
            >
              {/* Profile Image with Info Overlay */}
              <div className="relative h-[250px] w-full shrink-0 overflow-hidden rounded-xl md:h-[280px] md:w-[220px]">
                <Image
                  src={t.image}
                  alt={t.content}
                  fill
                  className="object-cover"
                  draggable={false}
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white p-3 shadow-lg dark:bg-black-2">
                  <h4 className="text-14-bold text-black-1 dark:text-white">
                    {t.name}
                  </h4>
                  <p className="text-12-regular text-black-1/60 dark:text-white/60">
                    {t.role}
                  </p>
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
