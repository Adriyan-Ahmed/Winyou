import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import {
  generateToken,
  setAuthCookie,
  getUserResponse,
  validateUser,
} from "@/lib/auth";
import { withErrorHandler, ApiErrors } from "@/lib/apiErrorHandler";

async function loginHandler(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiErrors.Unauthorized("Invalid credentials");
  }

  const validationResult = await validateUser(user, password);
  if (!validationResult.success) {
    throw ApiErrors.Unauthorized(validationResult.error);
  }

  await user.save();

  const token = generateToken(user);
  await setAuthCookie(token);

  return NextResponse.json({
    message: "Login successful",
    user: getUserResponse(user),
  });
}

export const POST = withErrorHandler(loginHandler);
