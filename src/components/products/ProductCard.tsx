"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext ";

export interface ProductCardData {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string[];
  isFreeShipping: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const isOutOfStock = product.quantity === 0;
  const inCart = isInCart(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.productImage[0] || "",
      price: product.price,
      maxQuantity: product.quantity,
      isFreeShipping: product.isFreeShipping,
    });
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        isOutOfStock
          ? "border-gray-800/40 opacity-70"
          : "border-gray-800/70 hover:border-indigo-500/30"
      }`}
      style={{ background: "#0f0f1a" }}
    >
      {/* ── Image ── */}
      <Link
        href={`/products/${product?._id}`}
        className="relative block overflow-hidden aspect-[4/3]"
      >
        <Image
          src={product?.productImage[0] || "/placeholder.png"}
          alt={product?.name || "Product Image"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-red-500/40 bg-red-500/10 text-red-400">
              Out of Stock
            </span>
          </div>
        )}

        {/* Free shipping badge */}
        {product.isFreeShipping && !isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            Free Delivery
          </span>
        )}

        {/* Quick view on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-gray-600 text-gray-200 text-xs backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </span>
        </div>
      </Link>

      {/* ── Details ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <Link href={`/products/${product?._id}`}>
          <h3 className="text-sm font-semibold text-gray-200 line-clamp-2 leading-snug hover:text-indigo-300 transition-colors">
            {product?.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-bold text-gray-100">
            ৳{product?.price?.toLocaleString()}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                : inCart
                  ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/20"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {inCart ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
