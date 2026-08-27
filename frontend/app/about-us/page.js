"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const pillars = [
  {
    title: "Verified listings",
    description:
      "Each car is checked so you can compare options with clear, honest details.",
  },
  {
    title: "Transparent process",
    description:
      "Pricing, paperwork, and next steps are explained before you decide.",
  },
  {
    title: "Human support",
    description:
      "A team in Pune stays with you from the first enquiry through delivery.",
  },
];

const stats = [
  { label: "Verified listings", value: "1200+" },
  { label: "Happy buyers", value: "8.5K+" },
  { label: "Cities served", value: "45+" },
  { label: "Support", value: "24/7" },
];

const journey = [
  {
    year: "2021",
    title: "Started the platform",
    description: "Launched with a simple goal: make used-car buying less stressful.",
  },
  {
    year: "2023",
    title: "Grew with buyers",
    description: "Reached more cities and helped thousands complete their purchase.",
  },
  {
    year: "2026",
    title: "Premium experience",
    description: "Focused on inspected stock, warranty support, and personal care.",
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
    <main className="bg-[#f4f6f8]">
      <motion.section {...fadeUp} className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:gap-14 md:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              About us
            </p>
            <h1 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-tight text-blue-800 sm:text-4xl md:text-5xl">
              Driving dreams with trusted used cars
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              Your Dream Cars is a Pune showroom where quality, trust, and customer
              care come first. We help people find inspected pre-owned cars and
              finish the buying journey without stress.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/inventory"
                className="inline-flex rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Browse cars
              </a>
              <a
                href="#our-journey"
                className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Our journey
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
              alt="Premium used car"
              className="h-52 w-full object-cover sm:h-72 md:h-[420px]"
            />
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:gap-14 md:py-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:max-h-[520px]">
            <Image
              src="/akshay-c-pardhan.png"
              alt="Professional portrait of Akshay C Pardhan"
              fill
              className="object-cover object-[center_18%]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Leadership
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl md:text-5xl">
              Akshay C Pardhan
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              Leading Your Dream Cars with a focus on trust, transparency, and a
              premium experience for every buyer. Our mission is to make finding
              and owning the right used car simple and confident.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-6 border-y border-slate-200 py-8 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-semibold tracking-tight text-blue-800">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Why choose us
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-blue-800">
          Designed for confidence at every step
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {pillars.map((item) => (
            <div key={item.title}>
              <h3 className="text-lg font-semibold text-blue-800">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        {...fadeUp}
        id="our-journey"
        className="border-y border-slate-200/80 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Our journey
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-blue-800">
            Building a better used-car experience
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {journey.map((item) => (
              <div key={item.year}>
                <p className="text-sm font-semibold text-blue-600">{item.year}</p>
                <h3 className="mt-2 text-lg font-semibold text-blue-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 py-14">
        <div className="overflow-hidden rounded-2xl bg-slate-900 px-6 py-10 text-white md:px-10 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-blue-100 md:text-3xl">
            Start your car journey today
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            Explore inspected cars, send a request in seconds, and let our team help
            you lock the right option at a fair price.
          </p>
          <a
            href="/inventory"
            className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Browse inventory
          </a>
        </div>
      </motion.section>
    </main>
  );
}
