"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/constants";

export default function FAQ() {
  return (
    <div className="w-full max-w-full px-4 sm:px-6 md:px-8 mx-auto flex flex-col mt-10 sm:mt-16 md:mt-20 py-4 sm:py-6 md:py-8 lg:min-h-screen">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6">
        Frequently Asked Questions
      </h2>
      <div className="w-full max-w-4xl mx-auto">
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
