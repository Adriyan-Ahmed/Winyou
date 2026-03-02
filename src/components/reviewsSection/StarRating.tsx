import { Star } from "lucide-react";

// ── Star Rating ───────────────────────────────────────────────────────────────
export default function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const cls = size === "lg" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700 fill-gray-700"}`}
        />
      ))}
    </div>
  );
}
