import { MapPin, Phone, Truck, User, X } from "lucide-react";
import { Order, OrderStatus } from "./OrdersManage";
import StatusSelector from "./StatusSelector";

// ── Order Detail Modal ────────────────────────────────────────────────────────
export default function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 shadow-2xl"
        style={{ background: "#0d0d18" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-gray-800 z-10"
          style={{ background: "#0d0d18" }}
        >
          <div>
            <h2 className="text-sm font-bold text-gray-100">Order Details</h2>
            <p className="text-xs text-gray-600 font-mono mt-0.5">
              #{order._id.slice(-10).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 cursor-pointer rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Status */}
          <div className="flex items-center pr-10  justify-between">
            <span className="text-xs text-gray-500">Status</span>
            <StatusSelector
              orderId={order._id}
              current={order.status}
              onChange={onStatusChange}
            />
          </div>

          {/* Customer info */}
          <div
            className="rounded-xl border border-gray-800 p-4 space-y-2.5"
            style={{ background: "#0a0a14" }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Customer
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              {order?.customerName}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Phone className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              {order?.phoneNumber}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-0.5" />
              {order?.address}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Truck className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              {order?.deliveryZone === "in_dhaka"
                ? "Inside Dhaka"
                : "Outside Dhaka"}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Items ({order.items.length})
            </p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 py-2 border-b border-gray-800/50 last:border-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs text-gray-600 font-mono w-4 flex-shrink-0">
                      {item.quantity}×
                    </span>
                    <span className="text-sm text-gray-300 truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-300 flex-shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div
            className="rounded-xl border border-gray-800 p-4 space-y-2"
            style={{ background: "#0a0a14" }}
          >
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span
                className={order.shippingCharge === 0 ? "text-emerald-400" : ""}
              >
                {order.shippingCharge === 0
                  ? "FREE"
                  : `৳${order.shippingCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-100 pt-1 border-t border-gray-800">
              <span>Total</span>
              <span>৳{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-gray-700 text-center">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-BD", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
