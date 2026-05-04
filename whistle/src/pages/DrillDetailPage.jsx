import React from "react";
import { Plus, Heart } from "lucide-react";
import { sportConfig } from "../constants/sports.js";
import { Breadcrumb, Badge, Button, Card } from "../components/ui/index.js";

export default function DrillDetailPage({ drill, sport, setPage }) {
  if (!drill) return null;

  const categoryBadgeColors = {
    technical: "blue",
    tactical: "purple",
    warmup: "green",
    fitness: "rose",
  };
  const catColor = categoryBadgeColors[drill.category] || "blue";

  return (
    <div className="page-enter">
      <Breadcrumb items={[{ label: "Drills", onClick: () => setPage("drills") }, { label: drill.name }]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-2)", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-1-5)", lineHeight: "var(--leading-tight)" }}>
            {drill.name}
          </h1>
          <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-muted)", marginBottom: "var(--space-3)" }}>
            {drill.desc || drill.description}
          </p>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Badge color={catColor}>{drill.category}</Badge>
            <Badge color="amber">{drill.intensity} intensity</Badge>
            <Badge color="gray">{drill.duration} min</Badge>
            <Badge color="gray">{typeof drill.players === "string" ? drill.players : `${drill.players[0]}-${drill.players[1]}`} players</Badge>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="secondary" size="md" icon={Plus}>Add to Plan</Button>
          <Button variant="secondary" size="md" icon={Heart}>Favorite</Button>
        </div>
      </div>

      <Card elevation="low" padding="md" style={{ marginTop: "var(--space-5)", marginBottom: "var(--space-5)" }}>
        <svg viewBox="0 0 500 300" style={{ width: "100%", height: 280, borderRadius: "var(--radius-lg)", background: sportConfig[sport]?.fieldColor || "#16a34a" }} aria-label={`Field diagram for ${drill.name}`}>
          <rect x="5" y="5" width="490" height="290" rx="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="250" y1="5" x2="250" y2="295" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="250" cy="150" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        </svg>
      </Card>

      <Card elevation="low" padding="md">
        <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-3)" }}>
          Instructions
        </h3>
        {(drill.instructions || drill.description || "").split("\n").map((line, i) => (
          <p key={i} style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-1)" }}>
            {line}
          </p>
        ))}
      </Card>
    </div>
  );
}
