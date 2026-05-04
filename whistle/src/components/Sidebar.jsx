import React from "react";
import { Home, ClipboardList, Zap, Users, Clock, Star, ChevronDown, CheckCircle2, Sparkles, Moon, Sun } from "lucide-react";
import { sportConfig } from "../constants/sports.js";

export default function Sidebar({ page, setPage, sport, setSport, sportOpen, setSportOpen, isMobile, sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "generate", label: "Generate Plan", icon: Sparkles },
    { key: "plans", label: "Plans", icon: ClipboardList },
    { key: "drills", label: "Drills", icon: Zap },
    { key: "teams", label: "Teams", icon: Users },
    { key: "history", label: "History", icon: Clock },
    { key: "pricing", label: "Pricing", icon: Star },
  ];

  return (
    <aside
      aria-label="Main sidebar"
      style={{
        width: isMobile ? (sidebarOpen ? 260 : 0) : 260,
        minHeight: "100vh",
        background: "var(--color-sidebar-bg)",
        borderRight: "1px solid var(--color-sidebar-border)",
        display: "flex",
        flexDirection: "column",
        padding: "var(--space-6) 0",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        transition: isMobile ? `width var(--transition-slow), box-shadow var(--transition-slow)` : "none",
        boxShadow: isMobile && sidebarOpen ? "4px 0 20px rgba(0,0,0,0.3)" : "none",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 var(--space-5)", marginBottom: "var(--space-8)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-emerald))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "var(--weight-extrabold)",
          fontSize: "var(--text-lg)",
          boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)",
        }}>
          W
        </div>
        <span style={{
          fontSize: "var(--text-xl)",
          fontWeight: "var(--weight-bold)",
          color: "var(--color-sidebar-text-active)",
          letterSpacing: "-0.5px",
          fontFamily: "var(--font-family)",
        }}>
          Whistle
        </span>
      </div>

      {/* Sport selector */}
      <div style={{ padding: "0 var(--space-4)", marginBottom: "var(--space-6)", position: "relative" }}>
        <label className="overline" style={{ marginBottom: "var(--space-1-5)", display: "block", paddingLeft: "var(--space-1)", color: "var(--color-sidebar-text)" }}>
          Sport
        </label>
        <button
          onClick={(e) => { e.stopPropagation(); setSportOpen(!sportOpen); }}
          aria-expanded={sportOpen}
          aria-haspopup="listbox"
          aria-label={`Selected sport: ${sport}`}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-sidebar-border)",
            background: "var(--color-sidebar-hover)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
            fontFamily: "var(--font-family)",
            color: "var(--color-sidebar-text-active)",
          }}
        >
          <span style={{ fontSize: 18 }}>{sportConfig[sport].emoji}</span>
          {sport}
          <ChevronDown
            size={14}
            style={{
              marginLeft: "auto",
              color: "var(--color-sidebar-text)",
              transition: `transform var(--transition-base)`,
              transform: sportOpen ? "rotate(180deg)" : "none",
            }}
          />
        </button>
        {sportOpen && (
          <div
            role="listbox"
            aria-label="Sport selection"
            style={{
              position: "absolute",
              top: "100%",
              left: "var(--space-4)",
              right: "var(--space-4)",
              marginTop: "var(--space-1)",
              background: "var(--color-surface-raised)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-dropdown)",
              zIndex: 100,
              overflow: "hidden",
              animation: "scaleIn 0.15s ease-out",
            }}
          >
            {Object.keys(sportConfig).map((s) => (
              <button
                key={s}
                role="option"
                aria-selected={s === sport}
                onClick={(e) => { e.stopPropagation(); setSport(s); setSportOpen(false); }}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "none",
                  background: s === sport ? "var(--color-primary-lighter)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: "var(--text-sm)",
                  fontFamily: "var(--font-family)",
                  fontWeight: s === sport ? "var(--weight-semibold)" : "var(--weight-regular)",
                  color: s === sport ? "var(--color-primary)" : "var(--color-text-secondary)",
                  transition: `background var(--transition-fast)`,
                }}
                onMouseEnter={(e) => { if (s !== sport) e.currentTarget.style.background = "var(--color-surface-alt)"; }}
                onMouseLeave={(e) => { if (s !== sport) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16 }}>{sportConfig[s].emoji}</span>
                {s}
                {s === sport && <CheckCircle2 size={14} style={{ marginLeft: "auto", color: "var(--color-primary)" }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0 var(--space-3)" }} aria-label="Main navigation">
        {navItems.map((item) => {
          const active =
            page === item.key ||
            (page === "drill-detail" && item.key === "drills") ||
            (page === "team-detail" && item.key === "teams") ||
            (page === "plan-result" && item.key === "generate");
          const Icon = item.icon;
          const isGenerate = item.key === "generate";
          return (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              aria-current={active ? "page" : undefined}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "var(--radius-md)",
                border: isGenerate && !active ? "1.5px solid rgba(22, 163, 74, 0.4)" : "none",
                background: active
                  ? "var(--color-sidebar-active)"
                  : isGenerate
                  ? "rgba(22, 163, 74, 0.08)"
                  : "transparent",
                color: active
                  ? "var(--color-sidebar-text-active)"
                  : isGenerate
                  ? "var(--color-primary)"
                  : "var(--color-sidebar-text)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                fontSize: "var(--text-sm)",
                fontWeight: isGenerate || active ? "var(--weight-semibold)" : "var(--weight-medium)",
                fontFamily: "var(--font-family)",
                marginBottom: 2,
                transition: `all var(--transition-fast)`,
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--color-sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = isGenerate ? "rgba(22, 163, 74, 0.08)" : "transparent";
                }
              }}
            >
              {active && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 20,
                    borderRadius: "0 3px 3px 0",
                    background: "var(--color-primary)",
                  }}
                />
              )}
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer: Dark mode toggle + user */}
      <div style={{ padding: "0 var(--space-4)" }}>
        <button
          onClick={() => setDarkMode?.(!darkMode)}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "none",
            background: "var(--color-sidebar-hover)",
            color: "var(--color-sidebar-text)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--weight-medium)",
            fontFamily: "var(--font-family)",
            marginBottom: "var(--space-4)",
            transition: `all var(--transition-fast)`,
          }}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <div
          style={{
            padding: "var(--space-4) var(--space-3)",
            borderTop: "1px solid var(--color-sidebar-border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-emerald))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-bold)",
              color: "white",
            }}
          >
            DC
          </div>
          <div>
            <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-sidebar-text-active)" }}>Daniel</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-sidebar-text)" }}>Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
