import React from "react";
import { Star } from "lucide-react";

export default function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= rating ? "var(--color-accent-amber)" : "none"}
          color={i <= rating ? "var(--color-accent-amber)" : "var(--color-text-faint)"}
        />
      ))}
    </div>
  );
}
