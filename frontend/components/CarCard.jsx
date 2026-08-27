"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function AvailabilityBadge({ availability }) {
  const status = availability || "Available";

  if (status === "Sold out") {
    return (
      <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
        Sold out
      </span>
    );
  }

  if (status === "Sold") {
    return (
      <span className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
        Sold
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800 shadow-sm backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Available
    </span>
  );
}

export default function CarCard({
  car,
  detailsUrl,
  onBookTestDrive,
  onBuy,
  contactHref,
}) {
  const fuel = car.category || car.fuelType || car.type || "Petrol";
  const year = car.year || "N/A";
  const ownership = car.ownership || "Single Owner";
  const name = car.name || "Car Listing";
  const price = car.price || "Price on request";

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 transition duration-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] hover:ring-slate-300/90"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
    >
      <div className="relative overflow-hidden">
        {car.image ? (
          <img
            src={car.image}
            alt={name}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.05] sm:h-56"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-slate-100 sm:h-56">
            <p className="text-xs font-medium text-slate-500">Photo coming soon</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-800 backdrop-blur-sm">
            {fuel}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <AvailabilityBadge availability={car.availability} />
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/70">
            Starting at
          </p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-white">{price}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-4 sm:px-5">
        <h3 className="text-[1.05rem] font-semibold leading-snug tracking-tight text-blue-800">
          {name}
        </h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-500">
          <span>{year}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{fuel}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{ownership}</span>
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          {onBuy ? (
            <button
              type="button"
              onClick={onBuy}
              className="inline-flex min-h-9 flex-1 items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              Buy car
            </button>
          ) : null}
          <Link
            href={detailsUrl}
            className={`inline-flex min-h-9 items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition ${
              onBuy
                ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                : "flex-1 bg-slate-900 text-white hover:bg-black"
            }`}
          >
            View details
          </Link>
          {onBookTestDrive ? (
            <button
              type="button"
              onClick={onBookTestDrive}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Test drive
            </button>
          ) : null}
          {contactHref ? (
            <Link
              href={contactHref}
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Contact
            </Link>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
