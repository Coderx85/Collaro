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
    <div className='max-w-7xl mx-auto py-8'>
      <h2 className='text-2xl font-bold text-center mb-6'>
        Frequently Asked Questions
      </h2>
      <Accordion type='single' collapsible>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
