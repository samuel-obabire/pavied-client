"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

type FaqItem = {
  question: string;
  answer: string;
};

// Settlement & payment infrastructure FAQ adaptation.
const faqData: FaqItem[] = [
  {
    question: "What is a settlement/payment brokerage platform?",
    answer:
      "A settlement/payment brokerage platform helps users deposit and withdraw funds quickly across trading platforms and local payment rails such as bank transfers.",
  },
  {
    question: "Can I use Pavied with trading platforms?",
    answer:
      "Yes. Pavied supports secure deposits and withdrawals for trading platforms, fintech operators, and payment-heavy products.",
  },
  {
    question: "How fast are deposits and withdrawals?",
    answer:
      "Most transactions are processed within 1–5 minutes, depending on network and bank confirmation.",
  },
  {
    question: "What is the minimum and maximum amount I can transact?",
    answer:
      "Transaction limits vary based on current liquidity, compliance checks, and active settlement corridors. Please contact support for the latest limits.",
  },
  {
    question: "Do you charge any hidden fees?",
    answer:
      "No. All rates are clearly communicated before transactions. Transparency is a core value at Pavied.",
  },

  {
    question: "Is my money safe with Pavied?",
    answer:
      "Yes. Security is a top priority at Pavied, with bank-grade encryption and secure protocols protecting your data and transactions end to end. Pavied does not keep custody of customer funds; we facilitate secure payment processing and settlement between supported channels.",
  },
  {
    question: "Can beginners and businesses use Pavied?",
    answer:
      "Absolutely. Our platform is user-friendly for new users and robust enough for businesses that need reliable, high-frequency settlements.",
  },
  {
    question: "What happens if my transaction fails?",
    answer:
      "In the unlikely event of a failed transaction, our system automatically triggers an immediate review. If funds were debited, they are refunded promptly, and you can contact our support team right away for immediate resolution.",
  },
  {
    question: "How do I reach customer support?",
    answer:
      "Our support team is available 24/7. You can contact us through whatsApp or by sending an email to support@pavied.com for immediate assistance.",
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
              Settlement Infrastructure FAQs
            </h2>

            <p className="mt-6 text-16-medium text-black-1/60 dark:text-white/60 md:text-18-medium">
              Can’t find the answer you’re looking for?
              <br />
              Reach out to our{" "}
              <Link
                href={ROUTES.CONTACT}
                className="text-secondary cursor-pointer hover:underline"
              >
                customer support team.
              </Link>
            </p>
          </div>

          {/* Right Content - Accordion */}
          <div className="flex-1 lg:max-w-[700px]">
            <AccordionPrimitive.Root
              type="single"
              collapsible
              className="w-full space-y-4"
            >
              {faqData.map((item) => (
                <AccordionPrimitive.Item
                  key={item.question}
                  value={item.question}
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
                    <div className="pb-8">{item.answer}</div>
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
