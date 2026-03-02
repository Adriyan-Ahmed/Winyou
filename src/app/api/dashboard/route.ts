import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Products";

export async function GET() {
  try {
    await connectDB();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "pending",
    });

    const lowStock = await Product.countDocuments({
      quantity: { $lte: 5 },
    });

    const revenueData = await Order.aggregate([
      { $match: { status: { $in: ["delivered", "shipped"] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        pendingOrders,
        lowStock,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
