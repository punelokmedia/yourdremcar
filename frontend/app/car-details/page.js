import { resolveCarImageUrl } from "../../lib/resolveCarImageUrl";
import { getApiUrl } from "../../lib/getApiUrl";

export default async function CarDetailsPage({ searchParams }) {
  const params = await searchParams;
  const API_URL = getApiUrl();
  const carId = params?.id;
  let carFromApi = null;

  if (carId) {
    try {
      const response = await fetch(`${API_URL}/cars`, { cache: "no-store" });
      const data = await response.json();
      if (response.ok) {
        carFromApi = (data.data || []).find((car) => car._id === carId) || null;
      }
    } catch (_error) {
      carFromApi = null;
    }
  }

  const name =
    carFromApi?.title ||
    `${carFromApi?.brand || ""} ${carFromApi?.model || ""}`.trim() ||
    params?.name ||
    "Selected Car";
  const year = carFromApi?.year ? String(carFromApi.year) : params?.year || "N/A";
  const price = Number.isFinite(Number(carFromApi?.price))
    ? `Rs ${new Intl.NumberFormat("en-IN").format(Number(carFromApi.price))}`
    : params?.price || "Price on request";
  const isSafeParamImage =
    typeof params?.image === "string" &&
    params.image.startsWith("https://") &&
    !params.image.includes("localhost");
  const image = resolveCarImageUrl(
    carFromApi?.imageUrl || (isSafeParamImage ? params.image : ""),
    API_URL
  );
  const fuelType = carFromApi?.fuelType || params?.fuelType || "N/A";
  const ownership =
    carFromApi?.ownership || params?.ownership || "Single Owner";
  const note =
    carFromApi?.description ||
    params?.note ||
    "Premium maintained condition with complete inspection support.";
  const specs = [
    { label: "Model Year", value: year },
    { label: "Fuel Type", value: fuelType },
    { label: "Transmission", value: "Automatic" },
    { label: "Ownership", value: ownership },
  ];
  const highlights = [
    "Verified inspection support",
    "Transparent pricing",
    "Premium maintained condition",
    "Quick documentation guidance",
  ];

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10 lg:pt-6 lg:pb-12">
          <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10">
            {/* Left: title & price — top-aligned, larger type */}
            <div className="self-start lg:col-span-5 lg:pt-1">
              <nav
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500"
                aria-label="Breadcrumb"
              >
                <a
                  href="/inventory"
                  className="font-medium text-blue-700 transition hover:text-blue-800 hover:underline"
                >
                  Inventory
                </a>
                <span className="text-slate-300" aria-hidden>
                  /
                </span>
                <span className="font-medium text-slate-700">Details</span>
              </nav>

              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700 sm:mt-5">
                Car details
              </p>
              <h1 className="mt-2 max-w-xl text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl lg:text-2xl xl:max-w-2xl xl:text-3xl xl:leading-tight">
                {name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
                <p className="text-2xl font-semibold tabular-nums tracking-tight text-slate-900 sm:text-3xl">
                  {price}
                </p>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {year} · {fuelType}
                </span>
              </div>
            </div>

            {/* Right: larger photo */}
            <div className="lg:col-span-7">
              {image ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-100 to-slate-50 p-1.5 shadow-md shadow-slate-200/80 sm:p-2">
                  <img
                    src={image}
                    alt={name}
                    className="mx-auto block h-auto w-full max-h-[min(70vh,680px)] object-contain object-center lg:max-h-[min(82vh,820px)]"
                  />
                </div>
              ) : (
                <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100">
                  <p className="text-sm font-medium text-slate-500">No image from backend</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold text-slate-900">Vehicle Overview</h2>
              <p className="mt-3 max-w-3xl text-slate-600">{note}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {spec.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Quick Actions
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{name}</h3>
            <p className="mt-1 text-slate-600">{year} Model</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{price}</p>

            <div className="mt-6 space-y-3">
              <a
                href="/contact-us"
                className="block rounded-full bg-slate-900 px-6 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-black"
              >
                Contact Support
              </a>
              <a
                href="/inventory"
                className="block rounded-full border border-slate-300 bg-white px-6 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Back to Inventory
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Need a callback?</p>
              <p className="mt-1 text-sm text-slate-600">
                Share your interest and our team will connect with you quickly.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
