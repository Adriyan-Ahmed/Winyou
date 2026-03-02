"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductCard, {
  ProductCardData,
} from "@/components/products/ProductCard";

function getPaginationItems(
  current: number,
  total: number,
  siblings = 1,
): (number | "...")[] {
  // Total visible slots = siblings on each side + current + 2 edges + 2 ellipsis
  const totalSlots = siblings * 2 + 5;

  // If all pages fit, just return 1..total
  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  if (!showLeftDots && showRightDots) {
    // Near the start
    const leftItems = Array.from({ length: 3 + siblings * 2 }, (_, i) => i + 1);
    return [...leftItems, "...", total];
  }

  if (showLeftDots && !showRightDots) {
    // Near the end
    const rightItems = Array.from(
      { length: 3 + siblings * 2 },
      (_, i) => total - (3 + siblings * 2) + 1 + i,
    );
    return [1, "...", ...rightItems];
  }

  // Middle case — both dots
  const middleItems = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  );
  return [1, "...", ...middleItems, "...", total];
}

// ── Pagination component ──────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages, 1);

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10 flex-wrap"
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page items */}
      {items?.map((item, i) =>
        item === "..." ? (
          <span
            key={`dots-${i}`}
            className="flex items-center justify-center w-3 h-3 text-gray-600 text-xs md:text-sm select-none"
          >
            ···
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item as number)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`flex items-center justify-center w-8 h-8 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              item === page
                ? "text-white shadow-lg shadow-indigo-500/20"
                : "border border-gray-800 text-gray-500 hover:border-indigo-500/40 hover:text-gray-200 hover:bg-indigo-500/5"
            }`}
            style={
              item === page
                ? {
                    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  }
                : {}
            }
          >
            {item}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex items-center justify-center w-8 h-8 rounded-xl border border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Page info (mobile) */}
      <span className="w-full text-center text-xs text-gray-600 mt-1 sm:hidden">
        Page {page} of {totalPages}
      </span>
    </nav>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [onlyInStock, setOnlyInStock] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
      });
      if (onlyInStock) params.set("inStock", "true");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, onlyInStock]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Scroll to top on page change
  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Client-side search filter
  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${total} products found`}
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex items-center gap-2.5 flex-1 max-w-md px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/40 focus-within:border-indigo-500/40 transition-colors">
            <Search className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-600 hover:text-gray-400 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* In stock toggle */}
          <button
            onClick={() => {
              setOnlyInStock(!onlyInStock);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              onlyInStock
                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                : "border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-700 hover:text-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            In Stock Only
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-800/50 overflow-hidden"
                style={{ background: "#0f0f1a" }}
              >
                <div className="aspect-[4/3] bg-gray-800/40 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-3.5 rounded bg-gray-800/60 animate-pulse" />
                  <div className="h-3 rounded bg-gray-800/40 animate-pulse w-2/3" />
                  <div className="h-8 rounded-xl bg-gray-800/30 animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-600 text-base">No products found.</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* Pagination — hidden when searching client-side */}
            {!search && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
