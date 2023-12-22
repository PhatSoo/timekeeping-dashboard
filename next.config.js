/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // API_SERVER: 'https://timekeeping-api.onrender.com',
    API_SERVER: 'http://localhost:3000',
    API_SERVER2: 'http://localhost:8000',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
