"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../../lib/getApiUrl";

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

    try {
      const hcRes = await fetch(`${apiUrl}/happy-clients`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const hcData = await hcRes.json();
      if (!hcRes.ok) {
        throw new Error(hcData.message || "Could not load happy customers");
      }
      setClients(hcData.data || []);
    } catch (e) {
      setError(e.message || "Could not load happy customers");
      setClients([]);
    } finally {
      setLoading(false);
    }

    try {
      const revRes = await fetch(`${apiUrl}/reviews`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const revData = await revRes.json();
      if (revRes.ok) {
        setReviews(revData.data || []);
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    } finally {
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
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 md:pt-14 lg:px-8">
      <motion.header {...fadeUp} className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Your Dream Cars
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Happy customers & reviews
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
          Faces from our showroom and honest feedback from buyers — two different ways we
          share trust.
        </p>
      </motion.header>

      {error ? (
        <p className="mb-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      {/* Happy customers — simple rows, no card boxes */}
      <motion.section {...fadeUp} aria-labelledby="happy-customers-heading">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
          <h2
            id="happy-customers-heading"
            className="text-lg font-semibold text-slate-900 sm:text-xl"
          >
            Happy customers
          </h2>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Photos
          </span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
        ) : !error && clients.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No customer photos yet.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {clients.map((c) => (
              <li key={c._id} className="flex min-w-0 flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 shadow-md ring-1 ring-slate-200/80">
                  <Image
                    src={c.imagePath}
                    alt={c.name ? `${c.name} — happy customer` : ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-center p-2 sm:p-3"
                  />
                </div>
                <div className="mt-4 min-w-0 text-left">
                  <p className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                    {c.name}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {c.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      {/* Reviews — separate look (quotes + stars), not photo cards */}
      <motion.section
        {...fadeUp}
        className="mt-16 border-t border-slate-200 pt-16"
        aria-labelledby="reviews-heading"
      >
        <div className="mb-8">
          <h2
            id="reviews-heading"
            className="text-lg font-semibold text-slate-900 sm:text-xl"
          >
            Customer reviews
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Star ratings and comments from people who bought with us.
          </p>
        </div>

        {reviewsLoading && !error ? (
          <p className="py-6 text-center text-sm text-slate-500">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No reviews yet.
          </p>
        ) : (
          <ul className="space-y-5">
            {reviews.map((r) => (
              <li
                key={r._id}
                className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50/80 to-white px-4 py-4 sm:px-5 sm:py-5"
              >
                <div className="flex flex-wrap items-center gap-2 gap-y-1">
                  <span className="font-medium text-slate-900">{r.name}</span>
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
    </main>
  );
}
