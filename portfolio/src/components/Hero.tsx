"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense } from "react";
import { useRef } from "react";
import { profile } from "@/lib/profile";
import { EASE } from "@/lib/motion";
import CursorGlow from "./motion/CursorGlow";
import Magnetic from "./motion/Magnetic";

// The whole WebGL subtree (three.js + shaders) is loaded with React lazy()
// rather than next/dynamic: next/dynamic preloads its chunk in the page's
// initial script set, which would put ~970KB of three.js on the first
// request. lazy() fetches it only when the component actually renders.
const HeroScene = lazy(() => import("./three/HeroScene"));

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

// Words of the name rise from behind a mask edge, one at a time.
const wordVariant = {
  hidden: { y: "115%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll choreography: the hero parts the way as you scroll into the page.
  const yAvatar = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blobScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const name = profile.name.split(" ");

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-16 sm:px-8"
    >
      <CursorGlow />

      {/* WebGL layer: a distortion orb inside a particle cloud, stage-left
          so it never sits under the headline. Turns and dollies on scroll. */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Decorative animated background blobs */}
      <motion.div
        style={{ scale: blobScale }}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-blob dark:bg-accent/10" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl animate-blob dark:bg-indigo-500/10 [animation-delay:3s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl animate-blob dark:bg-emerald-500/10 [animation-delay:6s]" />
      </motion.div>

      <motion.div
        style={{ opacity: heroOpacity }}
        className="mx-auto grid w-full max-w-5xl items-center gap-12 py-20 md:grid-cols-[1.4fr_1fr]"
      >
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p
            variants={wordVariant}
            className="font-mono text-sm font-medium text-accent"
          >
            {profile.role}
          </motion.p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {/* Each word rises from behind a mask edge */}
            <span className="flex flex-wrap gap-x-4">
              {name.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
                  <motion.span variants={wordVariant} className="inline-block">
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            variants={wordVariant}
            className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            variants={wordVariant}
            className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
          >
            <span aria-hidden="true">📍</span>
            {profile.location}
            {profile.hireable && (
              <span className="chip ml-2 border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                Open to opportunities
              </span>
            )}
          </motion.p>

          <motion.div variants={wordVariant} className="mt-8 flex flex-wrap gap-3">
            <Magnetic strength={0.4}>
              <a href="#contact" className="btn-primary">
                Get in touch
              </a>
            </Magnetic>
            <Magnetic strength={0.4}>
              <a
                href={profile.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                View GitHub →
              </a>
            </Magnetic>
          </motion.div>

          <motion.div variants={wordVariant} className="mt-8 flex items-center gap-5">
            <a
              href={profile.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-slate-500 transition hover:text-accent dark:text-slate-400"
            >
              <GitHubIcon />
            </a>
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-slate-500 transition hover:text-accent dark:text-slate-400"
            >
              <LinkedInIcon />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Send email"
              className="text-slate-500 transition hover:text-accent dark:text-slate-400"
            >
              <MailIcon />
            </a>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: yAvatar }} className="flex justify-center md:justify-end">
          <TiltAvatar />
        </motion.div>
      </motion.div>

      <ScrollCue />
    </section>
  );
}

/** Avatar with a pointer-tracking 3D tilt, layered depth and an animated gradient ring. */
function TiltAvatar() {
  return (
    <div className="relative" style={{ perspective: "900px" }}>
      <motion.div
        className="absolute -inset-3 rounded-full bg-gradient-to-tr from-accent via-indigo-400 to-emerald-400 opacity-70 blur-2xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Orbiting accent ring — real 3D, tilted in perspective */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30 sm:h-[21rem] sm:w-[21rem]"
          style={{ transform: "translate(-50%, -50%) rotateX(72deg) translateZ(40px)" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar}
          alt={`Portrait of ${profile.name}`}
          width={224}
          height={224}
          className="relative h-48 w-48 rounded-full border-4 border-white object-cover shadow-xl dark:border-slate-900 sm:h-56 sm:w-56"
          style={{ transform: "translateZ(26px)" }}
        />
      </motion.div>
    </div>
  );
}

/** A subtle bouncing cue at the bottom of the hero inviting the visitor down. */
function ScrollCue() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
        Scroll
      </span>
      <span className="relative flex h-9 w-5 justify-center rounded-full border border-slate-300 dark:border-slate-700">
        <motion.span
          className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        />
      </span>
    </motion.div>
  );
}

function GitHubIcon() {
  return (
    <svg
      role="img"
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.1 4.7 18.1 5 18.1 5c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      role="img"
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      role="img"
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="4.8" width="19" height="14.4" rx="2" />
      <path d="m3 6.5 9 6.2 9-6.2" />
    </svg>
  );
}
