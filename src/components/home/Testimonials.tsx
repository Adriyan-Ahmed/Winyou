"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
const testimonials = [
  {
    id: 1,
    name: "Mehedi Rahman",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 5,
    review:
      "Ordered a laptop backpack from Winyou me. Delivery was faster than expected and the quality matched the pictures perfectly. Will definitely order again.",
  },
  {
    id: 2,
    name: "Sadika Islam",
    image: "https://randomuser.me/api/portraits/women/52.jpg",
    rating: 5,
    review:
      "I was a bit hesitant at first, but the cash on delivery option made it easy. Product was original and well packed. Very satisfied with the service.",
  },
  {
    id: 3,
    name: "Rakib Hossain",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 4,
    review:
      "Customer support responded quickly when I had a size issue. The replacement process was smooth and hassle-free. Good experience overall.",
  },
  {
    id: 4,
    name: "Tasnia Ahmed",
    image: "https://randomuser.me/api/portraits/women/37.jpg",
    rating: 5,
    review:
      "Purchased a smartwatch recently. The product arrived in 3 days and works perfectly. Packaging was secure and professional.",
  },
  {
    id: 5,
    name: "Shahriar Kabir",
    image: "https://randomuser.me/api/portraits/men/83.jpg",
    rating: 5,
    review:
      "The website is easy to use and checkout process felt secure. I appreciate the fast delivery service in Dhaka. Highly recommended.",
  },
  {
    id: 6,
    name: "Nabila Karim",
    image: "https://randomuser.me/api/portraits/women/61.jpg",
    rating: 4,
    review:
      "Product quality is very good for the price. Delivery took 4 days outside Dhaka but everything was handled properly.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-10 ">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-3">
            Real reviews from happy buyers across Bangladesh.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-2xl border border-gray-800 bg-[#111827]"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-100 font-semibold">{t.name}</p>
                  <div className="flex text-yellow-400 text-xs">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                "{t.review}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
