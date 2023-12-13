/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_SERVER: 'https://timekeeping-api.onrender.com',
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
