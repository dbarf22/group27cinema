// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: "http://localhost:8080/api/:path*" },
    ];
  },
  images: {
    // Option A: simple allowlist
    domains: ["m.media-amazon.com"],

    // OR Option B: more explicit patterns (use this if you have multiple CDNs)
    // remotePatterns: [
    //   { protocol: "https", hostname: "m.media-amazon.com" },
    // ],
  },
};

export default nextConfig;
