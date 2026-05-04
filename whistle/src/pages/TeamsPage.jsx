import React from "react";
import { Plus, Users, ArrowRight } from "lucide-react";
import { sportConfig } from "../constants/sports.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultTeamsData } from "../constants/defaults.js";
import { PageHero, HeroBtn, HoverCard, Badge } from "../components/ui/index.js";

export default function TeamsPage({ sport, setPage, setSelectedTeam }) {
  const [teams] = useLocalStorage("teams", defaultTeamsData);
  return (
    <div>
      <PageHero
        gradient={sportConfig[sport].heroGradient}
        title={`${sportConfig[sport].emoji} My Teams`}
        subtitle="Manage your teams and rosters"
        actions={<HeroBtn label="Create Team" primary icon={Plus} />}
      />
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
        {teams.map((team) => (
          <HoverCard key={team.id} onClick={() => { setSelectedTeam(team); setPage("team-detail"); }}>
            <div style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-primary-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-bold)",
                  color: "var(--color-primary-dark)",
                }}>
                  {team.age}
                </div>
                <div>
                  <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)" }}>
                    {team.name}
                  </h3>
                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
                    <Badge color="green">{team.age}</Badge>
                    <Badge color="gray">{team.season}</Badge>
                  </div>
                </div>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-4)",
                background: "var(--color-surface-alt)",
                borderRadius: "var(--radius-md)",
              }}>
                <Users size={16} color="var(--color-text-faint)" />
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{team.players.length} players</span>
                <ArrowRight size={14} color="var(--color-text-faint)" style={{ marginLeft: "auto" }} />
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
