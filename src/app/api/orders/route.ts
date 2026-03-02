import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";

const SHIPPING = { in_dhaka: 70, out_dhaka: 130 } as const;

// ── GET /api/orders ───────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// ── POST /api/orders ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { customerName, phoneNumber, address, deliveryZone, items } = body;

    // Basic validation
    if (
      !customerName ||
      !phoneNumber ||
      !address ||
      !deliveryZone ||
      !items?.length
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!["in_dhaka", "out_dhaka"].includes(deliveryZone)) {
      return NextResponse.json(
        { success: false, message: "Invalid delivery zone" },
        { status: 400 },
      );
    }

    // Verify products
    const productIds = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { success: false, message: "One or more products not found" },
        { status: 404 },
      );
    }

    // Enrich items (NO STOCK CHECK HERE)
    const enrichedItems = items.map(
      (item: { productId: string; quantity: number }) => {
        const dbP = dbProducts.find((p) => p._id.toString() === item.productId);
        if (!dbP) throw new Error("Product not found");

        return {
          productId: dbP._id.toString(),
          name: dbP.name,
          image: dbP.productImage[0] || "",
          price: dbP.price,
          quantity: item.quantity,
          isFreeShipping: dbP.isFreeShipping,
        };
      },
    );

    const subtotal = enrichedItems.reduce(
      (acc: number, i: { price: number; quantity: number }) =>
        acc + i.price * i.quantity,
      0,
    );

    const allFreeShipping = enrichedItems.every(
      (i: { isFreeShipping: boolean }) => i.isFreeShipping,
    );

    const shippingCharge = allFreeShipping
      ? 0
      : SHIPPING[deliveryZone as keyof typeof SHIPPING];

    const totalAmount = subtotal + shippingCharge;

    const order = await Order.create({
      customerName,
      phoneNumber,
      address,
      deliveryZone,
      items: enrichedItems,
      subtotal,
      shippingCharge,
      totalAmount,
      status: "pending",
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
