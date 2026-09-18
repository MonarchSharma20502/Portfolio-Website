/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "Portfolio-Website";

const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be hosted on GitHub Pages with no server.
  output: "export",
  // GitHub Pages serves project sites from https://<user>.github.io/<repo>,
  // so production asset URLs must be prefixed with the repo name. Without
  // this, every /_next/... and /avatar.png request 404s and the site loads
  // with no CSS, JS or images.
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
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
