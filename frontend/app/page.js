"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { resolveCarImageUrl } from "../lib/resolveCarImageUrl";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../lib/getApiUrl";

const API_URL = getApiUrl();
const galleryFilters = ["All", "Petrol", "CNG"];
const formatPrice = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "Price on request";
  return `Rs ${new Intl.NumberFormat("en-IN").format(num)}`;
};
const normalizeCar = (car) => ({
  ...car,
  name: car.title || `${car.brand || ""} ${car.model || ""}`.trim() || "Car Listing",
  year: car.year ? String(car.year) : "N/A",
  price: formatPrice(car.price),
  image: resolveCarImageUrl(car.imageUrl || "", API_URL),
  category: car.fuelType || "Unknown",
  ownership: car.ownership || "Single Owner",
});
const highlights = [
  { title: "Verified Cars", value: "1200+" },
  { title: "Happy Buyers", value: "8.5K+" },
  { title: "Cities Covered", value: "45+" },
];
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};
const buildCarDetailsUrl = (car) => {
  const params = new URLSearchParams({
    id: car._id || "",
    name: car.name,
    year: car.year,
    price: car.price,
    fuelType: car.category || "",
    ownership: car.ownership || "",
    note: "Premium maintained condition with complete inspection support.",
  });
  return `/car-details?${params.toString()}`;
};

const CONTACT_PHONE_DISPLAY = "+91 87664 03074";
const CONTACT_PHONE_E164 = "918766403074";
const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_E164}?text=${encodeURIComponent(
  "Hi, I would like to know more about Your Dreams Cars."
)}`;
const TEL_HREF = `tel:+${CONTACT_PHONE_E164}`;

function WhatsAppGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

function PhoneGlyph({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.608-1.288.608-.407 0-.815-.112-1.173-.327l-3.5-2.25a2.25 2.25 0 01-.327-1.173V9.75c0-.519.232-1.006.608-1.288l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [carsError, setCarsError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visibleCarsCount, setVisibleCarsCount] = useState(9);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState("All");
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carName: "",
  });
  const normalizedCars = useMemo(() => cars.map(normalizeCar), [cars]);
  const activeCar = normalizedCars[activeIndex] || normalizeCar({});
  const galleryCars = normalizedCars;
  const aboutPreviewCars =
    normalizedCars.length >= 3
      ? [normalizedCars[0], normalizedCars[1], normalizedCars[2]]
      : [activeCar, activeCar, activeCar];
  const filteredGalleryCars = useMemo(() => {
    if (activeGalleryFilter === "All") return galleryCars;
    return galleryCars.filter((car) => car.category === activeGalleryFilter);
  }, [activeGalleryFilter, galleryCars]);

  useEffect(() => {
    let cancelled = false;

    const fetchCars = async ({ showLoading = true } = {}) => {
      if (showLoading) setCarsLoading(true);
      setCarsError("");
      try {
        if (!API_URL) {
          if (!cancelled) setCarsError(MISSING_NEXT_PUBLIC_API_URL);
          return;
        }
        const response = await fetch(`${API_URL}/cars`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load cars");
        }
        if (!cancelled) setCars(data.data || []);
      } catch (error) {
        if (!cancelled) setCarsError(error.message || "Failed to load cars");
      } finally {
        if (!cancelled && showLoading) setCarsLoading(false);
      }
    };

    fetchCars({ showLoading: true });

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCars({ showLoading: false });
      }
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

  useEffect(() => {
    if (normalizedCars.length <= 1) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % normalizedCars.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [normalizedCars.length]);

  useEffect(() => {
    if (!activeCar.name) return;
    setFormData((prev) => ({ ...prev, carName: activeCar.name }));
  }, [activeCar.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage("");

    try {
      if (!API_URL) {
        setStatusMessage(MISSING_NEXT_PUBLIC_API_URL);
        return;
      }
      const res = await fetch(`${API_URL}/buy-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setStatusMessage("Request submitted successfully. Our team will contact you soon.");
      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
      }));
      setIsFormOpen(false);
    } catch (error) {
      setStatusMessage(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="w-full">
      <section className="relative w-full min-h-[max(88vh,600px)] overflow-x-hidden">
        {activeCar.image ? (
          <img
            src={activeCar.image}
            alt={activeCar.name}
            className="absolute inset-0 h-full min-h-full w-full object-cover object-center transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex min-h-full items-center justify-center bg-slate-300">
            <p className="text-sm font-semibold text-slate-700">No image from backend</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-slate-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
        <div className="pointer-events-none absolute -left-16 top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-[1] mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 pb-28 pt-20 sm:pt-24 md:pb-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-2xl text-white"
          >
            <p className="inline-block border-b border-white/40 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-xs">
              Featured Hero Car
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {activeCar.name}
            </h1>
            <p className="mt-2.5 text-sm text-white/90 md:text-base">
              {activeCar.year} Model - Premium condition with smooth performance.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-2xl font-semibold md:text-3xl">{activeCar.price}</p>
              <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90 sm:px-3 sm:py-1 sm:text-xs">
                Best Deal
              </span>
            </div>
            <div className="mt-4 max-w-xl rounded-2xl border border-white/30 bg-white/15 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3">
              <p className="text-xs font-extrabold leading-relaxed text-white sm:text-sm md:text-[0.95rem]">
                We have all inspected cars with{" "}
                <span className="text-cyan-200">2 Months or 5000 KM</span> Engine
                Warranty (T&amp;C apply). We have tied up with{" "}
                <span className="text-cyan-200">Cars24</span> and{" "}
                <span className="text-cyan-200">Spinny</span>.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsFormOpen(true)}
                className="rounded-full bg-white px-6 py-2 text-xs font-semibold text-slate-900 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-slate-100 sm:px-7 sm:py-2.5 sm:text-sm"
              >
                Request for Buy
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-emerald-500/95 text-white shadow-lg shadow-emerald-950/30 ring-1 ring-white/25 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppGlyph className="h-6 w-6 shrink-0" />
              </a>
              <a
                href={TEL_HREF}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/25"
                aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
              >
                <PhoneGlyph className="h-6 w-6 shrink-0" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden rounded-3xl border border-white/25 bg-white/10 p-4 text-white backdrop-blur-md lg:block lg:p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Why Choose Us
            </p>
            <h3 className="mt-1.5 text-xl font-bold leading-snug">Clear. Trusted. Fast Response.</h3>
            <div className="mt-4 grid gap-2.5">
              {[
                { title: "Inspected Cars", value: "100% Verified" },
                { title: "Warranty Support", value: "2 Months / 5000 KM" },
                { title: "Trusted Partners", value: "Cars24 + Spinny" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/20 bg-black/20 px-3 py-2.5 lg:px-4 lg:py-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/75 sm:text-xs">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-white sm:text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2"
        >
          {normalizedCars.map((car, index) => (
            <button
              key={car._id || `${car.name}-${index}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${car.name}`}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-10 bg-white" : "w-4 bg-white/45"
              }`}
            />
          ))}
        </motion.div>
      </section>

      {carsLoading ? (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
            Loading real cars from backend...
          </p>
        </section>
      ) : null}
      {carsError ? (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {carsError}
          </p>
        </section>
      ) : null}

      <motion.section
        {...fadeUp}
        id="about-us"
        className="mx-auto max-w-6xl px-4 py-16"
      >
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-200/60 md:p-10">
          <div className="pointer-events-none absolute -left-16 -top-14 h-44 w-44 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-cyan-100/70 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                About Us
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Trusted Platform For Premium Used Cars
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Your Dreams Cars helps buyers find premium used cars with verified
                details and transparent pricing. We focus on trust, quality, and a
                smooth buying experience.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Verified listing details and transparent pricing policy",
                  "Fast response from experts for each buy request",
                  "Support available from shortlisting to final decision",
                  "Trusted tie-up support with Cars24 and Spinny",
                ].map((point) => (
                  <div
                    key={point}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Inspection", value: "100% Quality Check" },
                  { label: "Warranty", value: "2 Months / 5000 KM" },
                  { label: "Support", value: "Quick Callback" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3 shadow-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {highlights.map((item) => (
                  <motion.div
                    key={item.title}
                    className="rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 p-3 text-center shadow-sm transition hover:border-slate-300 hover:shadow-md"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xl font-bold text-slate-900">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-600">{item.title}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="/about-us"
                  className="inline-flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  Explore Full About Us
                </a>
                <a
                  href="/contact-us"
                  className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Talk to Expert
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 overflow-hidden rounded-2xl border border-slate-200">
                {aboutPreviewCars[0].image ? (
                  <img
                    src={aboutPreviewCars[0].image}
                    alt={aboutPreviewCars[0].name}
                    className="h-52 w-full object-cover md:h-64"
                  />
                ) : (
                  <div className="flex h-52 w-full items-center justify-center bg-slate-200 md:h-64">
                    <p className="text-xs font-semibold text-slate-600">No backend image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  Verified & Premium Stock
                </p>
              </div>
              {aboutPreviewCars[1].image ? (
                <img
                  src={aboutPreviewCars[1].image}
                  alt={aboutPreviewCars[1].name}
                  className="h-28 w-full rounded-2xl object-cover md:h-36"
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-slate-200 md:h-36">
                  <p className="text-xs font-semibold text-slate-600">No backend image</p>
                </div>
              )}
              {aboutPreviewCars[2].image ? (
                <img
                  src={aboutPreviewCars[2].image}
                  alt={aboutPreviewCars[2].name}
                  className="h-28 w-full rounded-2xl object-cover md:h-36"
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-slate-200 md:h-36">
                  <p className="text-xs font-semibold text-slate-600">No backend image</p>
                </div>
              )}
              <div className="col-span-2 rounded-2xl border border-slate-200/90 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
                      Customer Rating
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">4.9/5</p>
                    <p className="text-xs text-slate-600">
                      From thousands of happy buyers
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-center shadow-sm">
                    <p className="text-xs font-semibold text-slate-600">On-Time Support</p>
                    <p className="text-lg font-bold text-slate-900">98%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        {...fadeUp}
        id="gallery"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-16"
      >
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/70 p-5 shadow-lg shadow-slate-200/60 md:p-7">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Gallery
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Explore Featured Collection
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Handpicked premium cars with transparent pricing and verified details.
              </p>
            </div>
            <a
              href="/gallery"
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
            >
              View Full Gallery
            </a>
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {galleryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setActiveGalleryFilter(filter);
                    setVisibleCarsCount(9);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    activeGalleryFilter === filter
                      ? "border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/70"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Showing {Math.min(visibleCarsCount, filteredGalleryCars.length)} of{" "}
              {filteredGalleryCars.length} cars
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGalleryCars.slice(0, visibleCarsCount).map((car) => (
            <motion.article
              key={car._id || `${car.name}-${car.year}`}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-2xl hover:shadow-slate-300/30"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <div className="relative">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-slate-200">
                    <p className="text-xs font-semibold text-slate-600">No image from backend</p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-800">
                  {car.category || "Featured"}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.1em] text-white/80">
                      Ready To Drive
                    </p>
                    <p className="text-xl font-bold text-white">{car.price}</p>
                  </div>
                  <span className="rounded-full border border-white/30 bg-black/30 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {car.year}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-tight text-slate-900">
                    {car.name}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                    {car.year}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Verified profile with transparent pricing and quick support.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={buildCarDetailsUrl(car)}
                    className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
                  >
                    View Details
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, carName: car.name }));
                      setIsFormOpen(true);
                    }}
                    className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Request Buy
                  </button>
                  <span className="ml-auto rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                    Verified
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
          </div>

          {filteredGalleryCars.length > 9 ? (
            <div className="mt-8 flex justify-center gap-3">
              {visibleCarsCount < filteredGalleryCars.length ? (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCarsCount((prev) =>
                      Math.min(prev + 3, filteredGalleryCars.length)
                    )
                  }
                  className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Load More
                </button>
              ) : null}
              {visibleCarsCount > 9 ? (
                <button
                  type="button"
                  onClick={() => setVisibleCarsCount(9)}
                  className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Show Less
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-8 text-white transition md:px-10">
          <h3 className="text-2xl font-bold md:text-3xl">
            Ready To Buy Your Dream Car?
          </h3>
          <p className="mt-2 max-w-2xl text-slate-200">
            Select your favorite car from the hero and submit a request. Our team
            will contact you with full details and best price options.
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Request for Buy
          </button>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-10">
        {statusMessage ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {statusMessage}
          </p>
        ) : null}
      </motion.section>

      <AnimatePresence>
        {isFormOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <button
              type="button"
              aria-label="Close form backdrop"
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Request for Buy
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Fill your details and we will contact you shortly.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </button>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Car Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="carName"
                    value={formData.carName}
                    onChange={handleChange}
                    placeholder="Selected car name"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 transition focus:border-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 transition focus:border-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 transition focus:border-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 transition focus:border-slate-500"
                    required
                  />
                </div>

                <div className="mt-1 md:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.45, ease: "easeOut" }}
        className={`fixed bottom-6 right-4 z-40 flex flex-col gap-3 md:bottom-8 md:right-6 ${
          isFormOpen ? "hidden" : ""
        }`}
        aria-hidden={isFormOpen}
      >
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-900/35 ring-2 ring-white/40 transition hover:scale-105 hover:bg-[#20bd5a] hover:shadow-2xl"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppGlyph className="h-7 w-7" />
        </a>
        <a
          href={TEL_HREF}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-cyan-200 shadow-xl shadow-slate-900/40 ring-2 ring-white/30 transition hover:scale-105 hover:from-slate-800 hover:to-slate-700 hover:shadow-2xl"
          aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
        >
          <PhoneGlyph className="h-6 w-6" />
        </a>
      </motion.div>
    </main>
  );
}
