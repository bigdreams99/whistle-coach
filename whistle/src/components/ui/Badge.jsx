import React from "react";

const presetColors = {
  green: { bg: "var(--color-primary-light)", color: "var(--color-primary-dark)" },
  blue: { bg: "var(--color-accent-blue-light)", color: "var(--color-accent-blue-dark)" },
  purple: { bg: "var(--color-accent-purple-light)", color: "var(--color-accent-purple)" },
  amber: { bg: "var(--color-accent-amber-light)", color: "#b45309" },
  rose: { bg: "var(--color-accent-rose-light)", color: "var(--color-accent-rose)" },
  gray: { bg: "var(--color-surface-alt)", color: "var(--color-text-muted)" },
  cyan: { bg: "var(--color-accent-cyan-light)", color: "var(--color-accent-cyan)" },
};

export default function Badge({
  children,
  color = "gray",
  bg,
  textColor,
  size = "md",
  style,
  ...props
}) {
  const preset = presetColors[color] || presetColors.gray;
  const fontSize = size === "sm" ? "var(--text-xs)" : "var(--text-xs)";
  const padding = size === "sm" ? "2px 8px" : "3px 10px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding,
        borderRadius: "var(--radius-full)",
        fontSize,
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "0.2px",
        background: bg || preset.bg,
        color: textColor || preset.color,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
