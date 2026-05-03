import React from "react";
import { c } from "../../constants/colors.js";

const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};

export default function HoverCard({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ ...cardStyle, ...style }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >{children}</div>
  );
}
