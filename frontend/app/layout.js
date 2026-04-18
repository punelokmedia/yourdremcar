import "./globals.css";
import SiteChrome from "../components/SiteChrome";

export const metadata = {
  title: "Car Sells",
  description: "Buy and sell cars",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
