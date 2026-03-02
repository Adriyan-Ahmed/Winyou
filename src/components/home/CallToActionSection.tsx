"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaBolt, FaShieldAlt, FaStar, FaTruck } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const stats = [
  {
    icon: <FaStar className="text-yellow-400" />,
    value: "4.9/5",
    label: "Customer Rating",
  },
  {
    icon: <FaTruck className="text-emerald-400" />,
    value: "Free",
    label: "Delivery ৳999+",
  },
  {
    icon: <FaShieldAlt className="text-indigo-400" />,
    value: "100%",
    label: "Secure Checkout",
  },
  {
    icon: <FaBolt className="text-orange-400" />,
    value: "50K+",
    label: "Happy Buyers",
  },
];

export default function CallToActionSection() {
  return (
    <section className="relative mt-10 mb-10 max-w-7xl mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl border border-gray-800 bg-[#0b0f1a]">
        <div className="relative z-10 px-6 py-14 sm:px-10 sm:py-16 md:px-16 md:py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6"
          >
            <HiSparkles className="text-sm" />
            New Collection Available
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl md:text-3xl  font-bold text-gray-100 leading-tight mb-5"
          >
            Experience Smarter Shopping with{" "}
            <span className="font-bold uppercase text-gray-200">
              {" "}
              <span className="text-amber-400">Win</span>you
              <span className=" text-amber-400 text-lg lowercase">.me</span>
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Discover premium products at competitive prices. Enjoy fast
            delivery, secure checkout, and exceptional customer satisfaction —
            all in one place.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <FaBolt />
              Browse Products
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-800 bg-[#111827]"
              >
                <span className="text-xl">{s.icon}</span>
                <div className="text-base font-bold text-gray-100">
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 text-center leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Fine Print */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="text-xs text-gray-600 mt-8"
          >
            Free registration · Secure payments · Fast nationwide delivery
          </motion.p>
        </div>
      </div>
    </section>
  );
}
