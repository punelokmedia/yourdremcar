"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../logo.png";
import { CONTACT_PHONE_DISPLAY, TEL_HREF } from "../lib/contactInfo";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Gallery", href: "/gallery" },
  { label: "Inventory", href: "/inventory" },
  { label: "Customers", href: "/happy-clients" },
  { label: "Contact", href: "/contact-us" },
];

function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? "border-slate-200/90 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          : "border-slate-200/70 bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 md:h-[76px]">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-slate-900 sm:gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-slate-200 sm:h-11 sm:w-11 md:h-12 md:w-12">
            <Image
              src={logo}
              alt="Your Dream Cars logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
              priority
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold tracking-tight text-blue-800 sm:text-[15px] md:text-base">
              Your Dream Cars
            </span>
            <span className="hidden truncate text-[11px] font-medium tracking-wide text-slate-500 sm:block">
              Premium pre-owned · Pune
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={TEL_HREF}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.608-1.288.608-.407 0-.815-.112-1.173-.327l-3.5-2.25a2.25 2.25 0 01-.327-1.173V9.75c0-.519.232-1.006.608-1.288l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            {CONTACT_PHONE_DISPLAY}
          </a>
          <Link
            href="/inventory"
            className="hidden rounded-full bg-slate-900 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-black md:inline-flex"
          >
            Browse cars
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-4 bg-slate-800 transition ${
                  isOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] h-0.5 w-4 bg-slate-800 transition ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[12px] h-0.5 w-4 bg-slate-800 transition ${
                  isOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
              {links.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                      active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <a
                  href={TEL_HREF}
                  className="rounded-full border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold text-slate-800"
                >
                  Call
                </a>
                <Link
                  href="/inventory"
                  className="rounded-full bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Browse cars
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
