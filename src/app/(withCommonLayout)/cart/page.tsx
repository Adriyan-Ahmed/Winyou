"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext ";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } =
    useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5 text-center px-4"
        style={{ background: "#080810" }}
      >
        <div
          className="w-20 h-20 rounded-2xl border border-gray-800 flex items-center justify-center"
          style={{ background: "#0d0d18" }}
        >
          <ShoppingBag className="w-9 h-9 text-gray-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-200 mb-1">
            Your cart is empty
          </h2>
          <p className="text-sm text-gray-600">
            Add items from the shop to get started
          </p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-100">Your Cart</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Items list ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-2xl border border-gray-800/80"
                style={{ background: "#0d0d18" }}
              >
                {/* Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border border-gray-800">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-sm font-semibold text-gray-200 hover:text-indigo-300 transition-colors line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-bold text-gray-100">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <div
            className="rounded-2xl border border-gray-800/80 p-5 h-fit sticky top-20"
            style={{ background: "#0d0d18" }}
          >
            <h2 className="text-sm font-bold text-gray-100 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-gray-200 font-medium">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-xs text-gray-600">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="h-px bg-gray-800 my-4" />

            <div className="flex justify-between text-base font-bold text-gray-100 mb-5">
              <span>Subtotal</span>
              <span>৳{subtotal.toLocaleString()}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/20"
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              }}
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/products"
              className="block text-center text-xs text-gray-600 hover:text-gray-400 transition-colors mt-3 cursor-pointer"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
