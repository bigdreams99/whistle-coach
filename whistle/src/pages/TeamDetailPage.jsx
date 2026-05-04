import React from "react";
import { Trash2, UserPlus } from "lucide-react";
import { Breadcrumb, Badge, Button, Card } from "../components/ui/index.js";

export default function TeamDetailPage({ team, sport, setPage }) {
  if (!team) return null;
  return (
    <div className="page-enter">
      <Breadcrumb items={[{ label: "Teams", onClick: () => setPage("teams") }, { label: team.name }]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-4)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-1-5)", lineHeight: "var(--leading-tight)" }}>
            {team.name}
          </h1>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Badge color="green">{team.age}</Badge>
            <Badge color="gray">{team.season}</Badge>
            <Badge color="gray">{team.players.length} players</Badge>
          </div>
        </div>
        <Button variant="danger" size="md" icon={Trash2}>Delete Team</Button>
      </div>

      <Card elevation="low" padding="md">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: 2 }}>Roster</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>Manage your players</p>
          </div>
          <Button variant="primary" size="md" icon={UserPlus}>Add Player</Button>
        </div>

        <div>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "50px 1fr 100px 80px",
            gap: "var(--space-3)",
            padding: "var(--space-2) var(--space-4)",
            borderBottom: "1px solid var(--color-border)",
          }}>
            <span className="overline">#</span>
            <span className="overline">Name</span>
            <span className="overline">Position</span>
            <span className="overline"></span>
          </div>

          {/* Table rows */}
          {team.players.map((player, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 100px 80px",
                gap: "var(--space-3)",
                padding: "var(--space-3) var(--space-4)",
                borderBottom: "1px solid var(--color-border-light)",
                transition: `background var(--transition-fast)`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface-alt)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--color-primary)" }}>{player.number}</span>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--color-text-primary)" }}>{player.name}</span>
              <Badge color="gray">{player.position}</Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
