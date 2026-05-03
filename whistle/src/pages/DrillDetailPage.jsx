import React from "react";
import { Plus, Heart } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig } from "../constants/sports.js";
import { Breadcrumb } from "../components/ui/index.js";

const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};

const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

const categoryColors = {
  technical: { bg: "#dbeafe", color: "#1d4ed8" },
  tactical: { bg: "#fef3c7", color: "#b45309" },
  warmup: { bg: "#d1fae5", color: "#047857" },
  fitness: { bg: "#fce7f3", color: "#be185d" },
};

export default function DrillDetailPage({ drill, sport, setPage }) {
  if (!drill) return null;
  const cat = categoryColors[drill.category] || categoryColors.technical;
  return (
    <div>
      <Breadcrumb items={[{ label: "Drills", onClick: () => setPage("drills") }, { label: drill.name }]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 6 }}>{drill.name}</h1>
          <p style={{ fontSize: 15, color: c.slate500, marginBottom: 12 }}>{drill.desc || drill.description}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ ...badgeBase, background: cat.bg, color: cat.color }}>{drill.category}</span>
            <span style={{ ...badgeBase, background: "#fef3c7", color: "#b45309" }}>{drill.intensity} intensity</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate600 }}>{drill.duration} min</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate600 }}>{typeof drill.players === 'string' ? drill.players : `${drill.players[0]}-${drill.players[1]}`} players</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Plus size={15} /> Add to Plan</button>
          <button style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Heart size={15} /> Favorite</button>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24, marginTop: 20, marginBottom: 20 }}>
        <svg viewBox="0 0 500 300" style={{ width: "100%", height: 280, borderRadius: 12, background: sportConfig[sport]?.fieldColor || c.green600 }}>
          <rect x="5" y="5" width="490" height="290" rx="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="250" y1="5" x2="250" y2="295" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="250" cy="150" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        </svg>
      </div>

      <div style={{ ...cardStyle, padding: "22px 24px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 12 }}>Instructions</h3>
        {(drill.instructions || drill.description || "").split("\n").map((line, i) => (
          <p key={i} style={{ fontSize: 14, color: c.slate600, lineHeight: 1.6, marginBottom: 4 }}>{line}</p>
        ))}
      </div>
    </div>
  );
}
