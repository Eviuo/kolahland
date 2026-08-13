"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible className="divide-y divide-line rounded-2xl border border-line bg-cream">
      {items.map((item, i) => (
        <Accordion.Item key={i} value={`item-${i}`}>
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-right text-sm font-semibold text-ink">
              {item.question}
              <ChevronDown className="h-4 w-4 shrink-0 text-stone transition-transform group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden px-5 pb-4 text-sm leading-7 text-stone data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
