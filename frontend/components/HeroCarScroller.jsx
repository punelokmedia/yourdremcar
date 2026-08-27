"use client";

import Link from "next/link";

function MiniCarCard({ car, detailsUrl, onBuy }) {
  const fuel = car.category || car.fuelType || "Petrol";

  return (
    <article className="flex h-[108px] shrink-0 items-center gap-3 rounded-2xl bg-white p-2.5 shadow-[0_12px_40px_rgba(15,23,42,0.16)] ring-1 ring-black/5">
      <Link
        href={detailsUrl}
        className="relative h-full w-[92px] shrink-0 overflow-hidden rounded-xl bg-slate-100"
      >
        {car.image ? (
          <img src={car.image} alt={car.name} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center px-2 text-center text-[10px] font-medium text-slate-400">
            No photo
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1 py-0.5">
        <Link href={detailsUrl} className="block truncate text-[13px] font-semibold text-blue-800">
          {car.name}
        </Link>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {car.year} · {fuel}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="truncate text-[13px] font-semibold tracking-tight text-slate-900">
            {car.price}
          </p>
          <button
            type="button"
            onClick={() => onBuy(car)}
            className="shrink-0 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-blue-700"
          >
            Buy
          </button>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="flex h-[108px] shrink-0 items-center gap-3 rounded-2xl bg-white/95 p-2.5 shadow-lg">
      <div className="h-full w-[92px] animate-pulse rounded-xl bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function HeroCarScroller({ cars, loading, buildDetailsUrl, onBuy }) {
  const list = Array.isArray(cars) ? cars : [];
  const durationSec = Math.max(list.length * 4, 8);

  return (
    <div className="w-full max-w-none sm:max-w-[360px]">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400">
        Available now
      </p>
      <div className="hero-cards-window relative h-[228px] overflow-hidden">
        {loading && list.length === 0 ? (
          <div className="flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : list.length === 0 ? (
          <div className="flex h-full items-center rounded-2xl bg-white/90 px-4 text-sm text-slate-600 shadow-lg">
            Cars will appear here once inventory is added.
          </div>
        ) : (
          <div
            className="hero-cards-track flex flex-col"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {[...list, ...list].map((car, index) => (
              <div key={`${car._id || car.name}-${index}`} className="mb-3 shrink-0">
                <MiniCarCard
                  car={car}
                  detailsUrl={buildDetailsUrl(car)}
                  onBuy={onBuy}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
