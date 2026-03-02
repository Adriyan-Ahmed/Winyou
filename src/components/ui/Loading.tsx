import React from "react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text = "",
  className = "",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-blue-500 mx-auto ${sizeClasses[size]}`}
        ></div>
        {text && <p className="mt-2 text-gray-600">Loading {text} ....</p>}
      </div>
    </div>
  );
}
