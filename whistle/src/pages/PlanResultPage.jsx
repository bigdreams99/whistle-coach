import React, { useState } from "react";
import { RotateCcw, Download, Printer, Share2, ChevronLeft, CheckCircle2 } from "lucide-react";
import { c, phaseColorMap } from "../constants/colors.js";
import { AGE_GROUPS } from "../constants/sports.js";
import { generatePlan, getDrillPool } from "../utils/planGenerator.js";
import { handleExportPDF, handlePrint, handleShare } from "../utils/planExport.js";
import { Breadcrumb } from "../components/ui/index.js";

const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};

const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

export default function PlanResultPage({ plan: initialPlan, config, sport = "Soccer", setPage, onRegenerate, onSavePlan, onLogPractice }) {
  const [plan, setPlan] = useState(initialPlan);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [swappingIdx, setSwappingIdx] = useState(null);
  const [saved, setSaved] = useState(false);
  const ageInfo = AGE_GROUPS.find(a => a.value === config.ageGroup);
  const totalTime = plan.reduce((sum, p) => sum + p.phaseDuration, 0);
  const phaseLabels = { "Warm-Up": "warmup", "Technical": "technical", "Tactical": "tactical", "Game": "game", "Cool-Down": "cooldown" };

  return (
    <div>
      <Breadcrumb items={[
        { label: "Generate Plan", onClick: () => setPage("generate") },
        { label: "Your Training Plan" },
      ]} />

      <div style={{ ...cardStyle, padding: "28px 32px", marginBottom: 24, cursor: "default" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Your Training Plan</h1>
            <p style={{ fontSize: 14, color: c.slate500, marginBottom: 4 }}>{ageInfo?.label} · {config.playerCount} players · {totalTime} min · Focus: {config.focusAreas.join(", ")}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => { if (onSavePlan) onSavePlan(""); setSaved(true); }} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: saved ? c.green700 : `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, color: c.white, fontWeight: 600, fontSize: 13, cursor: saved ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={15} /> {saved ? "Plan Saved!" : "Save Plan"}</button>
            <button onClick={() => handleExportPDF(plan, config, sport, ageInfo)} style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Download size={15} /> Export PDF</button>
            <button onClick={() => handlePrint(plan, config, sport, ageInfo)} style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Printer size={15} /> Print</button>
            <button onClick={() => handleShare(plan, config, sport, ageInfo)} style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Share2 size={15} /> Share</button>
            <button onClick={onRegenerate} style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><RotateCcw size={15} /> Regenerate</button>
            <button onClick={() => setPage("generate")} style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><ChevronLeft size={15} /> Edit Settings</button>
          </div>
        </div>

        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 10, marginTop: 20, background: c.slate100 }}>
          {plan.map((p, i) => (
            <div key={i} style={{ flex: p.phaseDuration, background: phaseColorMap[phaseLabels[p.phaseLabel]] || c.green500, transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 8, gap: 16 }}>
          {plan.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: c.slate500 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: phaseColorMap[phaseLabels[p.phaseLabel]] || c.green500 }} />
              {p.phaseLabel} ({p.phaseDuration}')
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {plan.map((drill, i) => {
          const phaseKey = phaseLabels[drill.phaseLabel];
          const color = phaseColorMap[phaseKey] || c.green500;
          const expanded = expandedIdx === i;
          let runningTime = 0;
          for (let j = 0; j < i; j++) runningTime += plan[j].phaseDuration;

          return (
            <div key={i} onClick={() => setExpandedIdx(expanded ? null : i)} style={{
              ...cardStyle, border: expanded ? `2px solid ${color}` : `1px solid ${c.slate200}`,
            }}>
              <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${color}18`, color: color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, flexShrink: 0,
                }}>{drill.phaseDuration}'</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {drill.phaseLabel} · {runningTime}'–{runningTime + drill.phaseDuration}'
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: c.slate800, marginTop: 2 }}>{drill.name}</div>
                </div>
              </div>

              {expanded && (
                <div style={{ padding: "0 24px 24px 24px", borderTop: `1px solid ${c.slate200}` }}>
                  <p style={{ color: c.slate500, fontSize: 14, lineHeight: 1.7, margin: "16px 0" }}>{drill.description}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {drill.equipment?.map(e => (
                      <span key={e} style={{ ...badgeBase, background: `${color}12`, color: color, textTransform: "capitalize" }}>{e}</span>
                    ))}
                    <span style={{ ...badgeBase, background: `${color}12`, color: color }}>{drill.players?.[0]}–{drill.players?.[1]} players</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
