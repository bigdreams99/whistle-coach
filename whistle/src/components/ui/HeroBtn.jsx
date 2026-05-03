import React from "react";
import { c } from "../../constants/colors.js";

export default function HeroBtn({ label, primary, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 20px", borderRadius: 10, border: primary ? "none" : "1.5px solid rgba(255,255,255,0.4)",
      background: primary ? c.white : "rgba(255,255,255,0.1)", color: primary ? c.green700 : c.white,
      fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
    }}>{Icon && <Icon size={16} />}{label}</button>
  );
}
