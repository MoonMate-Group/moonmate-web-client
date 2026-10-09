"use client";

import { useState } from "react";
import { CheckCircle2Icon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const topics = ["Corporate enquiries", "Strategic partnerships", "Investment enquiries", "Careers", "General enquiries"];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status" className="flex items-start gap-4 rounded-2xl border bg-card p-8 backdrop-blur-xl">
        <CheckCircle2Icon className="mt-1 size-6 text-success" aria-hidden="true" />
        <div>
          <p className="text-lg font-semibold">Thank you — your message has been noted.</p>
          <p className="mt-2 text-sm text-muted-foreground">Our team will respond via the relevant desk as soon as possible.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire to an API route / email service before launch.
        setSent(true);
      }}
      className="rounded-2xl border bg-card p-6 backdrop-blur-xl sm:p-10"
    >
      <FieldGroup>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" name="name" autoComplete="name" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Work email</FieldLabel>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="org">Organisation</FieldLabel>
          <Input id="org" name="org" autoComplete="organization" />
        </Field>
        <Field>
          <FieldLabel htmlFor="topic">Enquiry type</FieldLabel>
          <Select name="topic" defaultValue={topics[0]}>
            <SelectTrigger id="topic" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {topics.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea id="message" name="message" rows={6} required />
        </Field>
        <Button type="submit" size="lg" className="self-start">
          <SendIcon data-icon="inline-start" />
          Send enquiry
        </Button>
      </FieldGroup>
    </form>
  );
}
