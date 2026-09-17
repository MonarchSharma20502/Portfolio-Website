/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted on GitHub Pages with no server.
  output: "export",
  images: {
    // Next.js Image optimization requires a server, so it is disabled for the
    // static export. The avatar is served directly from /public instead.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
