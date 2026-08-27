"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../../lib/getApiUrl";
import {
  BUSINESS_ADDRESS,
  CONTACT_PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_URL,
} from "../../lib/contactInfo";
import PageHero from "../../components/PageHero";

const API_URL = getApiUrl();

const faqs = [
  {
    question: "How quickly will your team respond?",
    answer:
      "Most contact requests are answered within 2-4 business hours during working days.",
  },
  {
    question: "Can I request a callback for a specific car?",
    answer:
      "Yes. Mention the car name and preferred time in your message and our team will contact you.",
  },
  {
    question: "Do you assist with documentation guidance?",
    answer:
      "Yes. We guide buyers through verification steps, required documents, and next actions.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setStatusMessage("");

    try {
      if (!API_URL) {
        setStatusMessage(MISSING_NEXT_PUBLIC_API_URL);
        return;
      }
      const response = await fetch(`${API_URL}/contact-queries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit contact query");
      }

      setSubmitted(true);
      setStatusMessage(
        "Thank you! Your message has been received. We will contact you soon."
      );
      setForm({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatusMessage(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#f4f6f8]">
      <PageHero
        eyebrow="Contact · Pune"
        title="Let's talk about your next car"
        description="Questions, a callback, or help shortlisting — our team is here from 9 AM to 8 PM, every day."
        imageSrc="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=80"
        stats={["Clover Hills Plaza, NIBM", "Mon–Sun · 9 AM to 8 PM", CONTACT_PHONE_DISPLAY]}
        actions={
          <>
            <a
              href={TEL_HREF}
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Call now
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              WhatsApp
            </a>
          </>
        }
      />

      <motion.section
        {...fadeUp}
        className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-8 sm:py-12 md:grid-cols-2 md:py-16"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Visit & contact
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl">
            We are in NIBM, Pune
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Walk in by appointment, or send a message and we will call you back.
          </p>
          <dl className="mt-8 space-y-5 text-sm">
            <div>
              <dt className="font-semibold text-blue-800">Address</dt>
              <dd className="mt-1 text-slate-600">{BUSINESS_ADDRESS}</dd>
            </div>
            <div>
              <dt className="font-semibold text-blue-800">Phone</dt>
              <dd className="mt-1">
                <a href={TEL_HREF} className="text-slate-800 hover:text-blue-700">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-blue-800">Email</dt>
              <dd className="mt-1 text-slate-600">yourdreamcars1806@gmail.com</dd>
            </div>
            <div>
              <dt className="font-semibold text-blue-800">Hours</dt>
              <dd className="mt-1 text-slate-600">Monday – Sunday · 9:00 AM to 8:00 PM</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200/80 sm:p-5 md:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-blue-800">
            Send us a message
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Fill in your details and our team will get back to you shortly.
          </p>
          <form onSubmit={onSubmit} className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  placeholder="Your full name"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Your email"
                  className={fieldClass}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Your phone number"
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={onChange}
                  placeholder="How can we help?"
                  className={fieldClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={5}
                placeholder="Write your message"
                className={fieldClass}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
          {statusMessage ? (
            <p
              className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                submitted
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {statusMessage}
            </p>
          ) : null}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          FAQ
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {faqs.map((item) => (
            <div key={item.question}>
              <h3 className="text-base font-semibold text-blue-800">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
