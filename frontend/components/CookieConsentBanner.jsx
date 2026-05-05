"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getApiUrl, MISSING_NEXT_PUBLIC_API_URL } from "../lib/getApiUrl";

export const CAR_SELLS_COOKIE_OPEN_EVENT = "car-sells-open-cookie-banner";

const STORAGE_KEY = "car_sells_cookie_consent_v1";
const COOKIE_NAME = "car_sells_cookie_consent_v1";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map((s) => s.trim());
  const hit = parts.find((p) => p.startsWith(prefix));
  if (!hit) return null;
  try {
    return decodeURIComponent(hit.slice(prefix.length));
  } catch {
    return hit.slice(prefix.length);
  }
}

function writeConsentCookie(payload) {
  const enc = encodeURIComponent(JSON.stringify(payload));
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${COOKIE_NAME}=${enc}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax${secure}`;
}

function loadStoredConsent() {
  if (typeof window === "undefined") return null;
  try {
    const rawLs = localStorage.getItem(STORAGE_KEY);
    if (rawLs) {
      const parsed = JSON.parse(rawLs);
      if (parsed && typeof parsed.decision === "string") return parsed;
    }
  } catch {
    /* ignore */
  }
  try {
    const rawC = readCookie(COOKIE_NAME);
    if (rawC) {
      const parsed = JSON.parse(rawC);
      if (parsed && typeof parsed.decision === "string") return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function decisionPreferences(decision) {
  if (decision === "accepted") {
    return { necessary: true, analytics: true, marketing: true };
  }
  return { necessary: true, analytics: false, marketing: false };
}

function decisionFromToggles(analytics, marketing) {
  if (analytics || marketing) {
    return {
      decision: "accepted",
      preferences: { necessary: true, analytics, marketing },
    };
  }
  return {
    decision: "essential_only",
    preferences: { necessary: true, analytics: false, marketing: false },
  };
}

export default function CookieConsentBanner() {
  const pathname = usePathname();
  const apiUrl = getApiUrl();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);

  const hideOnAdmin = pathname?.startsWith("/admin");

  const syncTogglesFromStorage = useCallback(() => {
    const stored = loadStoredConsent();
    if (stored?.preferences) {
      setAnalyticsOn(Boolean(stored.preferences.analytics));
      setMarketingOn(Boolean(stored.preferences.marketing));
    } else {
      setAnalyticsOn(false);
      setMarketingOn(false);
    }
  }, []);

  const refreshVisibility = useCallback(() => {
    if (hideOnAdmin) {
      setVisible(false);
      return;
    }
    const stored = loadStoredConsent();
    setVisible(!stored);
    if (!stored) {
      setShowCustomize(false);
      syncTogglesFromStorage();
    }
  }, [hideOnAdmin, syncTogglesFromStorage]);

  useEffect(() => {
    refreshVisibility();
  }, [refreshVisibility]);

  useEffect(() => {
    const onOpen = () => {
      if (hideOnAdmin) return;
      setVisible(true);
      setNotice("");
      syncTogglesFromStorage();
    };
    window.addEventListener(CAR_SELLS_COOKIE_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CAR_SELLS_COOKIE_OPEN_EVENT, onOpen);
  }, [hideOnAdmin, syncTogglesFromStorage]);

  const persistLocal = (decision, preferencesOverride) => {
    const preferences = preferencesOverride || decisionPreferences(decision);
    const payload = {
      decision,
      preferences,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    writeConsentCookie(payload);
    setVisible(false);
    setShowCustomize(false);
    setNotice("");
  };

  const postConsent = async (decision, preferences) => {
    if (!apiUrl) {
      if (process.env.NODE_ENV === "development") {
        setNotice(MISSING_NEXT_PUBLIC_API_URL);
      }
      persistLocal(decision, preferences);
      return;
    }
    const res = await fetch(`${apiUrl}/cookie-consents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        decision,
        preferences,
        sourceUrl: typeof window !== "undefined" ? window.location.href : "",
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Server responded ${res.status}`);
    }
    persistLocal(decision, preferences);
  };

  const submit = async (decision) => {
    setBusy(true);
    setNotice("");
    try {
      const preferences = decisionPreferences(decision);
      await postConsent(decision, preferences);
    } catch (e) {
      setNotice(
        e.message || "Could not reach the server; your choice was saved on this device only."
      );
      persistLocal(decision, decisionPreferences(decision));
    } finally {
      setBusy(false);
    }
  };

  const submitCustomize = async () => {
    const { decision, preferences } = decisionFromToggles(analyticsOn, marketingOn);
    setBusy(true);
    setNotice("");
    try {
      await postConsent(decision, preferences);
    } catch (e) {
      setNotice(
        e.message || "Could not reach the server; your choice was saved on this device only."
      );
      persistLocal(decision, preferences);
    } finally {
      setBusy(false);
    }
  };

  if (hideOnAdmin || !visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="pointer-events-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_-4px_40px_rgba(15,23,42,0.12),0_25px_50px_-12px_rgba(15,23,42,0.25)]">
        <div className="flex gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-4 md:px-6 md:py-5">
          <div
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 sm:flex"
            aria-hidden
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="9" cy="10" r="1.25" fill="currentColor" />
              <circle cx="14.5" cy="9.5" r="1" fill="currentColor" />
              <circle cx="15" cy="14.5" r="1" fill="currentColor" />
              <circle cx="10" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="cookie-banner-title"
              className="text-base font-semibold tracking-tight text-slate-900 md:text-lg"
            >
              Cookies on this site
            </h2>
            <p
              id="cookie-banner-desc"
              className="mt-1.5 text-sm leading-relaxed text-slate-600 md:text-[15px]"
            >
              We use strictly necessary cookies to operate the site. With your permission we also use
              optional cookies for analytics and relevant communications. You can change your mind
              anytime via{" "}
              <button
                type="button"
                className="font-semibold text-blue-700 underline decoration-blue-700/30 underline-offset-2 hover:text-blue-800"
                onClick={() => {
                  setShowCustomize((v) => !v);
                  if (!showCustomize) syncTogglesFromStorage();
                }}
              >
                Manage preferences
              </button>
              . Read more in our{" "}
              <Link
                href="/contact-us"
                className="font-semibold text-blue-700 underline decoration-blue-700/30 underline-offset-2 hover:text-blue-800"
              >
                contact &amp; privacy notice
              </Link>
              .
            </p>
            {notice ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                {notice}
              </p>
            ) : null}
          </div>
        </div>

        {showCustomize ? (
          <div className="space-y-4 border-b border-slate-100 bg-white px-5 py-4 md:px-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cookie categories
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">Strictly necessary</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    Required for security and core features (always on).
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-slate-500">Always active</span>
              </li>
              <li className="flex gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">Analytics</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    Helps us understand how the site is used so we can improve it.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsOn}
                  disabled={busy}
                  onClick={() => setAnalyticsOn((v) => !v)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
                    analyticsOn ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                      analyticsOn ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </li>
              <li className="flex gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">Marketing</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                    Used to deliver relevant offers and measure campaigns (if enabled).
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketingOn}
                  disabled={busy}
                  onClick={() => setMarketingOn((v) => !v)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
                    marketingOn ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                      marketingOn ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => submitCustomize()}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
              >
                {busy ? "Saving…" : "Save preferences"}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setShowCustomize(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 md:py-4">
          <p className="order-2 text-[11px] leading-snug text-slate-500 sm:order-1 sm:max-w-md">
            Consent is stored on your device for 7 days. Aggregated records may be kept on our
            servers for the same period for compliance, then deleted automatically.
          </p>
          <div className="order-1 flex flex-wrap gap-2 sm:order-2 sm:justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={() => submit("rejected")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setShowCustomize(true);
                syncTogglesFromStorage();
              }}
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:opacity-60"
            >
              Customize
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => submit("accepted")}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              {busy ? "Saving…" : "Accept all"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
