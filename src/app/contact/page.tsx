import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageBody, PageHero, Section } from "@/components/PageHero";

export const metadata: Metadata = { title: "Contact Us" };

const desks = ["Corporate enquiries", "Strategic partnerships", "Investment enquiries", "Careers", "General enquiries"];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact us" title="Start a conversation." lead="Choose the relevant enquiry type and we will route your message to the right team." />
      <PageBody>
        <Section>
          <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
            <ul className="flex flex-col gap-4">
              {desks.map((d) => <li key={d} className="border-t pt-4 text-muted-foreground">{d}</li>)}
            </ul>
            <ContactForm />
          </div>
        </Section>
      </PageBody>
    </>
  );
}
