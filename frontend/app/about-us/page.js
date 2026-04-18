"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "Verified Listings",
    description:
      "Each listing is checked for basic authenticity so buyers can explore with confidence.",
    icon: "✓",
  },
  {
    title: "Transparent Process",
    description:
      "Clear car details, clear communication, and zero confusion through each buying step.",
    icon: "◎",
  },
  {
    title: "Human Support",
    description:
      "Our support team helps you compare options and make confident decisions quickly.",
    icon: "★",
  },
];

const stats = [
  { label: "Verified Listings", value: "1200+" },
  { label: "Happy Buyers", value: "8.5K+" },
  { label: "Cities Served", value: "45+" },
  { label: "Support", value: "24/7" },
];

const journey = [
  {
    year: "2021",
    title: "Started The Platform",
    description: "Launched with a mission to simplify used-car buying.",
  },
  {
    year: "2023",
    title: "Expanded Nationwide",
    description: "Reached dozens of cities and thousands of active buyers.",
  },
  {
    year: "2026",
    title: "Premium Experience",
    description: "Focused on modern design, trust, and support-first service.",
  },
];
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};

export default function AboutUsPage() {
  return (
    <main className="bg-white">
      <motion.section {...fadeUp} className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-28 top-8 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                About Us
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                Driving Dreams With Trusted Used Cars
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
                Your Dreams Cars is a modern marketplace where quality, trust, and
                customer care come first. We help people discover premium used cars
                and complete their buying journey without stress.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/"
                  className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Back to Home
                </a>
                <a
                  href="#our-journey"
                  className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  View Our Journey
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury car front view"
                className="h-72 w-full rounded-2xl object-cover"
              />
              <div className="grid gap-3">
                <img
                  src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80"
                  alt="Sports car profile"
                  className="h-32 w-full rounded-2xl object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern car headlight"
                  className="h-36 w-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((item) => (
              <motion.div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm text-slate-600">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose Us</h2>
          <p className="mt-2 text-slate-600">
            Designed for confidence at every step.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((item) => (
            <motion.article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                {item.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        {...fadeUp}
        id="our-journey"
        className="border-y border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Our Journey</h2>
            <p className="mt-2 text-slate-600">
              Building a better used-car experience year by year.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {journey.map((item) => (
              <motion.article
                key={item.year}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-semibold text-blue-700">{item.year}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white transition md:p-10">
          <h2 className="text-3xl font-bold md:text-4xl">
            Start Your Car Journey Today
          </h2>
          <p className="mt-3 max-w-2xl text-slate-200">
            Explore featured cars, submit your request in seconds, and let our team
            help you secure the right option at the best value.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Explore Home Page
          </a>
        </div>
      </motion.section>
    </main>
  );
}
