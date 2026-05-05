"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsentBanner from "./CookieConsentBanner";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hidePublicChrome = pathname?.startsWith("/admin") && pathname !== "/admin/login";

  if (hidePublicChrome) {
    return (
      <div className="min-h-[100dvh] overflow-x-clip overflow-y-visible">
        {children}
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip overflow-y-visible">
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-96 w-96 -translate-x-1/2 rounded-full bg-slate-200/70 blur-3xl sm:block" />
      <Navbar />
      {children}
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}
