"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  PackageOpen,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Truck,
  Eye,
} from "lucide-react";
import ProductFormModal, {
  ProductFormData,
} from "@/components/admin/products/ProductFormModal";
import ProductDetailsModal from "@/components/admin/products/ProductDetailsModal";

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string[];
  isFreeShipping: boolean;
  description: { title?: string; content?: string }[];
  createdAt: string;
  updatedAt: string;
  uploadedBy: string;
}

const PAGE_SIZE = 10;

export default function ProductsManage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [detailsProduct, setDetailsProduct] = useState<IProduct | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotal(data.pagination.total);
      }
    } catch {
      showToast("Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  console.log("pro", products);

  // Client-side search filter
  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  const handleCreate = async (data: ProductFormData) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    showToast("Product created successfully!");
    fetchProducts();
  };

  const handleEdit = async (data: ProductFormData) => {
    if (!editingProduct) return;
    const res = await fetch(`/api/products/${editingProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    showToast("Product updated successfully!");
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast("Product deleted.");
      setDeleteId(null);
      fetchProducts();
    } catch {
      showToast("Failed to delete product", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEdit = (p: IProduct) => {
    setEditingProduct(p);
    setModalMode("edit");
    setModalOpen(true);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-100">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} products total</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setModalMode("create");
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/40 mb-4 max-w-sm">
        <Search className="w-4 h-4 text-gray-600 flex-shrink-0" />
        <input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSearch(e.target.value);
          }}
          placeholder="Search products..."
          className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
        />
      </div>

      {/* Table card */}
      <div
        className="rounded-2xl border border-gray-800/80 overflow-hidden"
        style={{ background: "#0d0d18" }}
      >
        {/* Scrollable table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-800/80">
                {[
                  "Product",
                  "Price",
                  "Stock",
                  "Shipping",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 rounded bg-gray-800/50 animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <PackageOpen className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      {search
                        ? "No products match your search."
                        : "No products yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered?.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-800/20 transition-colors"
                  >
                    {/* Product */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-800">
                          {p?.productImage[0] ? (
                            <Image
                              src={p.productImage[0]}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <PackageOpen className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate max-w-[180px]">
                            {p?.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-200">
                        ৳{p?.price?.toLocaleString()}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex truncate items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.quantity === 0
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : p.quantity <= 5
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {p.quantity === 0
                          ? "Out of stock"
                          : `${p.quantity} in stock`}
                      </span>
                    </td>

                    {/* Shipping */}
                    <td className="px-4 py-3.5">
                      {p.isFreeShipping ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                          <Truck className="w-3.5 h-3.5" /> Free
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">Paid</span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs truncate text-gray-500">
                        {p.createdAt
                          ? new Date(String(p.createdAt)).toLocaleDateString(
                              "en-BD",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetailsProduct(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800/60">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === "create" ? handleCreate : handleEdit}
        mode={modalMode}
        initialData={
          editingProduct
            ? {
                name: editingProduct.name,
                description: editingProduct.description.length
                  ? editingProduct.description.map((d) => ({
                      title: d.title || "",
                      content: d.content || "",
                    }))
                  : [{ title: "", content: "" }],
                productImage: editingProduct.productImage.length
                  ? editingProduct.productImage
                  : [""],
                price: editingProduct.price,
                quantity: editingProduct.quantity,
                isFreeShipping: editingProduct.isFreeShipping,
              }
            : null
        }
      />

      {detailsProduct && (
        <ProductDetailsModal
          product={detailsProduct}
          onClose={() => setDetailsProduct(null)}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-2xl border border-gray-800 p-6"
            style={{ background: "#0d0d18" }}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-base font-bold text-gray-100 text-center mb-2">
              Delete Product?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
