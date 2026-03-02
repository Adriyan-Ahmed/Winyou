"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Phone, User, Truck, Loader2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext ";

type DeliveryZone = "in_dhaka" | "out_dhaka";

const SHIPPING_CHARGES: Record<DeliveryZone, number> = {
  in_dhaka: 70,
  out_dhaka: 130,
};

interface CheckoutItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  isFreeShipping: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buyNow";

  const {
    items: cartItems,
    subtotal: cartSubtotal,
    totalItems: cartTotalItems,
    updateQuantity: cartUpdateQuantity,
    clearCart,
  } = useCart();

  // ── Buy Now: read from sessionStorage ────────────────────────────────────────
  const [buyNowItem, setBuyNowItem] = useState<CheckoutItem | null>(null);

  useEffect(() => {
    if (isBuyNow) {
      try {
        const raw = sessionStorage.getItem("buyNowItem");
        if (raw) setBuyNowItem(JSON.parse(raw));
        else router.replace("/products"); // no item → redirect
      } catch {
        router.replace("/products");
      }
    }
  }, [isBuyNow, router]);

  // ── Unified item list ─────────────────────────────────────────────────────────
  const items: CheckoutItem[] = isBuyNow
    ? buyNowItem
      ? [buyNowItem]
      : []
    : cartItems;

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // ── Buy Now qty update (local only) ──────────────────────────────────────────
  const updateBuyNowQty = (qty: number) => {
    if (!buyNowItem) return;
    const clamped = Math.max(1, Math.min(qty, buyNowItem.maxQuantity));
    const updated = { ...buyNowItem, quantity: clamped };
    setBuyNowItem(updated);
    sessionStorage.setItem("buyNowItem", JSON.stringify(updated));
  };

  const updateQty = (productId: string, qty: number) => {
    if (isBuyNow) {
      updateBuyNowQty(qty);
    } else {
      cartUpdateQuantity(productId, qty);
    }
  };

  // ── Form ──────────────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    address: "",
    deliveryZone: "in_dhaka" as DeliveryZone,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const allFreeShipping = items.every((i) => i.isFreeShipping);
  const shippingCharge = allFreeShipping
    ? 0
    : SHIPPING_CHARGES[form.deliveryZone];
  const totalAmount = subtotal + shippingCharge;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^(\+880|880|0)?1[3-9]\d{8}$/.test(form.phoneNumber.trim()))
      e.phoneNumber = "Enter a valid Bangladeshi phone number";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate() || items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Order failed");

      // Cleanup
      if (isBuyNow) {
        sessionStorage.removeItem("buyNowItem");
      } else {
        clearCart();
      }

      router.push(`/order-success?orderId=${data.data._id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  // ── Empty state ───────────────────────────────────────────────────────────────
  if (isBuyNow && !buyNowItem) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080810" }}
      >
        <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!isBuyNow && cartItems.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#080810" }}
      >
        <p className="text-gray-500">Your cart is empty.</p>
        <button
          onClick={() => router.push("/products")}
          className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer"
        >
          ← Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-gray-100">Checkout</h1>
          {isBuyNow && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
              Buy Now
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-3 space-y-5">
            {/* Delivery Info */}
            <div
              className="rounded-2xl border border-gray-800/80 p-5"
              style={{ background: "#0d0d18" }}
            >
              <h2 className="text-sm font-bold text-gray-100 mb-4">
                Delivery Information
              </h2>
              <div className="space-y-4">
                {/* Name */}
                <FormField
                  label="Full Name"
                  icon={<User className="w-4 h-4" />}
                  error={errors.customerName}
                >
                  <input
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    placeholder="Your full name"
                    className={inputCls(errors.customerName)}
                  />
                </FormField>

                {/* Phone */}
                <FormField
                  label="Phone Number"
                  icon={<Phone className="w-4 h-4" />}
                  error={errors.phoneNumber}
                >
                  <input
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className={inputCls(errors.phoneNumber)}
                  />
                </FormField>

                {/* Address */}
                <FormField
                  label="Delivery Address"
                  icon={<MapPin className="w-4 h-4" />}
                  error={errors.address}
                >
                  <textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="House/Flat, Road, Area, City"
                    rows={3}
                    className={`${inputCls(errors.address)} resize-none`}
                  />
                </FormField>

                {/* Delivery Zone */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Delivery Zone
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {(["in_dhaka", "out_dhaka"] as DeliveryZone[]).map(
                      (zone) => (
                        <button
                          key={zone}
                          type="button"
                          onClick={() =>
                            setForm({ ...form, deliveryZone: zone })
                          }
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left ${
                            form.deliveryZone === zone
                              ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                              : "border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.deliveryZone === zone ? "border-indigo-400" : "border-gray-700"}`}
                          >
                            {form.deliveryZone === zone && (
                              <div className="w-2 h-2 rounded-full bg-indigo-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {zone === "in_dhaka"
                                ? "Inside Dhaka"
                                : "Outside Dhaka"}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {allFreeShipping
                                ? "Free"
                                : `৳${SHIPPING_CHARGES[zone]} shipping`}
                            </div>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div
              className="rounded-2xl border border-gray-800/80 p-5"
              style={{ background: "#0d0d18" }}
            >
              <h2 className="text-sm font-bold text-gray-100 mb-4">
                Order Items ({totalItems})
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-800 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-300 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        ৳{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-gray-800 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-gray-800 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-gray-200 w-16 text-right">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl border border-gray-800/80 p-5 sticky top-20"
              style={{ background: "#0d0d18" }}
            >
              <h2 className="text-sm font-bold text-gray-100 mb-4">
                Price Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-200">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Shipping
                  </span>
                  <span
                    className={
                      shippingCharge === 0
                        ? "text-emerald-400 font-medium"
                        : "text-gray-200"
                    }
                  >
                    {shippingCharge === 0 ? "FREE" : `৳${shippingCharge}`}
                  </span>
                </div>
                {!allFreeShipping && (
                  <p className="text-xs text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {form.deliveryZone === "in_dhaka"
                      ? "Inside Dhaka delivery"
                      : "Outside Dhaka delivery"}
                  </p>
                )}
              </div>

              <div className="h-px bg-gray-800 my-4" />

              <div className="flex justify-between font-bold text-base text-gray-100 mb-5">
                <span>Total</span>
                <span>৳{totalAmount.toLocaleString()}</span>
              </div>

              {errors.submit && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {errors.submit}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p className="text-center text-xs text-gray-700 mt-3">
                Cash on Delivery · Secure & Safe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function FormField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {icon && <span className="text-gray-600">{icon}</span>}
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors ${
    error
      ? "border-red-500/50 focus:border-red-500 bg-red-500/5"
      : "border-gray-800 focus:border-indigo-500 bg-gray-900/50"
  }`;
}
