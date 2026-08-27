"use client";

import { useEffect, useMemo, useState } from "react";
import { resolveCarImageUrl } from "../../lib/resolveCarImageUrl";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../../lib/getApiUrl";
import CarSplitRow from "../../components/CarSplitRow";
import PageHero from "../../components/PageHero";

const API_URL = getApiUrl();
const filters = ["All", "Petrol", "CNG"];
const PAGE_SIZE = 4;
const normalizeCar = (car) => ({
  ...car,
  name: car.title || `${car.brand || ""} ${car.model || ""}`.trim() || "Car Listing",
  year: car.year ? String(car.year) : "N/A",
  price: Number.isFinite(Number(car.price))
    ? `Rs ${new Intl.NumberFormat("en-IN").format(Number(car.price))}`
    : "Price on request",
  type: car.fuelType || "Unknown",
  image: resolveCarImageUrl(car.imageUrl || "", API_URL),
  ownership: car.ownership || "Single Owner",
  availability: car.availability || "Available",
});
const buildCarDetailsUrl = (car) => {
  const params = new URLSearchParams({
    id: car._id || "",
    name: car.name,
    year: car.year,
    price: car.price,
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
  const [visibleCarsCount, setVisibleCarsCount] = useState(PAGE_SIZE);
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
        if (!API_URL) {
          if (!cancelled) setLoadError(MISSING_NEXT_PUBLIC_API_URL);
          return;
        }
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
    <main className="bg-[#f4f6f8]">
      <PageHero
        eyebrow="Inventory · Pune"
        title="Browse available cars"
        description="Inspected listings with clear pricing. Filter by fuel type and pick the car that fits your drive."
        stats={["100% inspected", "Transparent prices", "2 months / 5,000 km warranty"]}
        actions={
          <>
            <a
              href="#inventory-list"
              className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              View listings
            </a>
            <a
              href="/contact-us"
              className="rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Talk to us
            </a>
          </>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setActiveFilter(filter);
                  setVisibleCarsCount(PAGE_SIZE);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-slate-500">
            {Math.min(visibleCarsCount, filteredCars.length)} of {filteredCars.length} cars
          </p>
        </div>
      </section>

      <section id="inventory-list" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16">
        {loadingCars ? (
          <p className="mb-5 text-sm font-medium text-slate-600">Loading cars...</p>
        ) : null}
        {loadError ? (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {loadError}
          </p>
        ) : null}
        <div className="flex flex-col gap-5">
          {filteredCars.slice(0, visibleCarsCount).map((car, index) => (
            <CarSplitRow
              key={car._id || `${car.name}-${car.year}`}
              car={car}
              detailsUrl={buildCarDetailsUrl(car)}
              imageOnRight={index % 2 === 1}
              buyHref="/contact-us"
            />
          ))}
        </div>

        {!loadingCars && filteredCars.length === 0 ? (
          <p className="mt-6 text-sm font-medium text-slate-600">
            No cars found for this filter.
          </p>
        ) : null}

        {visibleCarsCount < filteredCars.length ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCarsCount((prev) =>
                  Math.min(prev + PAGE_SIZE, filteredCars.length)
                )
              }
              className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Load more
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
