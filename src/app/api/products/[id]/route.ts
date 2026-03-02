import connectDB from "@/lib/db";
import Product from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};
// ── GET /api/products/:id ─────────────────────────────────────────────────────
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: product, message: "Product fetched successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/products/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// ── PUT /api/products/:id ─────────────────────────────────────────────────────
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = await context.params;

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          description: body.description,
          productImage: body.productImage,
          price: Number(body.price),
          quantity: Number(body.quantity),
          isFreeShipping: Boolean(body.isFreeShipping),
        },
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/products/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 },
    );
  }
}

// ── DELETE /api/products/:id ──────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    await connectDB();
    const { id } = await context.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/products/:id error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 },
    );
  }
}
