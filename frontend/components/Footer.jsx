"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import logo from "../logo.png";
import {
  BUSINESS_ADDRESS,
  CONTACT_PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_URL,
} from "../lib/contactInfo";

export default function Footer() {
  return (
    <motion.footer
      id="footer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-20 text-slate-700"
    >
      <div className="relative overflow-hidden border-t border-slate-200">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80"
        >
          <source
            src="https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-red-car-driving-on-a-rural-road-4076-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://videos.pexels.com/video-files/1930039/1930039-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/55" />
        <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-12 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-24">
          <div className="pb-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-base font-bold uppercase tracking-[0.2em] text-blue-300">
                  Your Dream Cars
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                  Premium Used Cars, Trusted Experience
                </h2>
                <p className="mt-3 text-base text-slate-200 md:text-lg">
                  Explore quality listings, transparent pricing, and professional
                  support from inquiry to delivery.
                </p>
              </div>
              <a
                href="/inventory"
                className="rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/15"
              >
                Browse Inventory
              </a>
            </div>
          </div>

          <div className="h-px w-full bg-white/25" />

          <div className="grid gap-8 py-8 md:grid-cols-3 md:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-16 w-16 overflow-hidden md:h-20 md:w-20">
                  <Image
                    src={logo}
                    alt="Your Dream Cars logo"
                    width={96}
                    height={96}
                    className="h-full w-full object-contain"
                  />
                </span>
                <h3 className="text-3xl font-bold text-blue-300">Your Dream Cars</h3>
              </div>
              <p className="mt-3 text-base leading-relaxed text-slate-200">
                A modern marketplace to buy and sell used cars with trust,
                transparency, and premium support.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="mt-3 space-y-2 text-base text-slate-200">
                <li>
                  <a href="/" className="transition hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about-us" className="transition hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/gallery" className="transition hover:text-white">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="/inventory" className="transition hover:text-white">
                    Inventory
                  </a>
                </li>
                <li>
                  <a href="/happy-clients" className="transition hover:text-white">
                    Happy Customers
                  </a>
                </li>
                <li>
                  <a href="/contact-us" className="transition hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white">Contact</h4>
              <p className="mt-3 text-base leading-relaxed text-slate-200">
                <span className="font-medium text-white">Address:</span>{" "}
                {BUSINESS_ADDRESS}
              </p>
              <p className="mt-2 text-base text-slate-200">
                Email: yourdreamcars1806@gmail.com
              </p>
              <div className="mt-2 flex flex-col gap-2 text-base text-slate-200">
                <a
                  href={TEL_HREF}
                  className="w-fit font-medium text-white underline decoration-white/40 underline-offset-2 transition hover:decoration-white"
                >
                  Call: {CONTACT_PHONE_DISPLAY}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit font-medium text-emerald-200 underline decoration-emerald-200/50 underline-offset-2 transition hover:text-white hover:decoration-white"
                >
                  WhatsApp
                </a>
              </div>
              <p className="mt-2 text-base text-slate-200">Monday - Sunday: 9AM to 8PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-4 text-center text-base font-semibold text-blue-100 md:text-lg">
        {new Date().getFullYear()} Your Dream Cars. All rights reserved.
      </div>
    </motion.footer>
  );
}
