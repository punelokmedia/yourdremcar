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
    <div className="relative min-h-[100dvh] overflow-x-clip overflow-y-visible bg-[#f4f6f8]">
      <Navbar />
      {children}
      <Footer />
      <CookieConsentBanner />
    </div>
  );
}
