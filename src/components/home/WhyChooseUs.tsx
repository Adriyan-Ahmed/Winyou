"use client";

import { motion } from "framer-motion";
import {
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaMoneyBillWave,
  FaUndoAlt,
} from "react-icons/fa";

const trustData = [
  {
    id: 1,
    icon: "truck",
    title: "Fast Nationwide Delivery",
    description:
      "We deliver across Bangladesh within 2–4 business days with real-time order tracking.",
  },
  {
    id: 2,
    icon: "shield",
    title: "Secure Payment System",
    description:
      "All payments are protected with SSL encryption and trusted payment gateways.",
  },
  {
    id: 3,
    icon: "support",
    title: "Dedicated Customer Support",
    description:
      "Our support team responds within minutes via chat and phone during business hours.",
  },
  {
    id: 4,
    icon: "cod",
    title: "Cash on Delivery Available",
    description:
      "Shop confidently and pay after receiving your order at your doorstep.",
  },
  {
    id: 5,
    icon: "return",
    title: "7-Day Easy Return Policy",
    description:
      "If you receive a damaged or incorrect product, we ensure quick replacement or refund.",
  },
  {
    id: 6,
    icon: "verified",
    title: "Quality Checked Products",
    description:
      "Every item goes through manual quality inspection before shipping to ensure satisfaction.",
  },
];

const iconMap: any = {
  truck: <FaTruck />,
  shield: <FaShieldAlt />,
  support: <FaHeadset />,
  cod: <FaMoneyBillWave />,
  return: <FaUndoAlt />,
  verified: <FaShieldAlt className="text-green-500" />,
};

export default function WhyChooseUs() {
  return (
    <section className="py-10 bg-[#080810]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100">
            Why Choose{" "}
            <span className=" font-bold uppercase text-gray-200">
              {" "}
              <span className="text-amber-400">Win</span>you
              <span className=" text-amber-400 text-lg lowercase">.me</span>
            </span>
          </h2>
          <p className="text-gray-500 mt-3">
            We ensure the best shopping experience for our customers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustData.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-2xl border border-gray-800 bg-[#0d0d18] hover:border-indigo-500/40 transition"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-500 text-xl mb-4">
                {iconMap[item.icon]}
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
