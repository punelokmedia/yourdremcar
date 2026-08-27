"use client";

import { useEffect, useMemo, useState } from "react";
import { resolveCarImageUrl } from "../../lib/resolveCarImageUrl";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../../lib/getApiUrl";
import PageHero from "../../components/PageHero";

const API_URL = getApiUrl();
const normalizeCar = (car) => ({
  ...car,
  name: car.title || `${car.brand || ""} ${car.model || ""}`.trim() || "Car Listing",
  year: car.year ? String(car.year) : "N/A",
  price: Number.isFinite(Number(car.price))
    ? `Rs ${new Intl.NumberFormat("en-IN").format(Number(car.price))}`
    : "Price on request",
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
    <main className="bg-[#f4f6f8]">
      <PageHero
        eyebrow="Gallery · Pune"
        title="Explore the collection"
        description="A photo-first look at our inspected stock — tap any car for full details and pricing."
        imageSrc="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
        stats={["Clear photos", "Transparent prices", "Verified listings"]}
        actions={
          <a
            href="/inventory"
            className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Browse inventory
          </a>
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-8 md:py-16">
        {loadingCars ? (
          <p className="mb-5 text-sm font-medium text-slate-600">Loading cars...</p>
        ) : null}
        {loadError ? (
          <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {loadError}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryCars.slice(0, visibleCarsCount).map((car) => (
            <a
              key={car._id || `${car.name}-${car.year}`}
              href={buildCarDetailsUrl(car)}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200"
            >
              {car.image ? (
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-medium text-slate-500">
                  Photo coming soon
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-semibold text-blue-100">{car.name}</p>
                <p className="mt-0.5 text-xs text-white/70">
                  {car.year} · {car.fuelType || "Petrol"}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{car.price}</p>
              </div>
            </a>
          ))}
        </div>

        {!loadingCars && galleryCars.length === 0 ? (
          <p className="mt-6 text-sm font-medium text-slate-600">
            No cars found in gallery yet.
          </p>
        ) : null}

        {visibleCarsCount < galleryCars.length ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCarsCount((prev) => Math.min(prev + 6, galleryCars.length))
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
