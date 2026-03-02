"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string[];
}

export default function HomeProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=12&inStock=true");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-[#080810]">
      <div className="max-w-7xl mx-auto  md:px-4">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100">
            Featured
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Discover our latest in-stock products
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-800/40 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
              {products?.map((product) => (
                <Link href={`/products/${product._id}`}>
                  <div
                    key={product._id}
                    className="group rounded-2xl border border-gray-800 bg-[#0d0d18] overflow-hidden transition hover:border-indigo-500/40"
                  >
                    {/* Image */}
                    <div className="relative w-full h-36 md:h-44 overflow-hidden">
                      <Image
                        src={product?.productImage[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-2 md:p-3">
                      <h3 className="text-sm font-medium text-gray-200 truncate">
                        {product.name}
                      </h3>

                      <p className="text-indigo-400 font-semibold mt-1 text-sm">
                        ৳{product?.price?.toLocaleString()}
                      </p>

                      <Link
                        href={`/products/${product._id}`}
                        className="mt-4 inline-flex items-center justify-center gap-2 w-full px-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-block px-8 py-3 rounded-full border border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white transition text-sm font-semibold"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
