import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { IUser } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWT_SECRET environment variable inside .env",
  );
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

// Token Generation and Verification
export function generateToken(user: IUser) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as DecodedToken;
  } catch {
    return null;
  }
}

// Cookie Management
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// User Response Formatting
export function getUserResponse(user: IUser) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// User Validation
export async function validateUser(user: IUser | null, password: string) {
  if (!user) {
    return { error: "Invalid credentials", status: 401 };
  }

  switch (user.status) {
    case "active":
      break;

    case "inactive":
      return {
        error: "Your account is not yet activated.",
        status: 401,
      };

    case "suspended":
      return {
        error: "Your account has been suspended. Please contact support.",
        status: 403,
      };

    case "banned":
      return {
        error: "Your account has been permanently banned.",
        status: 403,
      };

    default:
      return {
        error: "Invalid account status.",
        status: 400,
      };
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return { error: "Invalid credentials", status: 401 };
  }

  return { success: true };
}

// Authentication Middleware
export async function getAuthUser(req: NextRequest) {
  // First try to get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // If no token in cookies, try authorization header
  if (!token) {
    const authToken = req.headers.get("authorization")?.split(" ")[1];
    if (!authToken) return null;
    return verifyToken(authToken);
  }

  return verifyToken(token);
}

type RequestHandler = (
  req: NextRequest,
  user: DecodedToken,
  ...args: unknown[]
) => Promise<NextResponse>;

export function requireAuth(handler: RequestHandler) {
  return async (req: NextRequest, ...args: unknown[]) => {
    const user = await getAuthUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    return handler(req, user, ...args);
  };
}

export function requireRole(roles: string[]) {
  return (handler: RequestHandler) => {
    return async (req: NextRequest, user: DecodedToken, ...args: unknown[]) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 },
        );
      }

      return handler(req, user, ...args);
    };
  };
}
