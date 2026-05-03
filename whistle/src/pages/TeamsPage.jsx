import React from "react";
import { Plus, Users, ArrowRight } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig } from "../constants/sports.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultTeamsData } from "../constants/defaults.js";
import { PageHero, HeroBtn, HoverCard } from "../components/ui/index.js";

const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

export default function TeamsPage({ sport, setPage, setSelectedTeam }) {
  const [teams] = useLocalStorage("teams", defaultTeamsData);
  return (
    <div>
      <PageHero gradient={sportConfig[sport].heroGradient} title={`${sportConfig[sport].emoji} My Teams`}
        subtitle="Manage your teams and rosters"
        actions={<HeroBtn label="Create Team" primary icon={Plus} />}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {teams.map(team => (
          <HoverCard key={team.id} onClick={() => { setSelectedTeam(team); setPage("team-detail"); }}>
            <div style={{ padding: "24px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: c.green100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.green700 }}>{team.age}</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: c.slate800 }}>{team.name}</h3>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{team.age}</span>
                    <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{team.season}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: c.slate50, borderRadius: 10 }}>
                <Users size={16} color={c.slate400} />
                <span style={{ fontSize: 14, color: c.slate600 }}>{team.players.length} players</span>
                <ArrowRight size={14} color={c.slate300} style={{ marginLeft: "auto" }} />
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
