import React from "react";
import { c } from "../../constants/colors.js";

export default function Breadcrumb({ items }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 13, color: c.slate500 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span>/</span>}
          {item.onClick ? <span onClick={item.onClick} style={{ color: c.green600, cursor: "pointer", fontWeight: 500 }}>{item.label}</span>
            : <span style={{ color: c.slate600, fontWeight: 500 }}>{item.label}</span>}
        </span>
      ))}
    </div>
  );
}
