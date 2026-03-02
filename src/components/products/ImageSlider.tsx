"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  images: string[];
  alt: string;
}

export default function ImageSlider({ images, alt }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  if (!images.length) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-gray-800"
        style={{ aspectRatio: "1 / 1" }}
      >
        <Image
          src={images[current]}
          alt={`${alt} - ${current + 1}`}
          fill
          className="object-cover  hover:opacity-80 hover:scale-105 transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Arrows */}
        {images?.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-gray-700 bg-gray-950/80 text-gray-300 hover:bg-gray-800 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-gray-700 bg-gray-950/80 text-gray-300 hover:bg-gray-800 hover:text-white transition-all backdrop-blur-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs bg-black/70 text-gray-300 backdrop-blur-sm border border-gray-700">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                i === current
                  ? "border-indigo-500 ring-2 ring-indigo-500/30"
                  : "border-gray-800 hover:border-gray-600 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
