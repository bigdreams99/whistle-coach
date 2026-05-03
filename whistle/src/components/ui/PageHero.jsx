import React from "react";
import { c } from "../../constants/colors.js";

export default function PageHero({ title, subtitle, actions, gradient }) {
  return (
    <div style={{ background: gradient || `linear-gradient(135deg, ${c.green800} 0%, ${c.green600} 100%)`, borderRadius: 20, padding: "36px 40px", color: c.white, position: "relative", overflow: "hidden", marginBottom: 28 }}>
      <div style={{ position: "absolute", top: -40, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, position: "relative" }}>{title}</h1>
      <p style={{ fontSize: 15, opacity: 0.85, marginBottom: actions ? 20 : 0, maxWidth: 520, lineHeight: 1.5, position: "relative" }}>{subtitle}</p>
      {actions && <div style={{ display: "flex", gap: 10, position: "relative" }}>{actions}</div>}
    </div>
  );
}
