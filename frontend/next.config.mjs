/** @type {import('next').NextConfig} */
const backendOrigin = process.env.BACKEND_ORIGIN?.trim().replace(/\/$/, "");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  /**
   * Optional: set BACKEND_ORIGIN on the *frontend* Vercel project to your real API host
   * (e.g. https://your-api.vercel.app). Then browser can use same-origin /api and /uploads
   * while Next proxies to the backend — fixes deploy when DB still has /uploads paths.
   */
  async rewrites() {
    if (!backendOrigin) return [];
    return [
      { source: "/api/:path*", destination: `${backendOrigin}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backendOrigin}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
