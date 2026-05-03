import React from "react";
import { Home, ClipboardList, Zap, Users, Clock, Star, ChevronDown, CheckCircle2, Sparkles } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig } from "../constants/sports.js";

export default function Sidebar({ page, setPage, sport, setSport, sportOpen, setSportOpen, isMobile, sidebarOpen, setSidebarOpen }) {
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
    <aside style={{
      width: isMobile ? (sidebarOpen ? 240 : 0) : 240,
      minHeight: "100vh",
      background: c.white,
      borderRight: `1px solid ${c.slate200}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: isMobile ? "width 0.3s ease, box-shadow 0.3s ease" : "none",
      boxShadow: isMobile && sidebarOpen ? "2px 0 12px rgba(0,0,0,0.15)" : "none",
      overflow: "hidden"
    }}>
      <div style={{ padding: "0 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16 }}>W</div>
        <span style={{ fontSize: 20, fontWeight: 700, color: c.slate800, letterSpacing: -0.5 }}>Whistle</span>
      </div>

      <div style={{ padding: "0 16px", marginBottom: 24, position: "relative" }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, display: "block", paddingLeft: 4 }}>Sport</label>
        <button onClick={e => { e.stopPropagation(); setSportOpen(!sportOpen); }}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.slate50, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: c.slate700 }}>
          <span style={{ fontSize: 18 }}>{sportConfig[sport].emoji}</span>{sport}
          <ChevronDown size={14} style={{ marginLeft: "auto", color: c.slate400, transition: "transform 0.2s", transform: sportOpen ? "rotate(180deg)" : "none" }} />
        </button>
        {sportOpen && (
          <div style={{ position: "absolute", top: "100%", left: 16, right: 16, marginTop: 4, background: c.white, borderRadius: 12, border: `1px solid ${c.slate200}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden" }}>
            {Object.keys(sportConfig).map(s => (
              <button key={s} onClick={e => { e.stopPropagation(); setSport(s); setSportOpen(false); }}
                style={{ width: "100%", padding: "10px 14px", border: "none", background: s === sport ? c.green50 : "transparent", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: s === sport ? 600 : 400, color: s === sport ? c.green700 : c.slate600 }}>
                <span style={{ fontSize: 16 }}>{sportConfig[s].emoji}</span>{s}
                {s === sport && <CheckCircle2 size={14} style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav style={{ flex: 1, padding: "0 10px" }}>
        {navItems.map(item => {
          const active = page === item.key || (page === "drill-detail" && item.key === "drills") || (page === "team-detail" && item.key === "teams") || (page === "plan-result" && item.key === "generate");
          const Icon = item.icon;
          const isGenerate = item.key === "generate";
          return (
            <button key={item.key} onClick={() => setPage(item.key)}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: isGenerate && !active ? `1.5px solid ${c.green500}` : "none",
                background: active ? c.green600 : isGenerate ? c.green50 : "transparent",
                color: active ? c.white : isGenerate ? c.green700 : c.slate500,
                display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                fontSize: 14, fontWeight: isGenerate || active ? 600 : 500, marginBottom: 2, transition: "all 0.15s",
              }}>
              <Icon size={18} />{item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: `1px solid ${c.slate100}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.green100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.green700 }}>DC</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.slate700 }}>Daniel</div>
          <div style={{ fontSize: 11, color: c.slate500 }}>Pro Plan</div>
        </div>
      </div>
    </aside>
  );
}
