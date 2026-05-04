import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Info } from "lucide-react";
import { sportConfig, AGE_GROUPS, EQUIPMENT_BY_SPORT, DURATION_OPTIONS } from "../constants/sports.js";
import { generatePlan } from "../utils/planGenerator.js";
import { PageHero, HeroBtn, Card, Button } from "../components/ui/index.js";
import { drillsBySport } from "../data/drills.js";
import { defaultTeamsData } from "../constants/defaults.js";

export default function GeneratePlanPage({ sport, setPage, onPlanGenerated }) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState({
    ageGroup: "",
    playerCount: 12,
    duration: 60,
    equipment: (EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).slice(0, 2),
    focusAreas: [],
  });
  const [teamsData] = React.useState(defaultTeamsData);

  const prevSport = useRef(sport);
  useEffect(() => {
    if (prevSport.current !== sport) {
      prevSport.current = sport;
      setConfig((prev) => ({
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
  const FOCUS_OPTIONS =
    {
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

  const selectCardStyle = (selected) => ({
    padding: "var(--space-4) var(--space-4)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    transition: `all var(--transition-base)`,
    border: `2px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
    background: selected ? "var(--color-primary-lighter)" : "var(--color-surface)",
    boxShadow: selected ? "0 0 0 3px var(--color-primary-lighter)" : "none",
  });

  return (
    <div>
      <PageHero
        gradient={cfg.heroGradient}
        title={`${cfg.emoji} Generate Training Plan`}
        subtitle="Create an age-appropriate, phase-structured practice plan in seconds"
      />

      {sport !== "Soccer" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-4) var(--space-5)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-primary-lighter)",
            border: "1px solid var(--color-primary-light)",
            marginBottom: "var(--space-4)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <Info size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-primary-dark)", lineHeight: "var(--leading-normal)", margin: 0 }}>
            <strong>{sport}</strong> plan generation is live with {(drillsBySport[sport] || []).length} drills across all phases.
          </p>
        </div>
      )}

      {/* Stepper */}
      <Card elevation="low" padding="sm" style={{ marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <div
                  aria-current={i === step ? "step" : undefined}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--weight-semibold)",
                    transition: `all var(--transition-slow)`,
                    background: i <= step ? "var(--color-primary)" : "transparent",
                    color: i <= step ? "var(--color-text-inverse)" : "var(--color-text-faint)",
                    border: `2px solid ${i <= step ? "var(--color-primary)" : "var(--color-text-faint)"}`,
                    boxShadow: i === step ? "0 0 0 3px var(--color-primary-lighter)" : "none",
                  }}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: i === step ? "var(--weight-semibold)" : "var(--weight-regular)",
                    color: i <= step ? "var(--color-text-primary)" : "var(--color-text-faint)",
                  }}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div
                  style={{
                    width: 40,
                    height: 2,
                    borderRadius: 1,
                    background: i < step ? "var(--color-primary)" : "var(--color-border)",
                    transition: `background var(--transition-slow)`,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step content */}
      <Card elevation="low" style={{ cursor: "default" }}>
        <div style={{ padding: "var(--space-8) var(--space-8)" }} className="page-enter" key={step}>
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)" }}>Team Info</h2>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-6)", fontSize: "var(--text-sm)" }}>Tell us about your team</p>

              {teamsData.length > 0 && (
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <label className="overline">Quick Select a Team</label>
                  <div style={{ display: "flex", gap: "var(--space-3)", margin: "var(--space-3) 0 0 0" }}>
                    {teamsData.map((team) => {
                      const isSelected = config.ageGroup === team.age && config.playerCount === team.players.length;
                      return (
                        <div
                          key={team.id}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          onClick={() => setConfig((prev) => ({ ...prev, ageGroup: team.age, playerCount: team.players.length }))}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setConfig((prev) => ({ ...prev, ageGroup: team.age, playerCount: team.players.length })); } }}
                          style={{
                            ...selectCardStyle(isSelected),
                            flex: 1,
                            padding: "var(--space-4) var(--space-5)",
                            background: isSelected ? "var(--color-primary-lighter)" : "var(--color-surface)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: "var(--radius-md)",
                                background: isSelected ? "var(--color-primary)" : "var(--color-primary-light)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "var(--text-xs)",
                                fontWeight: "var(--weight-bold)",
                                color: isSelected ? "var(--color-text-inverse)" : "var(--color-primary-dark)",
                                transition: `all var(--transition-base)`,
                              }}
                            >
                              {team.age}
                            </div>
                            <div>
                              <div style={{ fontWeight: "var(--weight-semibold)", color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}>{team.name}</div>
                              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 2 }}>
                                {team.players.length} players · {team.season}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
                <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: "var(--weight-medium)" }}>or configure manually</span>
                <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
              </div>

              <label className="overline">Age Group</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", margin: "var(--space-3) 0 var(--space-6) 0" }}>
                {AGE_GROUPS.map((ag) => (
                  <div
                    key={ag.value}
                    role="button"
                    tabIndex={0}
                    aria-pressed={config.ageGroup === ag.value}
                    onClick={() => setConfig((prev) => ({ ...prev, ageGroup: ag.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setConfig((prev) => ({ ...prev, ageGroup: ag.value })); } }}
                    style={selectCardStyle(config.ageGroup === ag.value)}
                  >
                    <div style={{ fontWeight: "var(--weight-semibold)", color: "var(--color-text-primary)", fontSize: "var(--text-base)" }}>{ag.label}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 2 }}>{ag.philosophy}</div>
                  </div>
                ))}
              </div>

              <label className="overline">Number of Players</label>
              <div style={{ display: "flex", gap: "var(--space-2)", margin: "var(--space-3) 0 0 0", flexWrap: "wrap" }}>
                {[8, 10, 12, 14, 16, 18, 20, 22].map((n) => (
                  <div
                    key={n}
                    role="button"
                    tabIndex={0}
                    aria-pressed={config.playerCount === n}
                    onClick={() => setConfig((prev) => ({ ...prev, playerCount: n }))}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setConfig((prev) => ({ ...prev, playerCount: n })); } }}
                    style={{ ...selectCardStyle(config.playerCount === n), minWidth: 56, textAlign: "center" }}
                  >
                    <span style={{ fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", fontSize: "var(--text-lg)" }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)" }}>Session Setup</h2>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-6)", fontSize: "var(--text-sm)" }}>Configure your training session</p>

              <label className="overline">Duration (minutes)</label>
              <div style={{ display: "flex", gap: "var(--space-3)", margin: "var(--space-3) 0 var(--space-6) 0" }}>
                {DURATION_OPTIONS.map((d) => (
                  <div
                    key={d}
                    role="button"
                    tabIndex={0}
                    aria-pressed={config.duration === d}
                    onClick={() => setConfig((prev) => ({ ...prev, duration: d }))}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setConfig((prev) => ({ ...prev, duration: d })); } }}
                    style={{ ...selectCardStyle(config.duration === d), flex: 1, textAlign: "center", padding: "var(--space-5) var(--space-4)" }}
                  >
                    <span style={{ fontWeight: "var(--weight-bold)", fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}>{d}</span>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 2 }}>min</div>
                  </div>
                ))}
              </div>

              <label className="overline">Available Equipment</label>
              <div style={{ display: "flex", gap: "var(--space-2)", margin: "var(--space-3) 0 0 0", flexWrap: "wrap" }}>
                {(EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).map((e) => {
                  const selected = config.equipment.includes(e);
                  return (
                    <div
                      key={e}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected}
                      onClick={() => {
                        if (selected) {
                          setConfig((prev) => ({ ...prev, equipment: prev.equipment.filter((eq) => eq !== e) }));
                        } else {
                          setConfig((prev) => ({ ...prev, equipment: [...prev.equipment, e] }));
                        }
                      }}
                      onKeyDown={(ev) => {
                        if (ev.key === "Enter" || ev.key === " ") {
                          ev.preventDefault();
                          if (selected) {
                            setConfig((prev) => ({ ...prev, equipment: prev.equipment.filter((eq) => eq !== e) }));
                          } else {
                            setConfig((prev) => ({ ...prev, equipment: [...prev.equipment, e] }));
                          }
                        }
                      }}
                      style={{ ...selectCardStyle(selected), textTransform: "capitalize" }}
                    >
                      {e}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)" }}>Focus Areas</h2>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-6)", fontSize: "var(--text-sm)" }}>What should this session focus on?</p>

              <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                {FOCUS_OPTIONS.map((f) => {
                  const selected = config.focusAreas.includes(f.value);
                  return (
                    <div
                      key={f.value}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected}
                      onClick={() => {
                        if (selected) {
                          setConfig((prev) => ({ ...prev, focusAreas: prev.focusAreas.filter((fa) => fa !== f.value) }));
                        } else {
                          setConfig((prev) => ({ ...prev, focusAreas: [...prev.focusAreas, f.value] }));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (selected) {
                            setConfig((prev) => ({ ...prev, focusAreas: prev.focusAreas.filter((fa) => fa !== f.value) }));
                          } else {
                            setConfig((prev) => ({ ...prev, focusAreas: [...prev.focusAreas, f.value] }));
                          }
                        }
                      }}
                      style={{ ...selectCardStyle(selected), padding: "var(--space-3) var(--space-4)" }}
                    >
                      {f.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-8)", justifyContent: "space-between" }}>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              ← Back
            </Button>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {step < 2 && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next →
                </Button>
              )}
              {step === 2 && (
                <Button
                  variant="primary"
                  size="md"
                  icon={Sparkles}
                  onClick={handleGenerate}
                  style={{
                    background: canProceed() ? "linear-gradient(135deg, var(--color-primary), var(--color-emerald))" : undefined,
                    boxShadow: canProceed() ? "0 4px 12px rgba(22, 163, 74, 0.3)" : undefined,
                  }}
                  disabled={!canProceed()}
                >
                  Generate Plan
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
