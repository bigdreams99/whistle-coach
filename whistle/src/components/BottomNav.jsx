import React from "react";
import { Home, Sparkles, Zap, Users, MoreHorizontal } from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Home", icon: Home },
  { key: "generate", label: "Generate", icon: Sparkles },
  { key: "drills", label: "Drills", icon: Zap },
  { key: "teams", label: "Teams", icon: Users },
  { key: "more", label: "More", icon: MoreHorizontal },
];

export default function BottomNav({ page, setPage, onMoreClick }) {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: `calc(64px + env(safe-area-inset-bottom, 0px))`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        zIndex: 1000,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          page === item.key ||
          (page === "drill-detail" && item.key === "drills") ||
          (page === "team-detail" && item.key === "teams") ||
          (page === "plan-result" && item.key === "generate");
        const isMore = item.key === "more";

        return (
          <button
            key={item.key}
            onClick={() => {
              if (isMore) {
                onMoreClick?.();
              } else {
                setPage(item.key);
              }
            }}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              padding: "10px 0 6px",
              flex: 1,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: isActive ? "var(--color-primary)" : "var(--color-text-faint)",
              transition: `color var(--transition-fast)`,
              minHeight: 44,
              minWidth: 44,
              position: "relative",
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 24,
                  height: 3,
                  borderRadius: "0 0 3px 3px",
                  background: "var(--color-primary)",
                }}
              />
            )}
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: isActive ? "var(--weight-semibold)" : "var(--weight-medium)",
                fontFamily: "var(--font-family)",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
