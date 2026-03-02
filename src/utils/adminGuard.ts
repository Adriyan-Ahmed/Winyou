import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const adminGuard = async (req: NextRequest) => {
  const session = await getAuthUser(req);
  if (!session)
    return NextResponse.json(
      { success: false, message: "Auth required." },
      { status: 401 },
    );
  if (session.role !== "admin")
    return NextResponse.json(
      { success: false, message: "Admin only." },
      { status: 403 },
    );
  return null;
};
