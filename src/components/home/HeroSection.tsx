"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BaseSlide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  cta?: string;
}

interface ImageSlide extends BaseSlide {
  type: "image";
  image: string;
}

interface TextSlide extends BaseSlide {
  type: "text";
  accent: string;
}

type Slide = ImageSlide | TextSlide;

// ─── Data ─────────────────────────────────────────────────────────────────────
const slides: Slide[] = [
  {
    id: 1,
    type: "image",
    image: "https://i.ibb.co.com/mC13pWSQ/1771092473409-jpg.jpg",
    tag: "",
    title: "",
    subtitle: "",
    cta: "",
  },

  {
    id: 3,
    type: "image",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    tag: "TRENDING",
    title: "What's Hot Right Now",
    subtitle:
      "Stay ahead of the curve with our curated selection of trending products loved by thousands.",
    cta: "Explore Trends",
  },

  {
    id: 5,
    type: "image",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80",
    tag: "BESTSELLERS",
    title: "Customer Favorites",
    subtitle:
      "Products that speak for themselves. Rated 5 stars by thousands of happy customers.",
    cta: "See Bestsellers",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

/** Parent wrapper — staggers children sequentially */
const contentContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.3,
    },
  },
};

/** Individual child — fades up */
const fadeUp: Variants = {
  hidden: { y: 32, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/** Left accent bar */
const barVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── ImageSlide ───────────────────────────────────────────────────────────────
function SlideImage({ slide }: { slide: ImageSlide }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.img
        src={slide.image}
        alt={slide.title}
        initial={{ scale: 1.07 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
        className="w-full h-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(3,7,18,0.92) 0%, rgba(3,7,18,0.55) 55%, rgba(3,7,18,0.1) 100%)",
        }}
      />

      <div className="absolute inset-0 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {/* stagger parent */}
          <motion.div
            className="max-w-xl flex flex-col items-start"
            variants={contentContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-xs font-semibold tracking-widest text-indigo-400 mb-4 uppercase"
            >
              {slide.tag}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 leading-tight mb-5"
            >
              {slide.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-gray-400 font-light leading-relaxed mb-8"
            >
              {slide.subtitle}
            </motion.p>

            {slide?.cta && (
              <Link href="/products" passHref>
                <motion.button
                  variants={fadeUp}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-8 py-3 rounded-full text-sm font-semibold text-white cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                    boxShadow: "0 0 28px rgba(99,102,241,0.4)",
                  }}
                >
                  {slide.cta} →
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── TextSlide ────────────────────────────────────────────────────────────────
function SlideText({ slide }: { slide: TextSlide }) {
  return (
    <div
      className="relative w-full h-full flex items-center overflow-hidden"
      style={{ background: "#030712" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 65% 75% at 25% 50%, ${slide.accent}1a 0%, transparent 70%)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${slide.accent}80 1px, transparent 1px),
                            linear-gradient(90deg, ${slide.accent}80 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Left accent bar */}
      <motion.div
        variants={barVariants}
        initial="hidden"
        animate="visible"
        className="absolute left-0 top-1/4 w-1 rounded-r-full"
        style={{
          height: "50%",
          background: `linear-gradient(to bottom, transparent, ${slide.accent}, transparent)`,
          transformOrigin: "top",
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* stagger parent */}
        <motion.div
          className="max-w-2xl flex flex-col items-start"
          variants={contentContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block text-xs font-semibold tracking-widest mb-4 uppercase"
            style={{ color: slide.accent }}
          >
            {slide.tag}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-100 leading-tight mb-5"
          >
            {slide.title}
          </motion.h1>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            className="h-px w-16 mb-6"
            style={{
              background: `linear-gradient(to right, ${slide.accent}, transparent)`,
            }}
          />

          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg text-gray-400 font-light leading-relaxed mb-8"
          >
            {slide.subtitle}
          </motion.p>

          {slide.cta && (
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-3 rounded-full text-sm font-semibold text-white cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${slide.accent} 0%, ${slide.accent}cc 100%)`,
                boxShadow: `0 0 28px ${slide.accent}44`,
              }}
            >
              {slide.cta} →
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HeroSlider() {
  const [current, setCurrent] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [paused, setPaused] = useState<boolean>(false);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current],
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = slides[current];
  const accentColor =
    slide.type === "text" ? (slide as TextSlide).accent : "#6366f1";

  // Build direction-aware variants on each render
  const directedVariants: Variants = {
    enter: {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
    },
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(480px, 70vh, 680px)", background: "#030712" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slides ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={directedVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {slide.type === "image" ? (
            <SlideImage slide={slide as ImageSlide} />
          ) : (
            <SlideText slide={slide as TextSlide} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Slide counter ── */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-1.5 text-xs tracking-widest select-none pointer-events-none">
        <span className="text-gray-200 font-medium">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-gray-600">/</span>
        <span className="text-gray-600">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 bg-gray-950/70 text-gray-400 hover:bg-gray-800 hover:text-gray-100 backdrop-blur-sm transition-all duration-200 cursor-pointer"
      >
        ←
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 bg-gray-950/70 text-gray-400 hover:bg-gray-800 hover:text-gray-100 backdrop-blur-sm transition-all duration-200 cursor-pointer"
      >
        →
      </button>

      {/* ── Dots ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides?.map((s, i) => (
          <motion.button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            animate={{
              width: i === current ? 28 : 8,
              opacity: i === current ? 1 : 0.3,
              backgroundColor: i === current ? accentColor : "#6b7280",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-2 rounded-full border-none cursor-pointer p-0"
          />
        ))}
      </div>
    </section>
  );
}
