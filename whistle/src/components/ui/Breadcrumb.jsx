import React from "react";

export default function Breadcrumb({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: "var(--space-5)",
        fontSize: "var(--text-sm)",
        color: "var(--color-text-muted)",
      }}
    >
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span aria-hidden>/</span>}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              style={{
                color: "var(--color-primary)",
                cursor: "pointer",
                fontWeight: "var(--weight-medium)",
                background: "none",
                border: "none",
                padding: 0,
                fontFamily: "var(--font-family)",
                fontSize: "inherit",
              }}
            >
              {item.label}
            </button>
          ) : (
            <span style={{ color: "var(--color-text-secondary)", fontWeight: "var(--weight-medium)" }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
