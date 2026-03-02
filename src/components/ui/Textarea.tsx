"use client";

import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  required?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  fullWidth = true,
  className = "",
  required = false,
  ...props
}) => {
  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        {...props}
        rows={props.rows || 4}
        className={`
          w-full px-4 py-2.5 border rounded-xl
          text-gray-900 text-sm bg-white
          border-gray-200
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          placeholder:text-gray-400 resize-none
          transition-all duration-150
          ${error ? "border-red-400 focus:ring-red-300 bg-red-50/30" : ""}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
          <span className="inline-flex w-3.5 h-3.5 items-center justify-center bg-red-100 rounded-full font-bold text-red-500 text-[10px] flex-shrink-0">
            !
          </span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
