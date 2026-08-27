"use client";

import Link from "next/link";

function AvailabilityBadge({ availability }) {
  const status = availability || "Available";

  if (status === "Sold out") {
    return (
      <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
        Sold out
      </span>
    );
  }

  if (status === "Sold") {
    return (
      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
        Sold
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Available
    </span>
  );
}

export default function CarSplitRow({
  car,
  detailsUrl,
  onBuy,
  buyHref,
  onBookTestDrive,
  contactHref,
  imageOnRight = false,
}) {
  const fuel = car.category || car.fuelType || car.type || "Petrol";
  const year = car.year || "N/A";
  const ownership = car.ownership || "Single Owner";
  const name = car.name || "Car Listing";
  const price = car.price || "Price on request";

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80 md:flex-row ${
        imageOnRight ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:min-h-[280px] md:w-1/2">
        {car.image ? (
          <img src={car.image} alt={name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100">
            <p className="text-xs font-medium text-slate-500">Photo coming soon</p>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-800">
            {fuel}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-4 py-5 sm:px-7 md:w-1/2 md:px-8 md:py-8">
        <div className="flex flex-wrap items-center gap-2">
          <AvailabilityBadge availability={car.availability} />
          <span className="text-[12px] text-slate-500">
            {year} · {fuel} · {ownership}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-blue-800 sm:text-2xl">
          {name}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Inspected listing with clear pricing. Warranty support available after purchase.
        </p>
        <p className="mt-4 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {price}
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {onBuy ? (
            <button
              type="button"
              onClick={onBuy}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Buy car
            </button>
          ) : buyHref ? (
            <Link
              href={buyHref}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Buy car
            </Link>
          ) : null}
          <Link
            href={detailsUrl}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 sm:w-auto"
          >
            View details
          </Link>
          {onBookTestDrive ? (
            <button
              type="button"
              onClick={onBookTestDrive}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 sm:w-auto"
            >
              Test drive
            </button>
          ) : null}
          {contactHref ? (
            <Link
              href={contactHref}
              className="inline-flex min-h-10 w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 sm:w-auto"
            >
              Contact
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
