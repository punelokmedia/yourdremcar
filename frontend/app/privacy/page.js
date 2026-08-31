import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Your Dream Car",
  description:
    "How Your Dream Car collects, uses, and protects your information when you use our mobile app and related services.",
  robots: { index: true, follow: true },
};

const PRIVACY_EMAIL = "yourdreamcars1806@gmail.com";
const LAST_UPDATED = "22 August 2026";

const sections = [
  {
    title: "1. Data we collect",
    items: [
      "Account: name, email, and password (stored as a hash, not plain text).",
      "Listings: car details, photos, city, phone, and the sell price you submit.",
      "Bids: offer amount, name, phone, city, and message.",
      "Device: basic app and login session data so you stay signed in.",
    ],
  },
  {
    title: "2. How we use it",
    paragraphs: [
      "We use this data to run your account, review and publish cars, handle bids, contact you about a listing or offer, send service notices (such as a new car alert if you allow it), and keep the app secure.",
    ],
  },
  {
    title: "3. What is public",
    paragraphs: [
      "Published cars show on the marketplace with photos, specs, and sell price. Buy price and internal admin notes are not shown to users. Your bid amount is visible to admin, not to other buyers.",
    ],
  },
  {
    title: "4. Sharing",
    paragraphs: [
      "We share data with service providers we need to run the app (for example image hosting and email delivery). We do not sell your personal data. We may share information if required by law or to prevent fraud.",
    ],
  },
  {
    title: "5. Storage",
    paragraphs: [
      "Data is stored on our servers and trusted cloud providers. We keep listing and bid records as long as needed to operate the business and meet legal duties, then delete or anonymise them where practical.",
    ],
  },
  {
    title: "6. Your choices",
    paragraphs: [
      "You can update your password in the app Profile. To correct listing details, change an email, or ask us to delete your account, contact us. Some records may be kept where the law requires it.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[60dvh] bg-[#f4f6f8]">
      <div className="border-b border-[#003EA8]/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#003EA8]">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#003EA8] sm:text-4xl">
            Privacy Policy — Your Dream Car
          </h1>
          <p className="mt-3 text-sm text-slate-600">Last updated: {LAST_UPDATED}</p>
          <p className="mt-6 text-base leading-relaxed text-slate-700">
            This policy explains how Your Dream Car (&quot;we&quot;, &quot;us&quot;) collects,
            uses, and protects your information when you use our mobile app and related
            services.
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 sm:p-6"
            >
              <h2 className="text-lg font-semibold text-[#003EA8] sm:text-xl">
                {section.title}
              </h2>
              {section.items ? (
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#003EA8]"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 sm:p-6">
            <h2 className="text-lg font-semibold text-[#003EA8] sm:text-xl">7. Contact</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              Privacy questions:{" "}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="font-medium text-[#003EA8] underline decoration-[#003EA8]/30 underline-offset-2 transition hover:decoration-[#003EA8]"
              >
                {PRIVACY_EMAIL}
              </a>
            </p>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          <Link
            href="/"
            className="font-medium text-[#003EA8] transition hover:underline"
          >
            Back to home
          </Link>
          {" · "}
          <Link
            href="/contact-us"
            className="font-medium text-[#003EA8] transition hover:underline"
          >
            Contact us
          </Link>
        </p>
      </article>
    </main>
  );
}
