/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "http",
      },
      {
        hostname: "*",
        protocol: "https",
      },
    ],
  },
  rewrites: async () => {
    if (!process.env.ENABLE_DEBUG) {
      return [
        {
          source: "/debug/:path*",
          destination: "/",
        },
      ];
    }

    return [];
  },
};

export default nextConfig;
