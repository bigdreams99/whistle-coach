import React from "react";

const variantStyles = {
  primary: {
    background: "var(--color-primary)",
    color: "var(--color-text-inverse)",
    border: "none",
  },
  secondary: {
    background: "var(--color-surface)",
    color: "var(--color-text-secondary)",
    border: "1px solid var(--color-border)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-text-muted)",
    border: "none",
  },
  danger: {
    background: "transparent",
    color: "var(--color-accent-rose)",
    border: "1px solid var(--color-accent-rose)",
  },
};

const sizeStyles = {
  sm: { padding: "6px 12px", fontSize: "var(--text-xs)", gap: 4, minHeight: 32 },
  md: { padding: "10px 18px", fontSize: "var(--text-sm)", gap: 6, minHeight: 40 },
  lg: { padding: "12px 24px", fontSize: "var(--text-base)", gap: 8, minHeight: 48 },
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  icon: Icon,
  iconSize,
  disabled = false,
  style,
  ...props
}) {
  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;
  const iSize = iconSize || (size === "sm" ? 14 : size === "lg" ? 18 : 15);

  return (
    <button
      disabled={disabled}
      style={{
        ...v,
        ...s,
        borderRadius: "var(--radius-md)",
        fontWeight: "var(--weight-semibold)",
        fontFamily: "var(--font-family)",
        cursor: disabled ? "default" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        transition: `all var(--transition-fast)`,
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
        lineHeight: 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = "translateY(-1px)";
        if (variant === "primary") {
          e.currentTarget.style.background = "var(--color-primary-hover)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
        } else if (variant === "secondary") {
          e.currentTarget.style.background = "var(--color-surface-alt)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.background = style?.background || v.background;
        e.currentTarget.style.boxShadow = style?.boxShadow || "";
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      {...props}
    >
      {Icon && <Icon size={iSize} />}
      {children}
    </button>
  );
}
