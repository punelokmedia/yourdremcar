"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const hidePublicChrome = pathname?.startsWith("/admin") && pathname !== "/admin/login";

  if (hidePublicChrome) {
    return (
      <div className="min-h-screen overflow-x-hidden overflow-y-visible">
        {children}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-visible">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-slate-200/70 blur-3xl" />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
