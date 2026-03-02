import connectDB from "@/lib/db";
import Product from "@/models/Products";
import { NextRequest, NextResponse } from "next/server";

// ── GET /api/products ─────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const inStock = searchParams.get("inStock"); // "true" → only quantity > 0
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (inStock === "true") {
      filter.quantity = { $gt: 0 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: products,
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
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// ── POST /api/products ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, description, productImage, price, quantity, isFreeShipping } =
      body;

    if (!name || !price || !productImage?.length) {
      return NextResponse.json(
        {
          success: false,
          message: "name, price and at least one image are required",
        },
        { status: 400 },
      );
    }

    const product = await Product.create({
      name,
      description: description || [],
      productImage,
      price: Number(price),
      quantity: Number(quantity) || 0,
      isFreeShipping: Boolean(isFreeShipping),
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 },
    );
  }
}
