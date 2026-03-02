import { useEffect, useRef, useState } from "react";
import { REVIEWS } from "./REVIEWS";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";

export default function ReviewsPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const isDragging = useRef(false);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    onScroll();
  }, []);

  const avg = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);

  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = REVIEWS.filter((r) => r.rating === star).length;
    return { star, count, pct: Math.round((count / REVIEWS.length) * 100) };
  });

  return (
    <section className="mt-12">
      <div className="h-px bg-gray-800 mb-8" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-gray-100">
            Customer Reviews
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            {REVIEWS.length} verified reviews
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="w-8 h-8 rounded-xl border border-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-200 hover:border-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="w-8 h-8 rounded-xl border border-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-200 hover:border-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rating summary */}
      <div
        className="flex flex-col sm:flex-row items-stretch gap-5 p-5 rounded-2xl border border-gray-800/80 mb-5"
        style={{ background: "#0d0d18" }}
      >
        {/* Big avg */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 sm:pr-5 sm:border-r border-gray-800 pb-4 sm:pb-0 border-b sm:border-b-0">
          <span className="text-5xl font-bold text-gray-100">{avg}</span>
          <StarRating rating={5} size="lg" />
          <span className="text-xs text-gray-600 mt-1">out of 5</span>
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-2 justify-center flex flex-col">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-3 flex-shrink-0">
                {d.star}
              </span>
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-yellow-400/60 transition-all duration-500"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-700 w-4 flex-shrink-0">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Swipeable row */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        onMouseDown={() => {
          isDragging.current = true;
        }}
        onMouseMove={(e) => {
          if (!isDragging.current || !scrollRef.current) return;
          scrollRef.current.scrollLeft -= e.movementX;
        }}
        onMouseUp={() => {
          isDragging.current = false;
        }}
        onMouseLeave={() => {
          isDragging.current = false;
        }}
        className="flex gap-3 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {REVIEWS?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        <div className="flex-shrink-0 w-1" />
      </div>

      {/* Drag hint */}
      <p className="text-center text-xs text-gray-700 mt-3">
        ← Drag or swipe to read more reviews →
      </p>
    </section>
  );
}
