"use client";

import Image from "next/image";
import { X, Truck, PackageOpen, Calendar, User } from "lucide-react";
import { useState } from "react";
import { IProduct } from "./ProductsManage";

export default function ProductDetailsModal({
  product,
  onClose,
}: {
  product: IProduct;
  onClose: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl border border-gray-800 shadow-2xl flex flex-col"
        style={{ background: "#0d0d18" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-bold text-gray-100">Product Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-800">
                {product?.productImage[selectedImage] ? (
                  <Image
                    src={product?.productImage[selectedImage]}
                    alt={product?.name || "Product image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <PackageOpen className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>

              {product?.productImage?.length &&
                product?.productImage?.length > 1 && (
                  <div className="flex gap-3">
                    {product?.productImage?.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border ${
                          selectedImage === i
                            ? "border-indigo-500"
                            : "border-gray-800"
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-100">
                  {product.name}
                </h1>
                <p className="text-indigo-400 text-lg font-semibold mt-2">
                  ৳{product.price.toLocaleString()}
                </p>
              </div>

              {/* Stock */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  product.quantity === 0
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : product.quantity <= 5
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {product.quantity === 0
                  ? "Out of stock"
                  : `${product.quantity} available`}
              </span>

              {/* Shipping */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Truck className="w-4 h-4" />
                {product.isFreeShipping ? "Free Shipping" : "Paid Shipping"}
              </div>

              {/* Meta */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Uploaded by {product?.uploadedBy}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(product.createdAt).toLocaleDateString("en-BD", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product?.description?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Product Description
              </h3>

              {product.description.map((d, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-800 p-4"
                  style={{ background: "#0a0a14" }}
                >
                  {d.title && (
                    <h4 className="text-sm font-semibold text-indigo-400 mb-1">
                      {d.title}
                    </h4>
                  )}
                  {d.content && (
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {d.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
