import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { profile } from "@/lib/profile";
import AmbientBackground from "@/components/motion/AmbientBackground";
import ScrollProgress from "@/components/motion/ScrollProgress";
import TopologyBackground from "@/components/motion/TopologyBackground";

// profile.avatar is site-absolute ("/Portfolio-Website/avatar.png"). Next.js
// prepends basePath to relative metadata image URLs and then resolves them
// against metadataBase, which would double the prefix and 404 in link previews.
// A full absolute URL is used verbatim instead.
const avatarUrl = `${profile.siteUrl}${profile.avatar}`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://monarchsharma20502.github.io/Portfolio-Website"),
  title: `${profile.name} — ${profile.role}`,
  description: profile.headline,
  keywords: [
    profile.name,
    profile.role,
    "DevOps",
    "Cloud",
    "Azure",
    "Kubernetes",
    "Terraform",
    "CI/CD",
    "Portfolio",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: profile.siteUrl,
    title: `${profile.name} — ${profile.role}`,
    description: profile.headline,
    siteName: `${profile.name} Portfolio`,
    // profile.avatar is site-absolute ("/Portfolio-Website/avatar.png"). Next.js
    // prepends basePath to relative metadata URLs and then resolves them against
    // metadataBase, which would double the prefix and 404 in link previews.
    // Building a full absolute URL makes Next use it verbatim instead.
    images: [{ url: avatarUrl }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.headline,
    images: [avatarUrl],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    image: avatarUrl,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
      addressCountry: "IN",
    },
    worksFor: { "@type": "Organization", name: profile.company },
    sameAs: [profile.github.url, profile.linkedin.url],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // Set the theme before paint to avoid a flash of the wrong theme
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`}
      >
        <MotionConfig reducedMotion="user">
          <ScrollProgress />
          <AmbientBackground />
          <TopologyBackground />
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
