import { BadgeCheck, Quote, ThumbsUp } from "lucide-react";
import StarRating from "./StarRating";
import { IReview } from "./REVIEWS";

const AVATAR_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function ReviewCard({ review }: { review: IReview }) {
  return (
    <div
      className="flex-shrink-0 w-72 sm:w-80 flex flex-col gap-3 rounded-2xl border border-gray-800/80 p-5 select-none"
      style={{ background: "#0d0d18" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <Quote className="w-5 h-5 text-indigo-500/30 flex-shrink-0 mt-0.5" />
        {review.tag && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 whitespace-nowrap">
            {review.tag}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-bold text-gray-100 leading-snug line-clamp-2">
        {review.title}
      </h4>

      {/* Stars + date */}
      <div className="flex items-center justify-between">
        <StarRating rating={review?.rating} />
        <span className="text-[10px] text-gray-600">{review.date}</span>
      </div>

      {/* Body */}
      <p className="text-xs text-gray-500 leading-relaxed flex-1 line-clamp-4">
        {review.body}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800/60 mt-auto">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: avatarColor(review.id) }}
          >
            {review.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-300 truncate max-w-[90px]">
                {review.name}
              </span>
              {review.verified && (
                <BadgeCheck className="w-3 h-3 text-indigo-400 flex-shrink-0" />
              )}
            </div>
            <span className="text-[10px] text-gray-600">{review.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-600 flex-shrink-0">
          <ThumbsUp className="w-3 h-3" />
          <span className="text-[10px]">{review.helpful}</span>
        </div>
      </div>
    </div>
  );
}
