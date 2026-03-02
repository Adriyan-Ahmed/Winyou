"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  Loader2,
} from "lucide-react";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryZone: string;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setOrder(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080810" }}
      >
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-500/20"
            style={{
              background:
                "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-gray-500 text-sm">
            Thank you for your order. We&apos;ll get it to you soon!
          </p>

          {order && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-800 bg-gray-900/40 text-xs text-gray-500">
              <Package className="w-3.5 h-3.5" />
              Order ID:{" "}
              <span className="text-gray-300 font-mono">
                {order._id.slice(-8).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {order && (
          <div className="space-y-4">
            {/* Delivery Details */}
            <div
              className="rounded-2xl border border-gray-800/80 p-5"
              style={{ background: "#0d0d18" }}
            >
              <h2 className="text-sm font-bold text-gray-100 mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-400" />
                Delivery Details
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5 text-gray-400">
                  <User className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-start gap-2.5 text-gray-400">
                  <Phone className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>{order.phoneNumber}</span>
                </div>
                <div className="flex items-start gap-2.5 text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <span>{order.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      order.deliveryZone === "in_dhaka"
                        ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                        : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                    }`}
                  >
                    {order.deliveryZone === "in_dhaka"
                      ? "Inside Dhaka"
                      : "Outside Dhaka"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-500/10 border-yellow-500/20 text-yellow-400`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div
              className="rounded-2xl border border-gray-800/80 p-5"
              style={{ background: "#0d0d18" }}
            >
              <h2 className="text-sm font-bold text-gray-100 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                Items Ordered
              </h2>

              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs text-gray-600 font-mono w-5 text-right flex-shrink-0">
                        {item.quantity}×
                      </span>
                      <span className="text-gray-300 truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-gray-400 font-medium flex-shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-gray-800 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span
                    className={
                      order.shippingCharge === 0 ? "text-emerald-400" : ""
                    }
                  >
                    {order.shippingCharge === 0
                      ? "FREE"
                      : `৳${order.shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-100 pt-1">
                  <span>Total Paid</span>
                  <span>৳{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="flex-1 py-3 rounded-xl border border-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-all text-center cursor-pointer"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white text-center cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
