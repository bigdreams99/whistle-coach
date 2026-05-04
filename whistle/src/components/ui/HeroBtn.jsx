import React from "react";

export default function HeroBtn({ label, primary, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "var(--radius-md)",
        border: primary ? "none" : "1.5px solid rgba(255,255,255,0.4)",
        background: primary ? "var(--color-surface)" : "rgba(255,255,255,0.1)",
        color: primary ? "var(--color-primary-dark)" : "var(--color-text-inverse)",
        fontWeight: "var(--weight-semibold)",
        fontFamily: "var(--font-family)",
        fontSize: "var(--text-sm)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: `all var(--transition-fast)`,
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}
