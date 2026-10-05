/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    // Keep previews out of search without preventing crawlers from reading noindex.
    const isPreview =
      process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";
    return [
      {
        source: isPreview ? "/:path*" : "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/images/logo-transparent-small.png",
      },
    ];
  },
  async redirects() {
    return [
      { source: "/catalogo", destination: "/#catalogo", permanent: true },
    ];
  },
};
