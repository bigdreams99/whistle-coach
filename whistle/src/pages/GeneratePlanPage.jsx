import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Info } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig, AGE_GROUPS, EQUIPMENT_BY_SPORT, DURATION_OPTIONS } from "../constants/sports.js";
import { generatePlan } from "../utils/planGenerator.js";
import { PageHero, HeroBtn } from "../components/ui/index.js";
import { drillsBySport } from "../data/drills.js";
import { defaultTeamsData } from "../constants/defaults.js";

const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};

const selectCard = (selected) => ({
  padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s ease",
  border: `2px solid ${selected ? c.green500 : c.slate200}`,
  background: selected ? c.green50 : c.white,
});

const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

export default function GeneratePlanPage({ sport, setPage, onPlanGenerated }) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    ageGroup: "", playerCount: 12, duration: 60,
    equipment: (EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).slice(0, 2), focusAreas: [],
  });
  const [teamsData] = React.useState(defaultTeamsData);

  const prevSport = useRef(sport);
  useEffect(() => {
    if (prevSport.current !== sport) {
      prevSport.current = sport;
      setConfig(prev => ({
        ...prev,
        equipment: (EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).slice(0, 2),
        focusAreas: [],
      }));
      setStep(0);
    }
  }, [sport]);

  const canProceed = () => {
    if (step === 0) return config.ageGroup && config.playerCount;
    if (step === 1) return config.duration && config.equipment.length > 0;
    if (step === 2) return config.focusAreas.length > 0;
    return true;
  };

  const handleGenerate = () => {
    const plan = generatePlan(config, sport);
    onPlanGenerated(plan, config);
  };

  const stepLabels = ["Team Info", "Session Setup", "Focus Areas"];
  const cfg = sportConfig[sport];
  const FOCUS_OPTIONS = {
    Soccer: [
      { value: "passing", label: "Passing" },
      { value: "dribbling", label: "Dribbling" },
      { value: "shooting", label: "Shooting" },
      { value: "defending", label: "Defending" },
      { value: "possession", label: "Possession" },
      { value: "1v1", label: "1v1 Skills" },
      { value: "first touch", label: "First Touch" },
      { value: "transition", label: "Transition" },
      { value: "decision making", label: "Decision Making" },
      { value: "fun", label: "Fun & Games" },
    ],
  }[sport] || [];

  return (
    <div>
      <PageHero gradient={cfg.heroGradient}
        title={`${cfg.emoji} Generate Training Plan`}
        subtitle="Create an age-appropriate, phase-structured practice plan in seconds"
      />

      {sport !== "Soccer" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16 }}>
          <Info size={18} color="#16a34a" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5, margin: 0 }}>
            <strong>{sport}</strong> plan generation is live with {(drillsBySport[sport] || []).length} drills across all phases.
          </p>
        </div>
      )}

      <div style={{ ...cardStyle, padding: "20px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 600, transition: "all 0.3s",
                  background: i <= step ? c.green500 : "transparent",
                  color: i <= step ? c.white : c.slate400,
                  border: `2px solid ${i <= step ? c.green500 : c.slate300}`,
                }}>{i < step ? "✓" : i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: i === step ? 600 : 400, color: i <= step ? c.slate800 : c.slate400 }}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div style={{ width: 40, height: 2, background: i < step ? c.green500 : c.slate200, transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: "32px 36px", cursor: "default" }}>
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Team Info</h2>
            <p style={{ color: c.slate500, marginBottom: 24, fontSize: 14 }}>Tell us about your team</p>

            {teamsData.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Quick Select a Team</label>
                <div style={{ display: "flex", gap: 10, margin: "10px 0 0 0" }}>
                  {teamsData.map(team => {
                    const teamAge = AGE_GROUPS.find(ag => ag.value === team.age);
                    const isSelected = config.ageGroup === team.age && config.playerCount === team.players.length;
                    return (
                      <div key={team.id} onClick={() => setConfig(prev => ({ ...prev, ageGroup: team.age, playerCount: team.players.length }))}
                        style={{
                          ...selectCard(isSelected), flex: 1, padding: "16px 20px",
                          background: isSelected ? `linear-gradient(135deg, ${c.green50}, ${c.green100})` : c.white,
                          border: isSelected ? `2px solid ${c.green500}` : `2px solid ${c.slate200}`,
                        }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: isSelected ? c.green500 : c.green100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: isSelected ? c.white : c.green700, transition: "all 0.2s" }}>{team.age}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: c.slate800, fontSize: 15 }}>{team.name}</div>
                            <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{team.players.length} players · {team.season}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: c.slate200 }} />
              <span style={{ fontSize: 12, color: c.slate500, fontWeight: 500 }}>or configure manually</span>
              <div style={{ flex: 1, height: 1, background: c.slate200 }} />
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Age Group</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "10px 0 24px 0" }}>
              {AGE_GROUPS.map(ag => (
                <div key={ag.value} onClick={() => setConfig(prev => ({ ...prev, ageGroup: ag.value }))} style={selectCard(config.ageGroup === ag.value)}>
                  <div style={{ fontWeight: 600, color: c.slate800, fontSize: 15 }}>{ag.label}</div>
                  <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{ag.philosophy}</div>
                </div>
              ))}
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Number of Players</label>
            <div style={{ display: "flex", gap: 8, margin: "10px 0 0 0", flexWrap: "wrap" }}>
              {[8, 10, 12, 14, 16, 18, 20, 22].map(n => (
                <div key={n} onClick={() => setConfig(prev => ({ ...prev, playerCount: n }))}
                  style={{ ...selectCard(config.playerCount === n), minWidth: 56, textAlign: "center" }}>
                  <span style={{ fontWeight: 700, color: c.slate800, fontSize: 16 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Session Setup</h2>
            <p style={{ color: c.slate500, marginBottom: 24, fontSize: 14 }}>Configure your training session</p>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Duration (minutes)</label>
            <div style={{ display: "flex", gap: 10, margin: "10px 0 24px 0" }}>
              {DURATION_OPTIONS.map(d => (
                <div key={d} onClick={() => setConfig(prev => ({ ...prev, duration: d }))}
                  style={{ ...selectCard(config.duration === d), flex: 1, textAlign: "center", padding: "18px 16px" }}>
                  <span style={{ fontWeight: 700, fontSize: 24, color: c.slate800 }}>{d}</span>
                  <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>min</div>
                </div>
              ))}
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Available Equipment</label>
            <div style={{ display: "flex", gap: 8, margin: "10px 0 0 0", flexWrap: "wrap" }}>
              {(EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).map(e => {
                const selected = config.equipment.includes(e);
                return (
                  <div key={e} onClick={() => {
                    if (selected) {
                      setConfig(prev => ({ ...prev, equipment: prev.equipment.filter(eq => eq !== e) }));
                    } else {
                      setConfig(prev => ({ ...prev, equipment: [...prev.equipment, e] }));
                    }
                  }} style={{ ...selectCard(selected), textTransform: "capitalize" }}>
                    {e}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Focus Areas</h2>
            <p style={{ color: c.slate500, marginBottom: 24, fontSize: 14 }}>What should this session focus on?</p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FOCUS_OPTIONS.map(f => {
                const selected = config.focusAreas.includes(f.value);
                return (
                  <div key={f.value} onClick={() => {
                    if (selected) {
                      setConfig(prev => ({ ...prev, focusAreas: prev.focusAreas.filter(fa => fa !== f.value) }));
                    } else {
                      setConfig(prev => ({ ...prev, focusAreas: [...prev.focusAreas, f.value] }));
                    }
                  }} style={{ ...selectCard(selected), padding: "12px 16px" }}>
                    {f.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "space-between" }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: step === 0 ? c.slate100 : c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: step === 0 ? "default" : "pointer", opacity: step === 0 ? 0.5 : 1 }}>← Back</button>
          <div style={{ display: "flex", gap: 8 }}>
            {step < 2 && <button onClick={() => setStep(step + 1)} disabled={!canProceed()} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: canProceed() ? c.green600 : c.slate200, color: c.white, fontWeight: 600, fontSize: 13, cursor: canProceed() ? "pointer" : "default" }}>Next →</button>}
            {step === 2 && <button onClick={handleGenerate} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: c.green600, color: c.white, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Sparkles size={14} /> Generate Plan</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
