import React from "react";
import Link from "next/link";

interface ErrorComponentProps {
  title?: string;
  message?: string;
  statusCode?: number;
  showHomeButton?: boolean;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  title = "Something went wrong",
  message = "An unexpected error occurred",
  statusCode,
  showHomeButton = true,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        {statusCode && (
          <div className="text-6xl font-bold text-red-500 mb-4">
            {statusCode}
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        {showHomeButton && (
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorComponent;
