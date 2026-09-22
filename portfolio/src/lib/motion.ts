import type { Variants } from "framer-motion";

/**
 * Shared motion language for the site.
 *
 * One easing curve, one set of durations, one set of variants — so every
 * animated element feels like it belongs to the same product.
 *
 * Animate transform/opacity only. Never width/height/top/left.
 */

/** Signature easing: natural, slightly cinematic. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** No-op variant.
 *
 * IMPORTANT: use this instead of `undefined` when disabling motion for
 * reduced-motion users. With `undefined`, Framer Motion still honours
 * `initial="hidden"` and bakes `opacity:0` into the SSR HTML as an inline
 * style — which then never gets removed because there is no variant to
 * animate to. Inline styles beat CSS classes, so the content stays
 * invisible forever. An explicit empty variant renders at full opacity. */
export const none: Variants = {
  hidden: {},
  visible: {},
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE } },
};

/** Parent that staggers its children's entrance. */
export const staggerContainer = (stagger = 0.08, delay = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Standard viewport config: animate once, slightly before fully in view. */
export const viewportOnce = { once: true, margin: "-12% 0px" } as const;
