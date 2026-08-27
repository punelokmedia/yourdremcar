"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../../lib/getApiUrl";
import PageHero from "../../components/PageHero";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

export default function HappyClientsPage() {
  const apiUrl = getApiUrl();
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    if (!apiUrl) {
      setError(MISSING_NEXT_PUBLIC_API_URL);
      setLoading(false);
      setReviewsLoading(false);
      return;
    }

    setError("");
    setLoading(true);
    setReviewsLoading(true);

    const fetchOpts = {
      cache: "no-store",
      headers: { Accept: "application/json" },
    };

    try {
      const [hcRes, revRes] = await Promise.all([
        fetch(`${apiUrl}/happy-clients`, fetchOpts),
        fetch(`${apiUrl}/reviews`, fetchOpts),
      ]);
      const hcData = await hcRes.json();
      const revData = await revRes.json();

      if (!hcRes.ok) {
        throw new Error(hcData.message || "Could not load happy customers");
      }
      setClients(hcData.data || []);
      if (revRes.ok) {
        setReviews(revData.data || []);
      } else {
        setReviews([]);
      }
    } catch (e) {
      setError(e.message || "Could not load happy customers");
      setClients([]);
      setReviews([]);
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const onHc = () => loadData();
    const onRev = () => loadData();
    window.addEventListener("happy-clients-changed", onHc);
    window.addEventListener("reviews-changed", onRev);
    return () => {
      window.removeEventListener("happy-clients-changed", onHc);
      window.removeEventListener("reviews-changed", onRev);
    };
  }, [loadData]);

  return (
    <main className="bg-[#f4f6f8]">
      <PageHero
        eyebrow="Happy customers · Pune"
        title="Stories from people who bought with us"
        description="Real faces from our showroom and honest reviews from buyers who completed their journey with Your Dream Cars."
        imageSrc="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1800&q=80"
        stats={["Trusted deliveries", "Personal support", "4.9/5 buyer rating"]}
        actions={
          <a
            href="/inventory"
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Browse cars
          </a>
        }
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12 md:py-16">
        {error ? (
          <p className="mb-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <motion.section {...fadeUp} aria-labelledby="happy-customers-heading">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Photos
          </p>
          <h2
            id="happy-customers-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl"
          >
            Happy customers
          </h2>

          {loading ? (
            <p className="py-8 text-sm text-slate-500">Loading…</p>
          ) : !error && clients.length === 0 ? (
            <p className="py-8 text-sm text-slate-500">No customer photos yet.</p>
          ) : (
            <div className="mt-8 flex flex-col gap-5">
              {clients.map((c, index) => (
                <article
                  key={c._id}
                  className={`overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 md:flex ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex w-full items-center justify-center bg-slate-100 px-2 py-2 md:w-[46%] md:px-3 md:py-3">
                    {c.imagePath ? (
                      <img
                        src={c.imagePath}
                        alt={c.name ? `${c.name} — happy customer` : "Happy customer"}
                        className="mx-auto h-auto max-h-[min(72vh,640px)] w-auto max-w-full object-contain"
                      />
                    ) : (
                      <p className="py-16 text-sm text-slate-500">Photo coming soon</p>
                    )}
                  </div>
                  <div className="flex w-full flex-col justify-center px-4 py-5 sm:px-6 md:w-[54%] md:px-8 md:py-8">
                    <p className="text-xl font-semibold tracking-tight text-blue-800 sm:text-2xl">
                      {c.name}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                      {c.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          {...fadeUp}
          className="mt-16"
          aria-labelledby="reviews-heading"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Reviews
          </p>
          <h2
            id="reviews-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl"
          >
            Customer reviews
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Star ratings and comments from people who bought with us.
          </p>

          {reviewsLoading && !error ? (
            <p className="py-6 text-sm text-slate-500">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">No reviews yet.</p>
          ) : (
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <li key={r._id} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-blue-800">{r.name}</span>
                    <span
                      className="text-amber-500"
                      aria-label={`${r.rating} out of 5 stars`}
                    >
                      {"★".repeat(r.rating)}
                      <span className="text-slate-300">
                        {"★".repeat(Math.max(0, 5 - r.rating))}
                      </span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{r.comment}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </main>
  );
}
