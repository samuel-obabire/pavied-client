"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    question: "How do i get repaid after a failed transaction?",
    answer: "Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales.",
  },
  {
    question: "How do i contact customer care?",
    answer: "You can reach our customer support team through the live chat on our website or by sending an email to support@pavied.com. We are available 24/7 to assist you with any inquiries.",
  },
  {
    question: "Is Pavied safe to use?",
    answer: "Yes, Pavied is built with security as a priority. we use bank-level encryption and secure protocols to ensure your transactions and data are protected at all times.",
  },
  {
    question: "How long does it take to withdraw asset?",
    answer: "Withdrawals on Pavied are designed to be lightning-fast. In most cases, assets are credited to your destination account within minutes of the request being processed.",
  },
];

const FaqSection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          
          {/* Left Content */}
          <div className="flex flex-col items-start lg:max-w-[400px]">
            <div className="mb-6 inline-flex items-center rounded-full bg-secondary/10 px-4 py-1 text-secondary">
              <span className="text-12-medium md:text-14-medium">FAQs</span>
            </div>
            
            <h2 className="text-[36px] font-bold leading-[44px] text-primary dark:text-white md:text-[56px] md:leading-[64px]">
              Let's put your mind at ease.
            </h2>
            
            <p className="mt-6 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
              Can’t find the answer you’re looking for?<br />
              Reach out to our <span className="text-secondary cursor-pointer hover:underline">customer support team.</span>
            </p>
          </div>

          {/* Right Content - Accordion */}
          <div className="flex-1 lg:max-w-[700px]">
            <AccordionPrimitive.Root type="single" collapsible className="w-full space-y-4">
              {faqData.map((item, index) => (
                <AccordionPrimitive.Item
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-black-1/5 dark:border-white/5 last:border-0"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between py-6 text-left outline-none">
                      <span className="text-18-bold text-black-1 dark:text-white md:text-24-bold transition-colors group-hover:text-black-1/80 dark:group-hover:text-white/80">
                        {item.question}
                      </span>
                      <div className="flex size-6 shrink-0 items-center justify-center text-black-1 dark:text-white">
                        <Plus className="size-6 transition-all group-data-[state=open]:hidden" />
                        <Minus className="hidden size-6 transition-all group-data-[state=open]:block" />
                      </div>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-14-regular text-black-1/60 dark:text-white/60 md:text-16-regular">
                    <div className="pb-8">
                      {item.answer}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FaqSection;
