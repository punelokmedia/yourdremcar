"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { resolveCarImageUrl } from "../lib/resolveCarImageUrl";
import { apiUrl, getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../lib/getApiUrl";
import {
  CONTACT_PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_URL,
} from "../lib/contactInfo";
import CarSplitRow from "../components/CarSplitRow";
import HeroCarScroller from "../components/HeroCarScroller";

const HERO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/7154208/7154208-hd_1920_1080_25fps.mp4";

const galleryFilters = ["All", "Petrol", "CNG"];
const GALLERY_PAGE_SIZE = 4;
const formatPrice = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "Price on request";
  return `Rs ${new Intl.NumberFormat("en-IN").format(num)}`;
};
const normalizeCar = (car, apiBase) => ({
  ...car,
  name: car.title || `${car.brand || ""} ${car.model || ""}`.trim() || "Car Listing",
  year: car.year ? String(car.year) : "N/A",
  price: formatPrice(car.price),
  image: resolveCarImageUrl(car.imageUrl || "", apiBase),
  category: car.fuelType || "Unknown",
  ownership: car.ownership || "Single Owner",
  availability: car.availability || "Available",
});
const highlights = [
  { title: "Verified Cars", value: "1200+" },
  { title: "Happy Buyers", value: "8.5K+" },
  { title: "Cities Covered", value: "45+" },
];
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12, margin: "0px 0px -5% 0px" },
  transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] },
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

function StarRatingInput({ value, onChange, variant = "dark" }) {
  const active = variant === "light" ? "text-amber-500" : "text-amber-400";
  const idle = variant === "light" ? "text-slate-300" : "text-slate-500";
  const hint = variant === "light" ? "text-slate-500" : "text-slate-400";
  const ring = variant === "light" ? "focus:ring-amber-500/50" : "focus:ring-amber-400/60";
  return (
    <div className="flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`rounded-md px-0.5 text-2xl leading-none transition hover:scale-110 focus:outline-none focus:ring-2 ${ring} ${
            n <= value ? active : idle
          }`}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={n <= value}
        >
          ★
        </button>
      ))}
      <span className={`ml-1 text-xs ${hint}`}>
        {value > 0 ? `${value}/5` : "Tap stars"}
      </span>
    </div>
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
  const [visibleCarsCount, setVisibleCarsCount] = useState(GALLERY_PAGE_SIZE);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState("All");
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    carName: "",
  });
  const [leadTab, setLeadTab] = useState("buy");
  const [buyLead, setBuyLead] = useState({
    name: "",
    email: "",
    phone: "",
    carName: "",
  });
  const [sellLead, setSellLead] = useState({
    name: "",
    email: "",
    phone: "",
    carMakeModel: "",
    year: "",
    expectedPrice: "",
    notes: "",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadMessage, setLeadMessage] = useState("");
  const [leadError, setLeadError] = useState("");
  const buyCarHintAppliedRef = useRef(false);
  const [reviews, setReviews] = useState([]);
  const [happyClients, setHappyClients] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 0,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const normalizedCars = useMemo(() => {
    const apiBase = getApiUrl();
    return cars.map((car) => normalizeCar(car, apiBase));
  }, [cars]);
  const featuredCars = useMemo(
    () => normalizedCars.slice(0, 8),
    [normalizedCars]
  );
  const heroScrollCars = useMemo(() => {
    const available = normalizedCars.filter(
      (car) => car.availability !== "Sold" && car.availability !== "Sold out"
    );
    const source = available.length ? available : normalizedCars;
    return source.slice(0, 12);
  }, [normalizedCars]);
  const activeCar =
    featuredCars[activeIndex] || normalizeCar({}, getApiUrl());
  const galleryCars = normalizedCars;
  const aboutPreviewCars =
    normalizedCars.length >= 3
      ? [normalizedCars[0], normalizedCars[1], normalizedCars[2]]
      : [activeCar, activeCar, activeCar];
  const filteredGalleryCars = useMemo(() => {
    if (activeGalleryFilter === "All") return galleryCars;
    return galleryCars.filter((car) => car.category === activeGalleryFilter);
  }, [activeGalleryFilter, galleryCars]);
  const recentHappyClients = useMemo(
    () => happyClients.slice(0, 3),
    [happyClients]
  );

  useEffect(() => {
    if (carsLoading || leadTab !== "buy" || buyCarHintAppliedRef.current) return;
    const hint = activeCar?.name?.trim();
    if (!hint) return;
    buyCarHintAppliedRef.current = true;
    setBuyLead((prev) => ({ ...prev, carName: prev.carName || hint }));
  }, [carsLoading, activeCar?.name, leadTab]);

  useEffect(() => {
    let cancelled = false;

    const fetchOpts = {
      cache: "no-store",
      headers: { Accept: "application/json" },
    };

    const fetchCarsOnly = async ({ showLoading = true } = {}) => {
      if (showLoading) setCarsLoading(true);
      setCarsError("");
      try {
        const API_URL = getApiUrl();
        if (!API_URL) {
          if (!cancelled) setCarsError(MISSING_NEXT_PUBLIC_API_URL);
          return;
        }
        const response = await fetch(`${API_URL}/cars`, fetchOpts);
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

    const loadCarsAndReviews = async () => {
      setCarsLoading(true);
      setCarsError("");
      try {
        const API_URL = getApiUrl();
        if (!API_URL) {
          if (!cancelled) setCarsError(MISSING_NEXT_PUBLIC_API_URL);
          return;
        }
        const [carsRes, reviewsRes, hcRes] = await Promise.all([
          fetch(`${API_URL}/cars`, fetchOpts),
          fetch(`${API_URL}/reviews`, fetchOpts),
          fetch(`${API_URL}/happy-clients`, fetchOpts),
        ]);
        const carsData = await carsRes.json();
        const reviewsData = await reviewsRes.json();
        const hcData = await hcRes.json();
        if (cancelled) return;
        if (carsRes.ok) {
          setCars(carsData.data || []);
        } else {
          setCarsError(carsData.message || "Failed to load cars");
        }
        if (reviewsRes.ok) setReviews(reviewsData.data || []);
        if (hcRes.ok) setHappyClients(hcData.data || []);
      } catch (error) {
        if (!cancelled) setCarsError(error.message || "Failed to load cars");
      } finally {
        if (!cancelled) setCarsLoading(false);
      }
    };

    loadCarsAndReviews();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchCarsOnly({ showLoading: false });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onInventoryChanged = () => fetchCarsOnly({ showLoading: false });
    window.addEventListener("cars-inventory-changed", onInventoryChanged);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cars-inventory-changed", onInventoryChanged);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadReviews = async () => {
      try {
        const API_URL = getApiUrl();
        if (!API_URL) return;
        const r = await fetch(`${API_URL}/reviews`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const data = await r.json();
        if (!cancelled && r.ok) setReviews(data.data || []);
      } catch {
        /* ignore */
      }
    };
    const onReviewsChanged = () => loadReviews();
    if (typeof window !== "undefined") {
      window.addEventListener("reviews-changed", onReviewsChanged);
    }
    return () => {
      cancelled = true;
      if (typeof window !== "undefined") {
        window.removeEventListener("reviews-changed", onReviewsChanged);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadHappyClients = async () => {
      try {
        const API_URL = getApiUrl();
        if (!API_URL) return;
        const r = await fetch(`${API_URL}/happy-clients`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const data = await r.json();
        if (!cancelled && r.ok) setHappyClients(data.data || []);
      } catch {
        /* ignore */
      }
    };
    const onHappyClientsChanged = () => loadHappyClients();
    window.addEventListener("happy-clients-changed", onHappyClientsChanged);
    return () => {
      cancelled = true;
      window.removeEventListener("happy-clients-changed", onHappyClientsChanged);
    };
  }, []);

  useEffect(() => {
    if (featuredCars.length === 0) return;
    if (activeIndex >= featuredCars.length) setActiveIndex(0);
  }, [activeIndex, featuredCars.length]);

  useEffect(() => {
    if (featuredCars.length <= 1) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredCars.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredCars.length]);

  useEffect(() => {
    if (!activeCar.name) return;
    setFormData((prev) => ({ ...prev, carName: activeCar.name }));
  }, [activeCar.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewFeedback("");
    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewFeedback("Please choose a star rating.");
      return;
    }
    if (reviewForm.comment.trim().length < 5) {
      setReviewFeedback("Please write a few words about your experience.");
      return;
    }
    setReviewSubmitting(true);
    try {
      const API_URL = getApiUrl();
      if (!API_URL) {
        setReviewFeedback(MISSING_NEXT_PUBLIC_API_URL);
        return;
      }
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          name: reviewForm.name.trim(),
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not submit review");
      }
      setReviews((prev) => [data.data, ...prev]);
      setReviewForm({ name: "", rating: 0, comment: "" });
      setReviewFeedback("");
      setIsReviewModalOpen(false);
    } catch (err) {
      setReviewFeedback(err.message || "Something went wrong.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage("");

    try {
      const API_URL = getApiUrl();
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

  const handleLeadTabChange = (tab) => {
    setLeadTab(tab);
    setLeadMessage("");
    setLeadError("");
    if (tab === "buy") {
      setBuyLead((prev) => ({
        ...prev,
        carName: activeCar?.name || prev.carName,
      }));
    }
    setIsLeadModalOpen(true);
  };

  const handleBuyLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadSubmitting(true);
    setLeadMessage("");
    setLeadError("");
    try {
      const API_URL = getApiUrl();
      if (!API_URL) {
        setLeadError(MISSING_NEXT_PUBLIC_API_URL);
        return;
      }
      const res = await fetch(`${API_URL}/buy-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(buyLead),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }
      setLeadMessage(
        "🙏 Thank you! Your buy request was sent. Our team will call you soon."
      );
      setBuyLead((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
        carName: activeCar?.name || "",
      }));
    } catch (error) {
      setLeadError(error.message || "Something went wrong");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleSellLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadSubmitting(true);
    setLeadMessage("");
    setLeadError("");
    try {
      const API_URL = getApiUrl();
      if (!API_URL) {
        setLeadError(MISSING_NEXT_PUBLIC_API_URL);
        return;
      }
      const payload = {
        name: String(sellLead.name || "").trim(),
        email: String(sellLead.email || "").trim(),
        phone: String(sellLead.phone || "").trim(),
        carMakeModel: String(sellLead.carMakeModel || "").trim(),
        year: String(sellLead.year || "").trim(),
        expectedPrice: String(sellLead.expectedPrice || "").trim(),
        notes: String(sellLead.notes || "").trim(),
      };
      const res = await fetch(apiUrl("sell-requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      });
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          raw?.startsWith("<")
            ? "Server returned an error page. Check NEXT_PUBLIC_API_URL and that the backend is deployed with /api/sell-requests."
            : "Invalid response from server"
        );
      }
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit");
      }
      setLeadMessage(
        "🙏 Thank you! We received your car details. We will contact you shortly."
      );
      setSellLead({
        name: "",
        email: "",
        phone: "",
        carMakeModel: "",
        year: "",
        expectedPrice: "",
        notes: "",
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sell-requests-changed"));
      }
    } catch (error) {
      setLeadError(error.message || "Something went wrong");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleBuyCar = (car) => {
    if (car?.name) {
      setBuyLead((prev) => ({ ...prev, carName: car.name }));
      setFormData((prev) => ({ ...prev, carName: car.name }));
    }
    setLeadTab("buy");
    setLeadMessage("");
    setLeadError("");
    setIsLeadModalOpen(true);
  };

  return (
    <main className="w-full bg-[#f4f6f8]">
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/55 to-slate-950/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30" />
        </div>

        <div className="relative z-[1] mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:py-14 lg:grid lg:min-h-[min(88dvh,800px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-white"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-[11px] sm:tracking-[0.24em]">
              Premium pre-owned · Pune
            </p>
            <h1 className="mt-3 text-[1.85rem] font-semibold leading-[1.12] tracking-tight text-blue-100 sm:mt-4 sm:text-4xl md:text-[3.4rem]">
              Never miss the right car.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 md:text-[15px]">
              Inspected listings, transparent prices, and a 2-month / 5,000 km
              warranty. When a car is right for you, buy it in a few steps — no
              guesswork.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="/inventory"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 sm:w-auto"
              >
                Buy a car
              </a>
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:w-auto"
              >
                Book a test drive
              </button>
              <div className="flex items-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-400"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppGlyph className="h-5 w-5 shrink-0" />
                </a>
                <a
                  href={TEL_HREF}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                  aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
                >
                  <PhoneGlyph className="h-5 w-5 shrink-0" />
                </a>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-medium text-white/70">
              <span>100% inspected</span>
              <span>2 months / 5,000 km warranty</span>
              <span>Cars24 &amp; Spinny partners</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="w-full lg:flex lg:justify-end"
          >
            <HeroCarScroller
              cars={heroScrollCars}
              loading={carsLoading}
              buildDetailsUrl={buildCarDetailsUrl}
              onBuy={handleBuyCar}
            />
          </motion.div>
        </div>
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
        className="mx-auto max-w-6xl px-4 py-10 sm:py-16 md:py-20"
      >
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              About us
            </p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-blue-800 sm:text-3xl md:text-4xl">
              A quieter way to buy a used car.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Your Dream Cars helps buyers in Pune find inspected, fairly priced
              cars. We keep the process clear — from the first walkaround to
              paperwork and delivery.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {[
                "Verified listing details and transparent pricing",
                "Fast response from the team for every enquiry",
                "Support from shortlisting through the final decision",
                "Partner support with Cars24 and Spinny",
              ].map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-slate-200 py-5">
              {highlights.map((item) => (
                <div key={item.title}>
                  <p className="text-xl font-semibold tracking-tight text-slate-900">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.title}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/about-us"
                className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
              >
                Our story
              </a>
              <a
                href="/contact-us"
                className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Talk to an expert
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 overflow-hidden rounded-2xl">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-3 text-xs font-medium text-white">
                Verified stock · Pune
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
          </div>
        </div>
      </motion.section>

      <motion.section
        {...fadeUp}
        id="gallery"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-16"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Inventory
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl">
              Cars available now
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Handpicked listings with clear pricing, fuel type, and ownership details.
            </p>
          </div>
          <a
            href="/gallery"
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            View full gallery
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
                  setVisibleCarsCount(GALLERY_PAGE_SIZE);
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeGalleryFilter === filter
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <p className="text-xs font-medium text-slate-500">
            {Math.min(visibleCarsCount, filteredGalleryCars.length)} of{" "}
            {filteredGalleryCars.length} cars
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {filteredGalleryCars.slice(0, visibleCarsCount).map((car, index) => (
            <CarSplitRow
              key={car._id || `${car.name}-${car.year}`}
              car={car}
              detailsUrl={buildCarDetailsUrl(car)}
              imageOnRight={index % 2 === 1}
              onBuy={() => handleBuyCar(car)}
              onBookTestDrive={() => {
                setFormData((prev) => ({ ...prev, carName: car.name }));
                setIsFormOpen(true);
              }}
            />
          ))}
        </div>

        {filteredGalleryCars.length > GALLERY_PAGE_SIZE ? (
          <div className="mt-8 flex justify-center gap-3">
            {visibleCarsCount < filteredGalleryCars.length ? (
              <button
                type="button"
                onClick={() =>
                  setVisibleCarsCount((prev) =>
                    Math.min(prev + GALLERY_PAGE_SIZE, filteredGalleryCars.length)
                  )
                }
                className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Load more
              </button>
            ) : null}
            {visibleCarsCount > GALLERY_PAGE_SIZE ? (
              <button
                type="button"
                onClick={() => setVisibleCarsCount(GALLERY_PAGE_SIZE)}
                className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Show less
              </button>
            ) : null}
          </div>
        ) : null}
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-10">
        <div className="overflow-hidden rounded-2xl bg-slate-900 px-6 py-10 text-white md:px-10 md:py-12">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ready for a test drive?
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
            Pick a car and send a request. We will call you to schedule the drive
            and share the full history and best price.
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Book a test drive
          </button>
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Reviews
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-blue-800">
              What buyers say
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setReviewFeedback("");
              setIsReviewModalOpen(true);
            }}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Write a review
          </button>
        </div>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin] [scrollbar-color:rgb(148_163_184)_transparent]">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-500">
              No reviews yet — be the first to share feedback.
            </p>
          ) : (
            reviews.map((r) => (
              <article
                key={r._id}
                className="min-w-[min(100%,260px)] max-w-[280px] shrink-0 rounded-2xl bg-white p-4 ring-1 ring-slate-200/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900">{r.name}</p>
                  <span
                    className="shrink-0 text-sm leading-none text-amber-500"
                    aria-label={`${r.rating} out of 5 stars`}
                  >
                    {"★".repeat(r.rating)}
                    <span className="text-slate-300">
                      {"★".repeat(Math.max(0, 5 - r.rating))}
                    </span>
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 line-clamp-5">
                  {r.comment}
                </p>
                <p className="mt-3 text-[11px] text-slate-500">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </article>
            ))
          )}
        </div>
      </motion.section>

      <motion.section {...fadeUp} className="mx-auto max-w-6xl px-4 pb-10">
        {statusMessage ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {statusMessage}
          </p>
        ) : null}
      </motion.section>

      <motion.section
        {...fadeUp}
        id="request-buy-sell"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-10"
      >
        <div className="text-center md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Buy or sell
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-blue-800 md:text-3xl">
            Request to buy or sell your car
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-[15px]">
            Open a short form, send your details, and our team in Pune will call you
            with the next steps.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleLeadTabChange("buy")}
            className="group rounded-2xl bg-white p-6 text-left ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] hover:ring-slate-300"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Buy
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-blue-800">
              Request to buy
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Tell us the car you want. We will check stock, price, and call you back.
            </p>
            <span className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-700">
              Open buy form
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleLeadTabChange("sell")}
            className="group rounded-2xl bg-slate-900 p-6 text-left text-white ring-1 ring-slate-900 transition hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_16px_36px_rgba(15,23,42,0.18)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Sell
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              Sell your car
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Share make, model, and a few details. We review every listing ourselves.
            </p>
            <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition group-hover:bg-slate-100">
              Open sell form
            </span>
          </button>
        </div>
      </motion.section>

      {recentHappyClients.length > 0 ? (
        <motion.section
          {...fadeUp}
          className="mx-auto max-w-6xl px-4 pb-16"
          aria-labelledby="home-happy-customers-heading"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Happy customers
              </p>
              <h2
                id="home-happy-customers-heading"
                className="mt-2 text-2xl font-semibold tracking-tight text-blue-800 sm:text-3xl"
              >
                Recent deliveries
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Photos from people who bought with us recently.
              </p>
            </div>
            <a
              href="/happy-clients"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              View all
            </a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {recentHappyClients.map((c) => (
              <article
                key={c._id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80"
              >
                <div className="flex min-h-[220px] items-center justify-center bg-slate-100 px-2 py-3">
                  {c.imagePath ? (
                    <img
                      src={resolveCarImageUrl(c.imagePath, getApiUrl())}
                      alt={c.name ? `${c.name} — happy customer` : "Happy customer"}
                      className="mx-auto h-auto max-h-[280px] w-auto max-w-full object-contain"
                    />
                  ) : (
                    <p className="py-12 text-sm text-slate-500">Photo coming soon</p>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-4 py-4">
                  <p className="text-lg font-semibold tracking-tight text-blue-800">
                    {c.name}
                  </p>
                  {c.text ? (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-4">
                      {c.text}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </motion.section>
      ) : null}

      <AnimatePresence>
        {isLeadModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          >
            <button
              type="button"
              aria-label="Close form backdrop"
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="relative z-10 max-h-[min(92dvh,880px)] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-5">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {leadTab === "buy" ? "Request to buy" : "Sell your car"}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {leadTab === "buy"
                      ? "Tell us what you are looking for. We will call you back."
                      : "Share a few details about your car. We will contact you shortly."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              <div className="px-4 pt-4 sm:px-5">
                <div className="flex gap-2 rounded-full bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLeadTab("buy");
                      setLeadMessage("");
                      setLeadError("");
                    }}
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                      leadTab === "buy"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLeadTab("sell");
                      setLeadMessage("");
                      setLeadError("");
                    }}
                    className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                      leadTab === "sell"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              <div className="p-5">
                {leadMessage ? (
                  <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
                    {leadMessage}
                  </p>
                ) : null}
                {leadError ? (
                  <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {leadError}
                  </p>
                ) : null}

                {leadTab === "buy" ? (
                  <form onSubmit={handleBuyLeadSubmit} className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={buyLead.name}
                        onChange={(e) =>
                          setBuyLead((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={buyLead.email}
                        onChange={(e) =>
                          setBuyLead((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="you@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={buyLead.phone}
                        onChange={(e) =>
                          setBuyLead((p) => ({ ...p, phone: e.target.value }))
                        }
                        placeholder="+91 ..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Car you are looking for <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={buyLead.carName}
                        onChange={(e) =>
                          setBuyLead((p) => ({ ...p, carName: e.target.value }))
                        }
                        placeholder="e.g. Honda City VX 2020"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={leadSubmitting}
                        className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {leadSubmitting ? "Sending…" : "Submit buy request"}
                      </button>
                      <p className="text-xs text-slate-500">We respect your privacy — no spam.</p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSellLeadSubmit} className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={sellLead.name}
                        onChange={(e) =>
                          setSellLead((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Your name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={sellLead.email}
                        onChange={(e) =>
                          setSellLead((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="you@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={sellLead.phone}
                        onChange={(e) =>
                          setSellLead((p) => ({ ...p, phone: e.target.value }))
                        }
                        placeholder="+91 ..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Car make & model <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={sellLead.carMakeModel}
                        onChange={(e) =>
                          setSellLead((p) => ({ ...p, carMakeModel: e.target.value }))
                        }
                        placeholder="e.g. Maruti Swift VXI"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Year (optional)
                      </label>
                      <input
                        type="text"
                        value={sellLead.year}
                        onChange={(e) =>
                          setSellLead((p) => ({ ...p, year: e.target.value }))
                        }
                        placeholder="e.g. 2019"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Expected price (optional)
                      </label>
                      <input
                        type="text"
                        value={sellLead.expectedPrice}
                        onChange={(e) =>
                          setSellLead((p) => ({ ...p, expectedPrice: e.target.value }))
                        }
                        placeholder="e.g. 5,50,000"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Notes (optional)
                      </label>
                      <textarea
                        rows={3}
                        value={sellLead.notes}
                        onChange={(e) =>
                          setSellLead((p) => ({ ...p, notes: e.target.value }))
                        }
                        placeholder="Condition, mileage, city…"
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={leadSubmitting}
                        className="inline-flex items-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {leadSubmitting ? "Sending…" : "Submit sell details"}
                      </button>
                      <p className="text-xs text-slate-500">
                        Our team reviews every listing personally.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
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
              className="relative z-10 max-h-[min(92dvh,880px)] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
            >
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-blue-800">
                    Book your test drive
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Fill your details and we will contact you to confirm your test drive.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
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

      <AnimatePresence>
        {isReviewModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          >
            <button
              type="button"
              aria-label="Close review form"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="relative z-10 max-h-[min(92dvh,880px)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
            >
              <div className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
                <h3 className="text-xl font-semibold text-blue-800">Write a review</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Share your experience with other buyers.
                </p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="review-modal-name"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Your name
                    </label>
                    <input
                      id="review-modal-name"
                      value={reviewForm.name}
                      onChange={(e) =>
                        setReviewForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Your name"
                      required
                      minLength={2}
                      maxLength={100}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-400/30"
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-slate-700">Your rating</p>
                    <StarRatingInput
                      variant="light"
                      value={reviewForm.rating}
                      onChange={(n) =>
                        setReviewForm((p) => ({ ...p, rating: n }))
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="review-modal-comment"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Your review
                    </label>
                    <textarea
                      id="review-modal-comment"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((p) => ({ ...p, comment: e.target.value }))
                      }
                      placeholder="Tell others about your experience..."
                      required
                      minLength={5}
                      maxLength={800}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-400/30"
                    />
                  </div>
                  {reviewFeedback ? (
                    <p className="text-sm font-medium text-red-600">{reviewFeedback}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                  >
                    {reviewSubmitting ? "Submitting…" : "Submit review"}
                  </button>
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
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-40 flex flex-col gap-2.5 md:bottom-8 md:right-6 ${
          isFormOpen || isReviewModalOpen || isLeadModalOpen ? "hidden" : ""
        }`}
        aria-hidden={isFormOpen || isReviewModalOpen || isLeadModalOpen}
      >
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-900/35 ring-2 ring-white/40 transition hover:scale-105 hover:bg-[#20bd5a] hover:shadow-2xl md:h-14 md:w-14"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppGlyph className="h-7 w-7" />
        </a>
        <a
          href={TEL_HREF}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-cyan-200 shadow-xl shadow-slate-900/40 ring-2 ring-white/30 transition hover:scale-105 hover:from-slate-800 hover:to-slate-700 hover:shadow-2xl md:h-14 md:w-14"
          aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
        >
          <PhoneGlyph className="h-6 w-6" />
        </a>
      </motion.div>
    </main>
  );
}
