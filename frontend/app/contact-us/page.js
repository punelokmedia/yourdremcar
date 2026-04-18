"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../../lib/getApiUrl";
import {
  CONTACT_PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_URL,
} from "../../lib/contactInfo";

const API_URL = getApiUrl();

const channels = [
  {
    title: "Customer Support",
    detail: "yourdreamcars1806@gmail.com",
    note: "Replies within 2-4 hours",
  },
  {
    title: "Phone Support",
    detail: CONTACT_PHONE_DISPLAY,
    note: "Mon - Sat, 9:00 AM to 8:00 PM",
    phoneLinks: true,
  },
  {
    title: "Office Address",
    detail: "Downtown Business Avenue, City Center",
    note: "Walk-ins by prior appointment",
  },
];

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
    <main className="bg-white">
      <motion.section
        {...fadeUp}
        className="relative overflow-hidden border-b border-slate-200"
      >
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
          alt="Car background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/78" />
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Contact Us
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Let&apos;s Talk About Your Next Car
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Have a question, need guidance, or want a quick callback? Our team is
            here to help you with trusted support and fast responses.
          </p>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {channels.map((channel) => (
            <motion.article
              key={channel.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-slate-900">{channel.title}</h3>
              {channel.phoneLinks ? (
                <div className="mt-2 space-y-2 text-sm font-medium text-slate-800">
                  <p>{channel.detail}</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={TEL_HREF}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-slate-900 transition hover:bg-slate-100"
                    >
                      Call
                    </a>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-900 transition hover:bg-emerald-100"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm font-medium text-slate-800">{channel.detail}</p>
              )}
              <p className="mt-1 text-sm text-slate-600">{channel.note}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition md:grid-cols-[1.35fr_1fr] md:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Send Us A Message</h2>
              <p className="mt-2 text-slate-600">
                Fill in your details and our team will get back to you shortly.
              </p>
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80"
                alt="Car interior view"
                className="mt-6 h-64 w-full rounded-2xl object-cover"
              />
            </div>

            <div>
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={onChange}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                    required
                  />
                </div>

                <p className="text-xs text-slate-500">
                  By submitting this form, you agree to be contacted by our support
                  team regarding your query.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Sending..." : "Send Message"}
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
          </div>

          <div className="space-y-4 md:pt-2">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">Why Contact Us</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Quick callback assistance for buy requests</li>
                <li>• Car shortlisting support based on budget</li>
                <li>• Transparent guidance before final decision</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">Working Hours</h3>
              <p className="mt-3 text-sm text-slate-600">Monday - Saturday</p>
              <p className="text-sm font-medium text-slate-800">9:00 AM - 8:00 PM</p>
              <p className="mt-3 text-sm text-slate-600">Sunday</p>
              <p className="text-sm font-medium text-slate-800">Emergency email support</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Premium car showroom"
                className="h-44 w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600">
            Common queries about support, response time, and buying assistance.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {faqs.map((item) => (
              <motion.article
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white p-5"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
