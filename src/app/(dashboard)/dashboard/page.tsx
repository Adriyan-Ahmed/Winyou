"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Clock,
} from "lucide-react";
import Loading from "@/components/ui/Loading";

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  lowStock: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.success) setData(json.data);
    };
    fetchData();
  }, []);

  if (!data) return <Loading />;

  return (
    <div className="min-h-screen bg-[#080810] ">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={data.totalProducts}
            icon={Package}
          />

          <StatCard
            title="Total Orders"
            value={data.totalOrders}
            icon={ShoppingCart}
          />

          <StatCard
            title="Pending Orders"
            value={data.pendingOrders}
            icon={Clock}
          />

          <StatCard
            title="Total Revenue"
            value={`৳${data.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
          />
        </div>

        {/* Low Stock Warning */}
        {data.lowStock > 0 && (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-yellow-400">
              {data.lowStock} products are low in stock.
            </span>
          </div>
        )}

        {/* Recent Orders */}
        <div
          className="rounded-2xl border border-gray-800 shadow-2xl"
          style={{ background: "#0d0d18" }}
        >
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-gray-100">
              Recent Orders
            </h2>
          </div>

          <div className="divide-y divide-gray-800">
            {data.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-800/20 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-BD")}
                  </p>
                </div>

                <div className="text-sm font-semibold text-indigo-400 mt-2 sm:mt-0">
                  ৳{order.totalAmount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: any;
}) {
  return (
    <div
      className="rounded-2xl border border-gray-800 p-6 shadow-2xl transition hover:border-indigo-500/40"
      style={{ background: "#0d0d18" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-gray-500 tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-100 mt-2">{value}</p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
    </div>
  );
}
