import React from "react";
import { Trash2, UserPlus } from "lucide-react";
import { c } from "../constants/colors.js";
import { Breadcrumb } from "../components/ui/index.js";

const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};

const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

export default function TeamDetailPage({ team, sport, setPage }) {
  if (!team) return null;
  return (
    <div>
      <Breadcrumb items={[{ label: "Teams", onClick: () => setPage("teams") }, { label: team.name }]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 6 }}>{team.name}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{team.age}</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{team.season}</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{team.players.length} players</span>
          </div>
        </div>
        <button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${c.rose500}`, background: "transparent", color: c.rose500, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Trash2 size={14} /> Delete Team</button>
      </div>
      <div style={{ ...cardStyle, padding: "24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, marginBottom: 2 }}>Roster</h2>
            <p style={{ fontSize: 13, color: c.slate500 }}>Manage your players</p>
          </div>
          <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: c.green600, color: c.white, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><UserPlus size={14} /> Add Player</button>
        </div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 80px", gap: 12, padding: "8px 14px", borderBottom: `1px solid ${c.slate200}` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}>#</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}>Name</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}>Position</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}></span>
          </div>
          {team.players.map((player, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 80px", gap: 12, padding: "12px 14px", borderBottom: `1px solid ${c.slate100}`, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = c.slate50}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              <span style={{ fontSize: 14, fontWeight: 700, color: c.green600 }}>{player.number}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.slate700 }}>{player.name}</span>
              <span style={{ ...badgeBase, background: c.slate100, color: c.slate600 }}>{player.position}</span>
              <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${c.slate200}`, background: "transparent", color: c.slate400, fontSize: 12, cursor: "pointer" }}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
