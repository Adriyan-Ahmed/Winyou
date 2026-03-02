"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Minus,
  Plus,
  Loader2,
  PackageOpen,
  Zap,
} from "lucide-react";
import ImageSlider from "@/components/products/ImageSlider";
import { useCart } from "@/context/CartContext ";
import StarRating from "@/components/reviewsSection/StarRating";
import ReviewsPage from "@/components/reviewsSection/ReviewsPage";
import { REVIEWS } from "@/components/reviewsSection/REVIEWS";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string[];
  isFreeShipping: boolean;
  description: { title?: string; content?: string }[];
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, items, updateQuantity, isInCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);

  const cartItem = items.find((i) => i.productId === id);
  const inCart = isInCart(id);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProduct(data.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (inCart) {
      updateQuantity(
        product._id,
        Math.min((cartItem?.quantity || 1) + qty, product.quantity),
      );
    } else {
      for (let i = 0; i < qty; i++) {
        addToCart({
          productId: product._id,
          name: product.name,
          image: product.productImage[0] || "",
          price: product.price,
          maxQuantity: product.quantity,
          isFreeShipping: product.isFreeShipping,
        });
      }
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    sessionStorage.setItem(
      "buyNowItem",
      JSON.stringify({
        productId: product._id,
        name: product.name,
        image: product.productImage[0] || "",
        price: product.price,
        quantity: qty,
        maxQuantity: product.quantity,
        isFreeShipping: product.isFreeShipping,
      }),
    );
    router.push("/checkout?mode=buyNow");
  };

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

  if (notFound || !product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#080810" }}
      >
        <PackageOpen className="w-16 h-16 text-gray-700" />
        <p className="text-gray-500">Product not found.</p>
        <button
          onClick={() => router.push("/products")}
          className="text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 mb-6 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ImageSlider images={product.productImage} alt={product.name} />

          <div className="flex flex-col gap-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
              {product.name}
            </h1>

            {/* Inline rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={5} />
              <span className="text-xs text-gray-500">
                4.8 · {REVIEWS.length} reviews
              </span>
            </div>

            <span className="text-3xl font-bold text-gray-100">
              ৳{product.price.toLocaleString()}
            </span>

            <div className="flex flex-wrap gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isOutOfStock
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : product.quantity <= 5
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isOutOfStock ? "Out of Stock" : `${product.quantity} in stock`}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  product.isFreeShipping
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-gray-800/60 border-gray-700 text-gray-500"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                {product.isFreeShipping ? "Free Shipping" : "Shipping charged"}
              </span>
            </div>

            <div className="h-px bg-gray-800" />

            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Quantity</span>
                <div className="flex items-center border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-gray-200">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty((q) => Math.min(product.quantity, q + 1))
                    }
                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${
                  isOutOfStock
                    ? "bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed"
                    : inCart
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
                      : "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-gray-100 hover:bg-gray-800/40"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock
                  ? "Out of Stock"
                  : inCart
                    ? "Added ✓"
                    : "Add to Cart"}
              </button>
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer hover:shadow-lg hover:shadow-indigo-500/25"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  }}
                >
                  <Zap className="w-4 h-4" /> Buy Now
                </button>
              )}
            </div>

            <div
              className="p-4 rounded-xl border border-gray-800 text-sm text-gray-500"
              style={{ background: "#0a0a14" }}
            >
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-600" />
                <span>
                  {product.isFreeShipping
                    ? "Free delivery on this product"
                    : "In Dhaka: ৳70 · Outside Dhaka: ৳130"}
                </span>
              </div>
            </div>

            {product.description?.filter((d) => d.title || d.content).length >
              0 && (
              <div className="space-y-4">
                <div className="h-px bg-gray-800" />
                {product.description
                  .filter((d) => d.title || d.content)
                  .map((desc, i) => (
                    <div key={i}>
                      {desc.title && (
                        <h3 className="text-sm font-semibold text-gray-200 mb-1.5">
                          {desc.title}
                        </h3>
                      )}
                      {desc.content && (
                        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                          {desc.content}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <ReviewsPage />
      </div>
    </div>
  );
}
