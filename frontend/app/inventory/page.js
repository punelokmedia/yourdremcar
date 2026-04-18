"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const filters = ["All", "Petrol", "CNG"];
const normalizeCar = (car) => ({
  ...car,
  name: car.title || `${car.brand || ""} ${car.model || ""}`.trim() || "Car Listing",
  year: car.year ? String(car.year) : "N/A",
  price: Number.isFinite(Number(car.price))
    ? `Rs ${new Intl.NumberFormat("en-IN").format(Number(car.price))}`
    : "Price on request",
  type: car.fuelType || "Unknown",
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
    fuelType: car.type || "",
    ownership: car.ownership || "",
  });
  return `/car-details?${params.toString()}`;
};

export default function InventoryPage() {
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCarsCount, setVisibleCarsCount] = useState(9);
  const inventoryCars = useMemo(() => cars.map(normalizeCar), [cars]);

  const filteredCars = useMemo(() => {
    if (activeFilter === "All") return inventoryCars;
    return inventoryCars.filter((car) => car.type === activeFilter);
  }, [activeFilter, inventoryCars]);

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
          throw new Error(data.message || "Failed to load inventory");
        }
        if (!cancelled) setCars(data.data || []);
      } catch (error) {
        if (!cancelled) setLoadError(error.message || "Failed to load inventory");
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
    <main className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-100 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Inventory
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Browse Our Premium Inventory
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Explore handpicked used cars by category and discover the right fit for
            your budget and lifestyle.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setActiveFilter(filter);
                setVisibleCarsCount(9);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeFilter === filter
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.slice(0, visibleCarsCount).map((car) => (
            <motion.article
              key={car._id || `${car.name}-${car.year}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-300/30"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-52 w-full items-center justify-center bg-slate-200">
                    <p className="text-xs font-semibold text-slate-600">No image from backend</p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-white/35 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-800">
                  {car.type}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{car.name}</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {car.year}
                  </span>
                </div>
                <p className="text-sm text-slate-600">Verified listing</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{car.price}</p>
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={buildCarDetailsUrl(car)}
                    className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
                  >
                    View Details
                  </a>
                  <a
                    href="/contact-us"
                    className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {!loadingCars && filteredCars.length === 0 ? (
          <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            No cars found for this filter.
          </p>
        ) : null}

        {visibleCarsCount < filteredCars.length ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCarsCount((prev) => Math.min(prev + 3, filteredCars.length))
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
