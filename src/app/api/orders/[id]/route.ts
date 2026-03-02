import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/lib/db";
import Product from "@/models/Products";
type RouteContext = {
  params: Promise<{ id: string }>;
};
// ── GET /api/orders/:id ───────────────────────────────────────────────────────
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

// ── PATCH /api/orders/:id ─────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { status } = await req.json();

    const validStatuses = [
      "pending",
      "follow_up",
      "confirmed",
      "cancelled",
      "returned",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    const { id } = await context.params;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    const previousStatus = order.status;

    // 🔥 CASE 1: Confirm → Decrement stock
    if (status === "confirmed" && previousStatus !== "confirmed") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);

        if (!product || product.quantity < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Insufficient stock for ${item.name}`,
            },
            { status: 400 },
          );
        }

        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity },
        });
      }
    }

    // 🔥 CASE 2: Cancelled/Returned → Restore stock
    if (
      ["cancelled", "returned"].includes(status) &&
      previousStatus === "confirmed"
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    // Update status
    order.status = status;
    await order.save();

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 },
    );
  }
}
