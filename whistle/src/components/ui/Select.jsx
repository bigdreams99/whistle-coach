import React from "react";
import { ChevronDown } from "lucide-react";

export default function Select({ children, style, ...props }) {
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <select
        style={{
          padding: "10px 36px 10px 14px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          fontSize: "var(--text-base)",
          fontFamily: "var(--font-family)",
          color: "var(--color-text-secondary)",
          cursor: "pointer",
          minWidth: 140,
          appearance: "none",
          WebkitAppearance: "none",
          outline: "none",
          transition: `border-color var(--transition-fast), box-shadow var(--transition-fast)`,
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-lighter)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--color-text-faint)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
