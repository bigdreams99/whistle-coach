import React, { useState, useEffect } from "react";
import { RotateCcw, Download, Printer, Share2, ChevronLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { phaseColorMap } from "../constants/colors.js";
import { AGE_GROUPS } from "../constants/sports.js";
import { handleExportPDF, handlePrint, handleShare } from "../utils/planExport.js";
import { Breadcrumb, Badge, Button, Card } from "../components/ui/index.js";
import { useIsMobile } from "../hooks/useIsMobile.js";

export default function PlanResultPage({ plan: initialPlan, config, sport = "Soccer", setPage, onRegenerate, onSavePlan, onLogPractice }) {
  const [plan, setPlan] = useState(initialPlan);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [saved, setSaved] = useState(false);
  const [animatedBars, setAnimatedBars] = useState(false);
  const isMobile = useIsMobile();
  const ageInfo = AGE_GROUPS.find((a) => a.value === config.ageGroup);
  const totalTime = plan.reduce((sum, p) => sum + p.phaseDuration, 0);
  const phaseLabels = { "Warm-Up": "warmup", Technical: "technical", Tactical: "tactical", Game: "game", "Cool-Down": "cooldown" };

  // Animate phase bar on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedBars(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-enter">
      <Breadcrumb items={[{ label: "Generate Plan", onClick: () => setPage("generate") }, { label: "Your Training Plan" }]} />

      {/* Header card */}
      <Card elevation="mid" padding="lg" style={{ marginBottom: "var(--space-6)", cursor: "default" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div>
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)", lineHeight: "var(--leading-tight)" }}>
              Your Training Plan
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>
              {ageInfo?.label} · {config.playerCount} players · {totalTime} min · Focus: {config.focusAreas.join(", ")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <Button
              variant={saved ? "primary" : "primary"}
              size="md"
              icon={CheckCircle2}
              onClick={() => { if (onSavePlan) onSavePlan(""); setSaved(true); }}
              disabled={saved}
              style={saved ? { background: "var(--color-primary-dark)" } : { background: "linear-gradient(135deg, var(--color-primary), var(--color-emerald))", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)" }}
            >
              {saved ? "Plan Saved!" : "Save Plan"}
            </Button>
            <Button variant="secondary" size="md" icon={Download} onClick={() => handleExportPDF(plan, config, sport, ageInfo)}>Export</Button>
            <Button variant="secondary" size="md" icon={Printer} onClick={() => handlePrint(plan, config, sport, ageInfo)}>Print</Button>
            <Button variant="secondary" size="md" icon={Share2} onClick={() => handleShare(plan, config, sport, ageInfo)}>Share</Button>
            <Button variant="secondary" size="md" icon={RotateCcw} onClick={onRegenerate}>Regenerate</Button>
            <Button variant="secondary" size="md" icon={ChevronLeft} onClick={() => setPage("generate")}>Edit</Button>
          </div>
        </div>

        {/* Phase progress bar */}
        <div
          style={{
            display: "flex",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            height: 12,
            marginTop: "var(--space-5)",
            background: "var(--color-surface-alt)",
          }}
        >
          {plan.map((p, i) => {
            const phaseKey = phaseLabels[p.phaseLabel];
            return (
              <div
                key={i}
                style={{
                  flex: animatedBars ? p.phaseDuration : 0,
                  background: phaseColorMap[phaseKey] || "var(--color-primary)",
                  transition: `flex var(--transition-slow)`,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", marginTop: "var(--space-2)", gap: "var(--space-4)", flexWrap: "wrap" }}>
          {plan.map((p, i) => {
            const phaseKey = phaseLabels[p.phaseLabel];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: phaseColorMap[phaseKey] || "var(--color-primary)" }} />
                {p.phaseLabel} ({p.phaseDuration}')
              </div>
            );
          })}
        </div>
      </Card>

      {/* Drill cards */}
      <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {plan.map((drill, i) => {
          const phaseKey = phaseLabels[drill.phaseLabel];
          const color = phaseColorMap[phaseKey] || "var(--color-primary)";
          const expanded = expandedIdx === i;
          let runningTime = 0;
          for (let j = 0; j < i; j++) runningTime += plan[j].phaseDuration;

          return (
            <Card
              key={i}
              elevation={expanded ? "mid" : "low"}
              interactive
              onClick={() => setExpandedIdx(expanded ? null : i)}
              style={{
                border: expanded ? `2px solid ${color}` : "1px solid var(--color-border)",
              }}
            >
              <div style={{ padding: "var(--space-5) var(--space-6)", display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "var(--radius-lg)",
                    background: `${color}18`,
                    color: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--weight-bold)",
                    flexShrink: 0,
                  }}
                >
                  {drill.phaseDuration}'
                </div>
                <div style={{ flex: 1 }}>
                  <div className="overline" style={{ color: color, marginBottom: 2 }}>
                    {drill.phaseLabel} · {runningTime}'–{runningTime + drill.phaseDuration}'
                  </div>
                  <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-primary)", lineHeight: "var(--leading-snug)" }}>
                    {drill.name}
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  color="var(--color-text-faint)"
                  style={{
                    transition: `transform var(--transition-base)`,
                    transform: expanded ? "rotate(180deg)" : "none",
                  }}
                />
              </div>

              {expanded && (
                <div
                  style={{
                    padding: "0 var(--space-6) var(--space-6) var(--space-6)",
                    borderTop: "1px solid var(--color-border)",
                    animation: "fadeInDown 0.2s ease-out",
                  }}
                >
                  <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", margin: "var(--space-4) 0" }}>
                    {drill.description}
                  </p>
                  <div style={{ display: "flex", gap: "var(--space-1-5)", flexWrap: "wrap" }}>
                    {drill.equipment?.map((e) => (
                      <Badge key={e} bg={`${color}12`} textColor={color} style={{ textTransform: "capitalize" }}>
                        {e}
                      </Badge>
                    ))}
                    <Badge bg={`${color}12`} textColor={color}>
                      {drill.players?.[0]}–{drill.players?.[1]} players
                    </Badge>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
