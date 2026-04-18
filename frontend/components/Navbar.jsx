"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../logo.png";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Gallery", href: "/gallery" },
  { label: "Inventory", href: "/inventory" },
  { label: "Contact", href: "/contact-us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90 lg:backdrop-blur-xl"
    >
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <a href="/" className="flex min-w-0 items-center gap-3 text-slate-900">
          <span className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full md:h-[88px] md:w-[88px]">
            <Image
              src={logo}
              alt="Your Dream Cars logo"
              width={112}
              height={112}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-black tracking-tight md:tracking-tighter">
              <span className="bg-gradient-to-r from-blue-800 via-indigo-600 to-indigo-500 bg-clip-text text-lg text-transparent md:text-xl lg:text-2xl">
                Your Dream Cars
              </span>
            </p>
            <p className="hidden truncate text-xs font-medium text-slate-500 sm:block">
              Drive your dream today
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 shadow-sm lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="hidden shrink-0 rounded-full bg-gradient-to-r from-slate-800 to-black px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-slate-700 hover:to-slate-900 md:inline-flex"
          >
            Get Started
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-slate-700 transition ${
                  isOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-slate-700 transition ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-slate-700 transition ${
                  isOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden"
        >
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
