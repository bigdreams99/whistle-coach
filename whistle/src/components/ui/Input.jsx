import React from "react";

export default function Input({
  icon: Icon,
  iconSize = 16,
  style,
  containerStyle,
  ...props
}) {
  if (Icon) {
    return (
      <div style={{ position: "relative", ...containerStyle }}>
        <Icon
          size={iconSize}
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-faint)",
            pointerEvents: "none",
          }}
        />
        <input
          style={{
            width: "100%",
            padding: "10px 14px 10px 40px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            fontSize: "var(--text-base)",
            fontFamily: "var(--font-family)",
            color: "var(--color-text-primary)",
            background: "var(--color-surface)",
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
        />
      </div>
    );
  }

  return (
    <input
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        fontSize: "var(--text-base)",
        fontFamily: "var(--font-family)",
        color: "var(--color-text-primary)",
        background: "var(--color-surface)",
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
    />
  );
}
