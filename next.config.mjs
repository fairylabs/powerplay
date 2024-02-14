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
  webpack: (config) => {
    // Added due to bundling issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
};

export default nextConfig;
