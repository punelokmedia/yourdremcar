import Link from "next/link";

export const metadata = {
  title: "Delete Account — Your Dream Car",
  description:
    "How to delete your Your Dream Car account and what happens to your data when you use our mobile app.",
  robots: { index: true, follow: true },
};

const SUPPORT_EMAIL = "yourdreamcars1806@gmail.com";
const LAST_UPDATED = "22 August 2026";

const sections = [
  {
    title: "1. Who can request deletion",
    paragraphs: [
      'If you created an account in the Your Dream Car mobile app, you can delete it using the options below.',
    ],
  },
  {
    title: "2. Delete in the app",
    paragraphs: [
      "Open the app → Profile → Delete account (or Account settings → Delete account). Follow the prompts. You may need to sign in again to confirm.",
    ],
  },
  {
    title: "3. Delete by email",
    paragraphs: [
      "If you cannot use the app, email us from the address linked to your account:",
    ],
    emailRequest: {
      to: SUPPORT_EMAIL,
      subject: "Delete my account",
      body: "Please delete my Your Dream Car account.\n\nAccount email: [your email]\n",
      instructions:
        "Include the email on your account and a short note that you want deletion.",
    },
  },
  {
    title: "4. What we delete",
    intro: "When your account is deleted, we remove or disable:",
    items: [
      "Your login account (name, email, password hash)",
      "Your app profile and session data",
      "Active listings you submitted (removed from the marketplace)",
      "Bid messages tied to your account where we can identify you",
    ],
  },
  {
    title: "5. What we may keep",
    paragraphs: [
      "We may keep some records where required by law, to resolve disputes, prevent fraud, or meet tax and business rules. For example: transaction logs, admin notes on completed deals, or backups for a limited time before they are erased or anonymised.",
    ],
  },
  {
    title: "6. How long it takes",
    paragraphs: [
      "In-app deletion is processed as soon as possible, usually within a few days. Email requests are handled within 30 days. We will confirm by email when deletion is complete.",
    ],
  },
];

export default function DeleteAccountPage() {
  const mailtoDelete = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Delete my account")}&body=${encodeURIComponent("Please delete my Your Dream Car account.\n\nAccount email: \n")}`;

  return (
    <main className="min-h-[60dvh] bg-[#f4f6f8]">
      <div className="border-b border-[#003EA8]/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#003EA8]">
            Legal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#003EA8] sm:text-4xl">
            Delete Account — Your Dream Car
          </h1>
          <p className="mt-3 text-sm text-slate-600">Last updated: {LAST_UPDATED}</p>
          <p className="mt-6 text-base leading-relaxed text-slate-700">
            This page explains how to delete your Your Dream Car account and what happens
            to your data when you use our mobile app and related services.
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
              {section.intro ? (
                <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                  {section.intro}
                </p>
              ) : null}
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
              {section.emailRequest ? (
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    <a
                      href={mailtoDelete}
                      className="font-medium text-[#003EA8] underline decoration-[#003EA8]/30 underline-offset-2 transition hover:decoration-[#003EA8]"
                    >
                      {section.emailRequest.to}
                    </a>
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Subject:</span>{" "}
                    {section.emailRequest.subject}
                  </p>
                  <p>{section.emailRequest.instructions}</p>
                </div>
              ) : null}
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
            </section>
          ))}

          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80 sm:p-6">
            <h2 className="text-lg font-semibold text-[#003EA8] sm:text-xl">7. Contact</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              Account deletion questions:{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-[#003EA8] underline decoration-[#003EA8]/30 underline-offset-2 transition hover:decoration-[#003EA8]"
              >
                {SUPPORT_EMAIL}
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
            href="/privacy"
            className="font-medium text-[#003EA8] transition hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      </article>
    </main>
  );
}
