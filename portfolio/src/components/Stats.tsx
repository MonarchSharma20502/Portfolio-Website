"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/profile";
import { staggerContainer, viewportOnce } from "@/lib/motion";
import Reveal from "./Reveal";
import Counter from "./motion/Counter";

export default function Stats() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && reduceMotion;
  const items = [
    { label: "Public repositories", value: profile.stats.publicRepos },
    { label: "GitHub followers", value: profile.stats.followers },
    { label: "Following", value: profile.stats.following },
    {
      label: "Contributions in the last year",
      value: profile.stats.contributionsLastYear,
    },
  ] as const;

  return (
    <section id="stats" className="section py-12">
      <motion.ul
        variants={reduce ? undefined : staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {items.map((item) => (
          <motion.li
            key={item.label}
            variants={
              reduce
                ? undefined
                : {
                    hidden: { opacity: 0, y: 16, scale: 0.96 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }
            }
            whileHover={reduce ? undefined : { y: -4 }}
            className="card text-center"
          >
            <p className="font-mono text-3xl font-bold text-accent">
              <Counter value={item.value} />
            </p>
            <p className="mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
              {item.label}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
