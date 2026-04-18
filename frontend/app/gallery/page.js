"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const normalizeCar = (car) => ({
  ...car,
  name: car.title || `${car.brand || ""} ${car.model || ""}`.trim() || "Car Listing",
  year: car.year ? String(car.year) : "N/A",
  price: Number.isFinite(Number(car.price))
    ? `Rs ${new Intl.NumberFormat("en-IN").format(Number(car.price))}`
    : "Price on request",
  image: car.imageUrl || "",
  ownership: car.ownership || "Single Owner",
});
const buildCarDetailsUrl = (car) => {
  const params = new URLSearchParams({
    id: car._id || "",
    name: car.name,
    year: car.year,
    price: car.price,
    image: car.image,
    fuelType: car.fuelType || "",
    ownership: car.ownership || "",
  });
  return `/car-details?${params.toString()}`;
};

export default function GalleryPage() {
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [visibleCarsCount, setVisibleCarsCount] = useState(9);
  const galleryCars = useMemo(() => cars.map(normalizeCar), [cars]);

  useEffect(() => {
    let cancelled = false;

    const fetchCars = async ({ showLoading = true } = {}) => {
      if (showLoading) setLoadingCars(true);
      setLoadError("");
      try {
        const response = await fetch(`${API_URL}/cars`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load gallery cars");
        }
        if (!cancelled) setCars(data.data || []);
      } catch (error) {
        if (!cancelled) setLoadError(error.message || "Failed to load gallery cars");
      } finally {
        if (!cancelled && showLoading) setLoadingCars(false);
      }
    };

    fetchCars({ showLoading: true });
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchCars({ showLoading: false });
    };
    document.addEventListener("visibilitychange", onVisibility);
    const onInventoryChanged = () => fetchCars({ showLoading: false });
    window.addEventListener("cars-inventory-changed", onInventoryChanged);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cars-inventory-changed", onInventoryChanged);
    };
  }, []);

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Gallery
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
          Explore Premium Car Collection
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Discover curated used cars with premium design, clear pricing, and
          smooth browsing experience.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        {loadingCars ? (
          <p className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            Loading cars from backend...
          </p>
        ) : null}
        {loadError ? (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {loadError}
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {galleryCars.slice(0, visibleCarsCount).map((car) => (
            <motion.article
              key={car._id || `${car.name}-${car.year}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-300/30"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.22 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-200">
                    <p className="text-xs font-semibold text-slate-600">No image from backend</p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute left-3 top-3 rounded-full border border-white/35 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-800">
                  {car.fuelType || "Featured"}
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs font-medium tracking-wide text-slate-100/90">{car.year}</p>
                  <p className="mt-0.5 text-base font-semibold">{car.price}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
                    {car.name}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                    {car.year}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-slate-800">{car.price}</p>
                <a
                  href={buildCarDetailsUrl(car)}
                  className="mt-3 inline-flex rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  View Details
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {!loadingCars && galleryCars.length === 0 ? (
          <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            No cars found in gallery yet.
          </p>
        ) : null}

        {visibleCarsCount < galleryCars.length ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCarsCount((prev) => Math.min(prev + 3, galleryCars.length))
              }
              className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Load More
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
