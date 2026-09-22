"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";

const NAV_ITEMS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Hide the bar while scrolling down, reveal it when scrolling back up.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (open) return;
    if (latest > 240 && latest > prev) setHidden(true);
    else setHidden(false);
  });

  // Sync the toggle with the theme applied by the inline script in layout.tsx
  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage may be unavailable */
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -80 : 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80"
    >      <nav
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 sm:px-8"
        aria-label="Main navigation"
      >
        <a
          href="#hero"
          className="font-mono text-sm font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <span className="text-accent">{"//"}</span> {profile.username}
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav-link group relative">
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {mounted ? (dark ? "☀️" : "🌙") : "🌙"}
          </button>

          <a
            href={profile.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden h-9 px-4 text-xs sm:inline-flex"
          >
            GitHub
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-200"
          >
            ☰
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-1 overflow-hidden border-t border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950 md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-2 nav-link"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
