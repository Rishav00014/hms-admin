/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_API_BASE_URL:"https://api.hisecureexhibitions.com",
  },
  images: {
    domains: ["img.freepik.com"],
  },
};

export default nextConfig;
