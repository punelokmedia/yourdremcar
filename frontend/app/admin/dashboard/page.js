"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../../../lib/getApiUrl";

const ADMIN_AUTH_KEY = "ydc_admin_logged_in";
const API_URL = getApiUrl();

const menuItems = [
  { label: "Overview", icon: "◈", badge: null },
  { label: "New Cars", icon: "✦", badge: null },
  { label: "Inventory", icon: "▦", badge: null },
  { label: "Contact Queries", icon: "☏", badge: null },
];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const STATUS_OPTIONS = ["Pending", "Contacted", "Resolved"];
const FUEL_TYPE_OPTIONS = ["Petrol", "CNG"];
const OWNERSHIP_OPTIONS = [
  "Single Owner",
  "Second Owner",
  "Third Owner",
  "Multiple Owners",
];
const getStatusButtonClass = (status, currentStatus) => {
  if (status === currentStatus) {
    if (status === "Resolved") {
      return "bg-emerald-600 border-emerald-600 text-white";
    }
    if (status === "Contacted") {
      return "bg-blue-600 border-blue-600 text-white";
    }
    return "bg-amber-500 border-amber-500 text-white";
  }

  return "bg-white border-slate-300 text-slate-600 hover:bg-slate-50";
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [newCarForm, setNewCarForm] = useState({
    title: "",
    brand: "",
    model: "",
    fuelType: "Petrol",
    ownership: "Single Owner",
    year: "",
    price: "",
    description: "",
    image: null,
  });
  const [newCarSubmitting, setNewCarSubmitting] = useState(false);
  const [newCarMessage, setNewCarMessage] = useState("");
  const [newCarError, setNewCarError] = useState("");
  const [showNewCarForm, setShowNewCarForm] = useState(false);
  const [editingCarId, setEditingCarId] = useState("");
  const [deletingCarId, setDeletingCarId] = useState("");
  const [cars, setCars] = useState([]);
  const [totalCars, setTotalCars] = useState(0);
  const [buyRequests, setBuyRequests] = useState([]);
  const [contactQueries, setContactQueries] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState("");
  const currentDate = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loggedIn = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
    if (!loggedIn) {
      router.replace("/admin/login");
      return;
    }
    setIsReady(true);
  }, [router]);

  useEffect(() => {
    if (!isReady) return;

    const fetchDashboardData = async () => {
      setLoadingData(true);
      setDataError("");

      try {
        const fetchOpts = {
          cache: "no-store",
          headers: { Accept: "application/json" },
        };
        const [carsResponse, buyRequestsResponse, contactQueriesResponse] =
          await Promise.all([
            fetch(`${API_URL}/cars`, fetchOpts),
            fetch(`${API_URL}/buy-requests`, fetchOpts),
            fetch(`${API_URL}/contact-queries`, fetchOpts),
          ]);

        const carsData = await carsResponse.json();
        const buyRequestsData = await buyRequestsResponse.json();
        const contactQueriesData = await contactQueriesResponse.json();

        if (!carsResponse.ok) {
          throw new Error(carsData.message || "Failed to load cars data");
        }

        if (!buyRequestsResponse.ok) {
          throw new Error(buyRequestsData.message || "Failed to load buy requests");
        }

        if (!contactQueriesResponse.ok) {
          throw new Error(
            contactQueriesData.message || "Failed to load contact queries"
          );
        }

        const fetchedCars = carsData.data || [];
        setCars(fetchedCars);
        setTotalCars(fetchedCars.length);
        setBuyRequests(buyRequestsData.data || []);
        setContactQueries(contactQueriesData.data || []);
      } catch (error) {
        setDataError(error.message || "Failed to load dashboard data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [isReady]);

  const dashboardCards = [
    {
      label: "Total Cars",
      value: String(totalCars),
      detail: "Active inventory listings",
      color: "from-cyan-500 to-blue-600",
      icon: "🚗",
      glow: "shadow-cyan-200/70",
    },
    {
      label: "Buy Requests",
      value: String(buyRequests.length),
      detail: "Total requests received",
      color: "from-indigo-500 to-blue-600",
      icon: "🛒",
      glow: "shadow-indigo-200/70",
    },
    {
      label: "Total Inquiry",
      value: String(contactQueries.length),
      detail: "Messages from contact form",
      color: "from-amber-500 to-orange-600",
      icon: "📩",
      glow: "shadow-amber-200/70",
    },
  ];

  const renderedMenuItems = menuItems.map((item) => {
    if (item.label === "New Cars") {
      return { ...item, badge: String(totalCars) };
    }
    if (item.label === "Inventory") {
      return { ...item, badge: String(totalCars) };
    }
    if (item.label === "Contact Queries") {
      return { ...item, badge: String(contactQueries.length) };
    }
    return item;
  });
  const recentBuyRequests = buyRequests.filter((item) => {
    const createdAt = new Date(item.createdAt || item.updatedAt || 0).getTime();
    return Date.now() - createdAt <= ONE_DAY_MS;
  });
  const recentContactQueries = contactQueries.filter((item) => {
    const createdAt = new Date(item.createdAt || item.updatedAt || 0).getTime();
    return Date.now() - createdAt <= ONE_DAY_MS;
  });

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    router.push("/admin/login");
  };

  const handleNewCarInputChange = (event) => {
    const { name, value } = event.target;
    setNewCarForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewCarImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setNewCarForm((prev) => ({ ...prev, image: file }));
  };

  const resetNewCarForm = () => {
    setNewCarForm({
      title: "",
      brand: "",
      model: "",
      fuelType: "Petrol",
      ownership: "Single Owner",
      year: "",
      price: "",
      description: "",
      image: null,
    });
    setEditingCarId("");
  };

  const closeCarFormPanel = () => {
    setShowNewCarForm(false);
    resetNewCarForm();
  };

  const handleCreateCar = async (event) => {
    event.preventDefault();
    setNewCarSubmitting(true);
    setNewCarMessage("");
    setNewCarError("");

    try {
      const formData = new FormData();
      formData.append("title", newCarForm.title);
      formData.append("brand", newCarForm.brand);
      formData.append("model", newCarForm.model);
      formData.append("fuelType", newCarForm.fuelType);
      formData.append("ownership", newCarForm.ownership);
      formData.append("year", newCarForm.year);
      formData.append("price", newCarForm.price);
      formData.append("description", newCarForm.description);
      if (newCarForm.image) {
        formData.append("image", newCarForm.image);
      }

      const isEditing = Boolean(editingCarId);
      const response = await fetch(
        isEditing ? `${API_URL}/cars/${editingCarId}` : `${API_URL}/cars`,
        {
          method: isEditing ? "PATCH" : "POST",
          body: formData,
          cache: "no-store",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save car");
      }

      if (isEditing) {
        setCars((prev) => prev.map((car) => (car._id === data.data._id ? data.data : car)));
        setNewCarMessage("Car updated successfully.");
      } else {
        setTotalCars((prev) => prev + 1);
        setCars((prev) => [data.data, ...prev]);
        setNewCarMessage("New car added successfully.");
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cars-inventory-changed"));
      }

      resetNewCarForm();
      closeCarFormPanel();
    } catch (error) {
      setNewCarError(error.message || "Failed to save car");
    } finally {
      setNewCarSubmitting(false);
    }
  };

  const handleEditCar = (car) => {
    setEditingCarId(car._id);
    setNewCarMessage("");
    setNewCarError("");
    setShowNewCarForm(true);
    setNewCarForm({
      title: car.title || "",
      brand: car.brand || "",
      model: car.model || "",
      fuelType: car.fuelType || "Petrol",
      ownership: car.ownership || "Single Owner",
      year: car.year ? String(car.year) : "",
      price: car.price ? String(car.price) : "",
      description: car.description || "",
      image: null,
    });
  };

  const handleDeleteCar = async (carId) => {
    const confirmed = window.confirm("Are you sure you want to delete this car?");
    if (!confirmed) {
      return;
    }

    setDeletingCarId(carId);
    setNewCarMessage("");
    setNewCarError("");

    try {
      const response = await fetch(`${API_URL}/cars/${carId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete car");
      }

      setCars((prev) => prev.filter((car) => car._id !== carId));
      setTotalCars((prev) => Math.max(0, prev - 1));
      setNewCarMessage("Car deleted successfully.");

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cars-inventory-changed"));
      }

      if (editingCarId === carId) {
        closeCarFormPanel();
      }
    } catch (error) {
      setNewCarError(error.message || "Failed to delete car");
    } finally {
      setDeletingCarId("");
    }
  };

  const handleStatusUpdate = async (queryId, status) => {
    setUpdatingStatusId(queryId);
    setDataError("");

    try {
      const response = await fetch(`${API_URL}/contact-queries/${queryId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setContactQueries((prev) =>
        prev.map((query) => (query._id === queryId ? data.data : query))
      );
    } catch (error) {
      setDataError(error.message || "Failed to update contact status");
    } finally {
      setUpdatingStatusId("");
    }
  };

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-sm font-medium text-slate-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Toggle sidebar"
            >
              ≡
            </button>
            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white md:flex">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
                Admin Dashboard
              </p>
              <h1 className="text-lg font-bold text-slate-900">Welcome to Dashboard</h1>
              <p className="text-xs text-slate-500">Last updated: {currentDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 lg:flex">
              <span className="text-xs font-medium text-slate-500">Admin Session</span>
              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                Online
              </span>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
              aria-label="Notifications"
            >
              •
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex w-full gap-0 px-0 py-0">
        <motion.aside
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200/70 bg-white/85 p-4 shadow-xl shadow-slate-200/40 backdrop-blur-lg transition lg:sticky lg:top-[69px] lg:h-[calc(100vh-69px)] lg:rounded-none lg:translate-x-0 lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="mb-3 flex items-center justify-between lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Menu
            </p>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-700"
              aria-label="Close sidebar"
            >
              X
            </button>
          </div>

          <div className="mb-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4 text-slate-800 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
              Your Dreams Cars
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">Admin Panel</p>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-blue-100 bg-white/90 px-3 py-2">
              <span className="text-xs text-slate-600">Current Mode</span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                Live
              </span>
            </div>
          </div>

          <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-xs font-medium text-slate-500">Quick Search</p>
            <input
              type="text"
              placeholder="Search menu..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
            />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Navigation
          </p>
          <nav className="space-y-1.5">
            {renderedMenuItems.map((item) => (
              <motion.button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveMenu(item.label);
                  closeCarFormPanel();
                  setNewCarMessage("");
                  setNewCarError("");
                  setSidebarOpen(false);
                }}
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`relative flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                  activeMenu === item.label
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/60"
                    : "text-slate-700 hover:bg-slate-100/90 active:bg-slate-200/70"
                }`}
              >
                {activeMenu === item.label ? (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-blue-200" />
                ) : null}
                <span className="text-xs">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge ? (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      activeMenu === item.label
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </motion.button>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Active Section
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">{activeMenu}</p>
          </div>
        </motion.aside>

        {sidebarOpen ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] transition lg:hidden"
            aria-label="Close sidebar overlay"
          />
        ) : null}

        <section className="w-full space-y-6 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Dashboard Overview
              </p>
              <p className="text-xs text-slate-500">
                Track leads, inventory, and customer support performance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search dashboard..."
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm"
              />
              <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                Updated just now
              </span>
            </div>
          </div>

          {activeMenu === "Contact Queries" ? (
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">All Contact Queries</h2>
                <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  {contactQueries.length} Total
                </span>
              </div>

              {dataError ? (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {dataError}
                </p>
              ) : null}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left text-sm">
                  <thead className="border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="py-2 pr-3 font-semibold">Name</th>
                      <th className="py-2 pr-3 font-semibold">Email</th>
                      <th className="py-2 pr-3 font-semibold">Phone</th>
                      <th className="py-2 pr-3 font-semibold">Subject</th>
                      <th className="py-2 pr-3 font-semibold">Message</th>
                      <th className="py-2 pr-3 font-semibold">Status</th>
                      <th className="py-2 pr-3 font-semibold">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingData ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-4 text-center text-sm font-medium text-slate-500"
                        >
                          Loading contact queries...
                        </td>
                      </tr>
                    ) : contactQueries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-4 text-center text-sm font-medium text-slate-500"
                        >
                          No contact queries found yet.
                        </td>
                      </tr>
                    ) : (
                      contactQueries.map((query) => (
                        <tr key={query._id} className="border-b border-slate-100 text-slate-700">
                          <td className="py-3 pr-3">{query.fullName || query.name || "Unknown"}</td>
                          <td className="py-3 pr-3">{query.email || "No email"}</td>
                          <td className="py-3 pr-3">{query.phone || "No phone"}</td>
                          <td className="py-3 pr-3">{query.subject || "General inquiry"}</td>
                          <td className="max-w-[320px] py-3 pr-3">
                            <p className="line-clamp-2">{query.message || "-"}</p>
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex flex-wrap gap-1.5">
                              {STATUS_OPTIONS.map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => handleStatusUpdate(query._id, status)}
                                  disabled={updatingStatusId === query._id}
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${getStatusButtonClass(
                                    status,
                                    query.status || "Pending"
                                  )}`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 pr-3 text-xs text-slate-600">
                            {new Date(
                              query.updatedAt || query.createdAt || Date.now()
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </article>
          ) : activeMenu === "New Cars" ? (
            <div className="w-full max-w-6xl space-y-6">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Listed Cars</h2>
                    <p className="text-sm text-slate-500">
                      All cars currently available in your inventory.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (showNewCarForm) {
                        closeCarFormPanel();
                      } else {
                        resetNewCarForm();
                        setShowNewCarForm(true);
                      }
                      setNewCarMessage("");
                      setNewCarError("");
                    }}
                    className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {showNewCarForm
                      ? editingCarId
                        ? "Close Edit Form"
                        : "Close Form"
                      : "Add Car"}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[880px] text-left text-sm">
                    <thead className="border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="py-2 pr-3 font-semibold">Title</th>
                        <th className="py-2 pr-3 font-semibold">Brand</th>
                        <th className="py-2 pr-3 font-semibold">Model</th>
                        <th className="py-2 pr-3 font-semibold">Fuel</th>
                        <th className="py-2 pr-3 font-semibold">Ownership</th>
                        <th className="py-2 pr-3 font-semibold">Year</th>
                        <th className="py-2 pr-3 font-semibold">Price</th>
                        <th className="py-2 pr-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingData ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="py-4 text-center text-sm font-medium text-slate-500"
                          >
                            Loading cars...
                          </td>
                        </tr>
                      ) : cars.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="py-4 text-center text-sm font-medium text-slate-500"
                          >
                            No cars listed yet. Click Add Car to create your first listing.
                          </td>
                        </tr>
                      ) : (
                        cars.map((car) => (
                          <tr key={car._id} className="border-b border-slate-100 text-slate-700">
                            <td className="py-3 pr-3">{car.title || "-"}</td>
                            <td className="py-3 pr-3">{car.brand || "-"}</td>
                            <td className="py-3 pr-3">{car.model || "-"}</td>
                            <td className="py-3 pr-3">{car.fuelType || "-"}</td>
                            <td className="py-3 pr-3 text-xs">
                              {car.ownership || "Single Owner"}
                            </td>
                            <td className="py-3 pr-3">{car.year || "-"}</td>
                            <td className="py-3 pr-3">
                              {typeof car.price === "number"
                                ? new Intl.NumberFormat("en-IN").format(car.price)
                                : "-"}
                            </td>
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEditCar(car)}
                                  className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCar(car._id)}
                                  disabled={deletingCarId === car._id}
                                  className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {deletingCarId === car._id ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </article>

              {showNewCarForm ? (
                <>
                  <button
                    type="button"
                    onClick={closeCarFormPanel}
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px]"
                    aria-label="Close add car panel overlay"
                  />
                  <motion.aside
                    key="new-cars-form-panel"
                    initial={{ opacity: 0, x: 56, scaleX: 0.96 }}
                    animate={{ opacity: 1, x: 0, scaleX: 1 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    style={{ transformOrigin: "right center" }}
                    className="fixed right-4 top-3 z-50 h-[calc(100vh-2rem)] w-[min(540px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl lg:right-6 lg:top-[76px] lg:h-[calc(100vh-100px)] lg:w-[min(560px,calc(100vw-24rem))]"
                  >
                  <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {editingCarId ? "Edit Car" : "Add New Car"}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                      <span className="text-xs font-medium text-slate-500">Total Cars</span>
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                        {totalCars}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={closeCarFormPanel}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:bg-slate-100"
                      aria-label="Close add car panel"
                    >
                      X
                    </button>
                    </div>
                  </div>
                  <p className="mb-4 text-xs font-medium text-slate-500">
                    Fields marked with <span className="text-red-500">*</span> are required.
                  </p>

                  {newCarMessage ? (
                    <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {newCarMessage}
                    </p>
                  ) : null}

                  {newCarError ? (
                    <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {newCarError}
                    </p>
                  ) : null}

                  <form onSubmit={handleCreateCar} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Basic Details
                        </p>
                      </div>
                      <label className="space-y-1.5 text-sm font-medium text-slate-700">
                        <span>
                          Title <span className="text-red-500">*</span>
                        </span>
                        <input
                          required
                          name="title"
                          value={newCarForm.title}
                          onChange={handleNewCarInputChange}
                          placeholder="e.g. Mercedes-Benz C-Class 2021"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      <label className="space-y-1.5 text-sm font-medium text-slate-700">
                        <span>
                          Brand <span className="text-red-500">*</span>
                        </span>
                        <input
                          required
                          name="brand"
                          value={newCarForm.brand}
                          onChange={handleNewCarInputChange}
                          placeholder="e.g. Mercedes"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      <label className="space-y-1.5 text-sm font-medium text-slate-700">
                        <span>
                          Model <span className="text-red-500">*</span>
                        </span>
                        <input
                          required
                          name="model"
                          value={newCarForm.model}
                          onChange={handleNewCarInputChange}
                          placeholder="e.g. C200"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      <div className="space-y-1.5 text-sm font-medium text-slate-700">
                        <span>
                          Fuel Type <span className="text-red-500">*</span>
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {FUEL_TYPE_OPTIONS.map((option) => {
                            const isActive = newCarForm.fuelType === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() =>
                                  setNewCarForm((prev) => ({ ...prev, fuelType: option }))
                                }
                                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                                  isActive
                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                                aria-pressed={isActive}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs font-normal text-slate-500">
                          Tap to choose the primary fuel type.
                        </p>
                      </div>

                      <div className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">
                        <span>
                          Ownership <span className="text-red-500">*</span>
                        </span>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {OWNERSHIP_OPTIONS.map((option) => {
                            const isActive = newCarForm.ownership === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() =>
                                  setNewCarForm((prev) => ({ ...prev, ownership: option }))
                                }
                                className={`rounded-xl border px-2 py-2 text-center text-xs font-semibold leading-tight transition sm:text-sm ${
                                  isActive
                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                                aria-pressed={isActive}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs font-normal text-slate-500">
                          Select how many owners the vehicle has had.
                        </p>
                      </div>

                      <label className="space-y-1.5 text-sm font-medium text-slate-700">
                        <span>
                          Year <span className="text-red-500">*</span>
                        </span>
                        <input
                          required
                          type="number"
                          min="1900"
                          max="2100"
                          name="year"
                          value={newCarForm.year}
                          onChange={handleNewCarInputChange}
                          placeholder="e.g. 2021"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <p className="text-xs font-normal text-slate-500">
                          Allowed range: 1900 to 2100
                        </p>
                      </label>

                      <label className="space-y-1.5 text-sm font-medium text-slate-700">
                        <span>
                          Price <span className="text-red-500">*</span>
                        </span>
                        <input
                          required
                          type="number"
                          min="0"
                          name="price"
                          value={newCarForm.price}
                          onChange={handleNewCarInputChange}
                          placeholder="e.g. 4500000"
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        <p className="text-xs font-normal text-slate-500">
                          Enter amount in rupees without commas.
                        </p>
                      </label>

                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Extra Details
                        </p>
                      </div>

                      <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">
                        <span>Description</span>
                        <textarea
                          rows={4}
                          name="description"
                          value={newCarForm.description}
                          onChange={handleNewCarInputChange}
                          placeholder="Write key details like condition, mileage, and highlights..."
                          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>

                      <label className="space-y-1.5 text-sm font-medium text-slate-700 md:col-span-2">
                        <span>Image (optional)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNewCarImageChange}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                        />
                        <p className="text-xs font-normal text-slate-500">
                          {editingCarId
                            ? "Upload a new image only if you want to replace current one."
                            : "Best result: clear front-angle image under 5MB."}
                        </p>
                        {newCarForm.image ? (
                          <p className="text-xs font-medium text-slate-700">
                            Selected file: {newCarForm.image.name}
                          </p>
                        ) : null}
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
                      <button
                        type="submit"
                        disabled={newCarSubmitting}
                        className="inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {newCarSubmitting
                          ? editingCarId
                            ? "Saving..."
                            : "Adding..."
                          : editingCarId
                            ? "Save Changes"
                            : "Add Car"}
                      </button>
                      <button
                        type="button"
                        onClick={resetNewCarForm}
                        disabled={newCarSubmitting}
                        className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reset Form
                      </button>
                    </div>
                  </form>
                  </motion.aside>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {dashboardCards.map((card) => (
                  <motion.article
                    key={card.label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg ${card.glow}`}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${card.color}`} />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-600">{card.label}</p>
                        <span className="text-base">{card.icon}</span>
                      </div>
                      <p className="mt-2 text-3xl font-extrabold text-slate-900">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{card.detail}</p>
                    </div>
                  </motion.article>
                ))}
              </div>

              {dataError ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {dataError}
                </p>
              ) : null}

              <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Recent Buy Requests</h2>
                    <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      Last 24 Hours
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead className="border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="py-2 pr-3 font-semibold">Name</th>
                          <th className="py-2 pr-3 font-semibold">Car</th>
                          <th className="py-2 pr-3 font-semibold">Phone</th>
                          <th className="py-2 pr-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingData ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-4 text-center text-sm font-medium text-slate-500"
                            >
                              Loading real data...
                            </td>
                          </tr>
                        ) : recentBuyRequests.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-4 text-center text-sm font-medium text-slate-500"
                            >
                              No buy requests in the last 24 hours.
                            </td>
                          </tr>
                        ) : (
                          recentBuyRequests.slice(0, 8).map((request) => (
                            <tr
                              key={request._id}
                              className="border-b border-slate-100 text-slate-700"
                            >
                              <td className="py-3 pr-3">{request.name}</td>
                              <td className="py-3 pr-3">{request.carName}</td>
                              <td className="py-3 pr-3">{request.phone}</td>
                              <td className="py-3 pr-3">
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                  Pending
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </article>

                <div className="space-y-6">
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900">
                        Recent Contact Queries
                      </h2>
                      <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        Last 24 Hours
                      </span>
                    </div>

                    <div className="space-y-3">
                      {loadingData ? (
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                          Loading contact queries...
                        </p>
                      ) : recentContactQueries.length === 0 ? (
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
                          No contact queries in the last 24 hours.
                        </p>
                      ) : (
                        recentContactQueries.slice(0, 5).map((query) => (
                          <div
                            key={query._id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900">
                                {query.fullName || query.name || "Unknown"}
                              </p>
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                                {query.status || "Pending"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600">
                              {query.email || "No email"}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              {query.phone || "No phone"}
                            </p>
                            <p className="mt-2 text-xs font-medium text-slate-700">
                              Subject: {query.subject || "General inquiry"}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </article>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
