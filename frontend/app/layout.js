import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import logo from "../logo.png";

export const metadata = {
  title: "Car Sells",
  description: "Buy and sell cars",
  icons: {
    icon: logo.src,
    shortcut: logo.src,
    apple: logo.src,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-white text-slate-900 antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
