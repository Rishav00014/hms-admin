/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_API_BASE_URL: process.env.BACKEND_API_BASE_URL,
  },
  images: {
    domains: ["img.freepik.com"],
  },
};

export default nextConfig;
