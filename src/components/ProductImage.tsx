"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

export default function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  const showImage = product.image && !failed;

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image}
        alt={product.name}
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#f2f4ee]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-900/15 bg-white text-lg font-semibold text-emerald-900">
        {product.name
          .split(" ")
          .slice(0, 2)
          .map((word) => word[0])
          .join("")}
      </div>
    </div>
  );
}
