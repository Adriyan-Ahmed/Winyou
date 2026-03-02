"use client";

import { Loader2 } from "lucide-react";
import { ALL_STATUSES, OrderStatus, STATUS_CONFIG } from "./OrdersManage";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export default function StatusSelector({
  orderId,
  current,
  onChange,
}: {
  orderId: string;
  current: OrderStatus;
  onChange: (id: string, status: OrderStatus) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    openUpward: boolean;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const cfg = STATUS_CONFIG[current];

  // 🔥 Calculate position dynamically
  useLayoutEffect(() => {
    if (!open) return;

    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const dropdownHeight = 180; // approx height
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openUpward =
      spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

    const top = openUpward
      ? rect.top + window.scrollY - dropdownHeight - 6
      : rect.bottom + window.scrollY + 6;

    const left = rect.left + window.scrollX;

    setPosition({ top, left, openUpward });
  }, [open]);

  // Close on scroll / resize
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("scroll", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, []);

  const handleSelect = async (s: OrderStatus) => {
    if (s === current) {
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(false);
    await onChange(orderId, s);
    setLoading(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${cfg.bg} ${cfg.text} ${cfg.border} hover:opacity-80 disabled:opacity-50`}
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : cfg.label}
      </button>

      {/* 🔥 Render dropdown in BODY */}
      {open &&
        position &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[999]"
              onClick={() => setOpen(false)}
            />

            <div
              className="absolute z-[1000] w-36 rounded-xl border border-gray-800 overflow-hidden shadow-2xl"
              style={{
                top: position.top,
                left: position.left,
                background: "#0d0d18",
              }}
            >
              {ALL_STATUSES.map((s) => {
                const c = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => handleSelect(s)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      s === current
                        ? `${c.bg} ${c.text}`
                        : "text-gray-500 hover:bg-gray-800/60 hover:text-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        s === current
                          ? c.text.replace("text-", "bg-")
                          : "bg-gray-700"
                      }`}
                    />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
