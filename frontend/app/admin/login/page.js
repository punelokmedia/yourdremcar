"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "yourdreamcars1806@gmail.com";
const ADMIN_PASSWORD = "yourdremcar123";
const ADMIN_PASSWORD_ALTERNATE = "yourdreamcar123";
const ADMIN_AUTH_KEY = "ydc_admin_logged_in";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(ADMIN_AUTH_KEY) === "true") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const isValid =
      normalizedEmail === ADMIN_EMAIL &&
      (normalizedPassword === ADMIN_PASSWORD ||
        normalizedPassword === ADMIN_PASSWORD_ALTERNATE);

    setTimeout(() => {
      if (!isValid) {
        setError(
          "Invalid credentials. Try yourdreamcars1806@gmail.com / yourdremcar123"
        );
        setLoading(false);
        return;
      }

      localStorage.setItem(ADMIN_AUTH_KEY, "true");
      router.push("/admin/dashboard");
    }, 500);
  };

  return (
    <main className="relative overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-100/70 via-white to-indigo-100/70" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-12 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      <section className="relative mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
        <motion.article
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-white/70 bg-white/75 p-7 shadow-xl shadow-slate-200 backdrop-blur-md md:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Admin Access
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900">
            Welcome back to admin control center
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Monitor contact queries, update request status, and manage your inventory
            from one clean dashboard.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Contact Queries", value: "Live updates" },
              { label: "Request Status", value: "Pending to Resolved" },
              { label: "Inventory Overview", value: "Quick insights" },
              { label: "Admin Session", value: "Secure local access" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full rounded-3xl border border-white/70 bg-white p-7 shadow-xl shadow-slate-200 md:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
            Admin Panel
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage dashboard, users, and inventory.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourdreamcars1806@gmail.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5"
                required
              />
            </div>

            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Demo credentials: <span className="font-semibold">yourdreamcars1806@gmail.com</span>{" "}
            / <span className="font-semibold">yourdremcar123</span>
          </p>
        </motion.div>
      </section>
    </main>
  );
}
