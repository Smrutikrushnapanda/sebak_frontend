/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // These pages import dozens of icons from the react-icons barrel; without this
    // the whole icon set is pulled into every route that touches it.
    optimizePackageImports: ['react-icons', 'react-icons/lu', 'react-icons/hi2'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
