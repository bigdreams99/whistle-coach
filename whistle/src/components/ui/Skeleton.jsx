import React from "react";

export default function Skeleton({ width, height = 16, radius, style }) {
  return (
    <div
      className="skeleton"
      style={{
        width: width || "100%",
        height,
        borderRadius: radius || "var(--radius-md)",
        ...style,
      }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--color-border)",
      padding: "var(--space-6)",
      overflow: "hidden",
    }}>
      <Skeleton width="40%" height={20} style={{ marginBottom: 12 }} />
      <Skeleton width="80%" height={14} style={{ marginBottom: 8 }} />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} width={`${60 + Math.random() * 30}%`} height={14} style={{ marginBottom: 8 }} />
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Skeleton width={64} height={24} radius="var(--radius-full)" />
        <Skeleton width={48} height={24} radius="var(--radius-full)" />
      </div>
    </div>
  );
}
