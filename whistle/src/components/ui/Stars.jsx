import React from "react";
import { Star } from "lucide-react";
import { c } from "../../constants/colors.js";

export default function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => <Star key={i} size={size} fill={i <= rating ? c.amber400 : "none"} color={i <= rating ? c.amber400 : c.slate300} />)}
    </div>
  );
}
