import React from "react";

export default function PageHero({ title, subtitle, actions, gradient }) {
  return (
    <div
      className="page-enter"
      style={{
        background: gradient || `linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary) 100%)`,
        borderRadius: "var(--radius-2xl)",
        padding: "36px 40px",
        color: "var(--color-text-inverse)",
        position: "relative",
        overflow: "hidden",
        marginBottom: "var(--space-8)",
      }}
    >
      <div style={{ position: "absolute", top: -40, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <h1 style={{
        fontSize: "var(--text-2xl)",
        fontWeight: "var(--weight-bold)",
        lineHeight: "var(--leading-tight)",
        marginBottom: "var(--space-1-5)",
        position: "relative",
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: "var(--text-base)",
        opacity: 0.85,
        marginBottom: actions ? "var(--space-5)" : 0,
        maxWidth: 520,
        lineHeight: "var(--leading-normal)",
        position: "relative",
      }}>
        {subtitle}
      </p>
      {actions && <div style={{ display: "flex", gap: "var(--space-3)", position: "relative" }}>{actions}</div>}
    </div>
  );
}
