"use client";

import { withdrawalErrorFaqs } from "@/lib/constants/faqs";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const WithdrawalFaqs = () => {
  return (
    <div className="mt-8 w-full space-y-4">
      <div className="flex items-center gap-2 px-1">
        <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-black-1_dark-white">
          Frequently Asked Questions
        </h3>
      </div>
      
      <div className="bg-white_dark-black-1 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 shadow-sm px-2 sm:px-4 transition-all duration-200">
        <Accordion type="single" collapsible className="w-full">
          {withdrawalErrorFaqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-gray-100 dark:border-gray-800/60 last:border-0"
            >
              <AccordionTrigger className="text-left text-black-1_dark-white hover:no-underline transition-colors py-4 font-medium text-[15px]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] leading-relaxed text-gray-500 dark:text-gray-400 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
