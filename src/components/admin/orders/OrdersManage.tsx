"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Package,
  CheckCircle2,
  XCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";
import StatusSelector from "./StatusSelector";
import OrderDetailModal from "./OrderDetailModal";

// ── Types ─────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "follow_up"
  | "confirmed"
  | "cancelled"
  | "returned";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  isFreeShipping: boolean;
}

export interface Order {
  _id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryZone: "in_dhaka" | "out_dhaka";
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// ── Status config ─────────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/25",
  },
  follow_up: {
    label: "Follow Up",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/25",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/25",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/25",
  },
  returned: {
    label: "Returned",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/25",
  },
};

export const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];
const PAGE_SIZE = 10;

// ── Main Page
export default function OrdersManage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?page=${page}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } catch {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o)),
      );
      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
      showToast(`Status updated to "${STATUS_CONFIG[status].label}"`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update status";
      showToast(msg, "error");
    }
  };

  // Client-side filters
  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phoneNumber.includes(search) ||
      o._id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium transition-all ${
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-100">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} orders total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="flex items-center gap-2.5 flex-1 max-w-sm px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/40 focus-within:border-indigo-500/40 transition-colors">
          <Search className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, ID..."
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-600 hover:text-gray-400 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {(["all", ...ALL_STATUSES] as const).map((s) => {
            const isActive = statusFilter === s;
            const cfg = s !== "all" ? STATUS_CONFIG[s] : null;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? cfg
                      ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                      : "bg-indigo-500/10 text-indigo-300 border-indigo-500/25"
                    : "border-gray-800 text-gray-600 hover:border-gray-700 hover:text-gray-400"
                }`}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border border-gray-800/80 overflow-hidden"
        style={{ background: "#0d0d18" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-800/80">
                {[
                  "Order ID",
                  "Customer",
                  "Items",
                  "Total",
                  "Zone",
                  "Date",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                Array?.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array?.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-4 rounded bg-gray-800/50 animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16  text-center">
                    <Package className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No orders found.</p>
                  </td>
                </tr>
              ) : (
                filtered?.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-800/20 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono text-gray-500">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-200 max-w-[130px] truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {order.phoneNumber}
                      </p>
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3.5">
                      <div className="flex truncate items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-gray-600" />
                        <span className="text-sm text-gray-400">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm truncate font-semibold text-gray-200">
                        ৳{order?.totalAmount?.toLocaleString()}
                      </span>
                      {order.shippingCharge === 0 && (
                        <p className="text-[10px] text-emerald-500 mt-0.5">
                          Free ship
                        </p>
                      )}
                    </td>

                    {/* Zone */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs truncate text-gray-500">
                        {order.deliveryZone === "in_dhaka"
                          ? "In Dhaka"
                          : "Out Dhaka"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-BD", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusSelector
                        orderId={order._id}
                        current={order.status}
                        onChange={handleStatusChange}
                      />
                    </td>

                    {/* View */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
