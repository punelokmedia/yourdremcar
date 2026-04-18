/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Add your deployed API host if you serve car images from the backend, e.g.:
      // { protocol: "https", hostname: "your-backend.vercel.app", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
