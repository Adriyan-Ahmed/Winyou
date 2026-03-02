import { NextRequest, NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

type ErrorWithName = Error & {
  name?: string;
  code?: number;
};

export const handleApiError = (error: ErrorWithName) => {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode },
    );
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return NextResponse.json(
      { error: "Validation Error", details: error.message },
      { status: 400 },
    );
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Handle MongoDB duplicate key errors
  if (error.code === 11000) {
    return NextResponse.json({ error: "Duplicate entry" }, { status: 409 });
  }

  // Default error
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
};

type RequestHandler = (
  req: NextRequest,
  ...args: unknown[]
) => Promise<NextResponse>;

export const withErrorHandler = (handler: RequestHandler) => {
  return async (req: NextRequest, ...args: unknown[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return handleApiError(error as ErrorWithName);
    }
  };
};

// Common API errors
export const ApiErrors = {
  NotFound: (message = "Resource not found") => new ApiError(404, message),
  BadRequest: (message = "Bad request") => new ApiError(400, message),
  Unauthorized: (message = "Unauthorized") => new ApiError(401, message),
  Forbidden: (message = "Forbidden") => new ApiError(403, message),
  Conflict: (message = "Resource conflict") => new ApiError(409, message),
  Internal: (message = "Internal server error") => new ApiError(500, message),
};
