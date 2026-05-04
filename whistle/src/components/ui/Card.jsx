import React from "react";

const elevationStyles = {
  flat: {
    boxShadow: "none",
    border: "1px solid var(--color-border)",
  },
  low: {
    boxShadow: "var(--shadow-xs)",
    border: "1px solid var(--color-border)",
  },
  mid: {
    boxShadow: "var(--shadow-card)",
    border: "1px solid var(--color-border)",
  },
  high: {
    boxShadow: "var(--shadow-md)",
    border: "1px solid var(--color-border)",
  },
};

const paddingStyles = {
  none: "0",
  sm: "var(--space-4) var(--space-5)",
  md: "var(--space-6) var(--space-6)",
  lg: "var(--space-8) var(--space-8)",
};

export default function Card({
  children,
  elevation = "low",
  padding = "none",
  hoverable = false,
  interactive = false,
  onClick,
  style,
  className,
  ...props
}) {
  const elev = elevationStyles[elevation] || elevationStyles.low;

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      className={className}
      onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } } : undefined}
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        ...elev,
        padding: paddingStyles[padding] || paddingStyles.none,
        overflow: "hidden",
        transition: `box-shadow var(--transition-base), transform var(--transition-fast), border-color var(--transition-fast)`,
        cursor: (hoverable || interactive || onClick) ? "pointer" : "default",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable || interactive || onClick) {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable || interactive || onClick) {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = style?.boxShadow || elev.boxShadow;
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
