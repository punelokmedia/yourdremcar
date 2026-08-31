"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../logo.png";
import {
  BUSINESS_ADDRESS,
  CONTACT_PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_URL,
} from "../lib/contactInfo";
import { CAR_SELLS_COOKIE_OPEN_EVENT } from "./CookieConsentBanner";

const exploreLinks = [
  { label: "Inventory", href: "/inventory" },
  { label: "Gallery", href: "/gallery" },
  { label: "Happy customers", href: "/happy-clients" },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer id="footer" className="mt-10 bg-[#0b1220] text-slate-400 sm:mt-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2 sm:py-10 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
              <Image
                src={logo}
                alt="Your Dream Cars logo"
                width={44}
                height={44}
                className="h-full w-full object-contain"
              />
            </span>
            <p className="text-base font-semibold text-white">Your Dream Cars</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Inspected pre-owned cars in NIBM, Pune — from enquiry to delivery.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Company
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                className="text-left transition hover:text-white"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent(CAR_SELLS_COOKIE_OPEN_EVENT));
                  }
                }}
              >
                Cookie preferences
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Contact
          </h3>
          <p className="mt-3 text-sm leading-relaxed">{BUSINESS_ADDRESS}</p>
          <p className="mt-1 text-sm">Mon–Sun · 9 AM to 8 PM</p>
          <a
            href={TEL_HREF}
            className="mt-3 block w-fit text-sm font-medium text-white transition hover:text-sky-200"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block w-fit text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Your Dream Cars. All rights reserved.
          </p>
          <Link
            href="/privacy"
            className="text-xs font-medium text-slate-400 transition hover:text-white"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
