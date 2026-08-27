import { Outfit } from "next/font/google";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import logo from "../logo.png";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Your Dream Cars | Premium Pre-Owned Cars in Pune",
  description:
    "Inspected used cars in Pune with transparent pricing, warranty support, and personal assistance from inquiry to delivery.",
  icons: {
    icon: logo.src,
    shortcut: logo.src,
    apple: logo.src,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${outfit.className} min-h-[100dvh] bg-[#f4f6f8] text-slate-900 antialiased`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
