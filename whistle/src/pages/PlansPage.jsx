import React from "react";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig } from "../constants/sports.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultPracticePlans } from "../constants/defaults.js";
import { PageHero, HeroBtn, HoverCard } from "../components/ui/index.js";

const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

export default function PlansPage({ sport, setPage }) {
  const [plans] = useLocalStorage("practicePlans", defaultPracticePlans);
  return (
    <div>
      <PageHero gradient={sportConfig[sport].heroGradient} title={`${sportConfig[sport].emoji} Practice Plans`}
        subtitle="All your saved practice plans"
        actions={<HeroBtn label="Generate New Plan" primary icon={Sparkles} onClick={() => setPage("generate")} />}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {plans.map(plan => (
          <HoverCard key={plan.id}>
            <div style={{ padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                {plan.status === "complete" ? <CheckCircle2 size={22} color={c.green500} style={{ flexShrink: 0, marginTop: 2 }} /> : <Circle size={22} color={c.slate300} style={{ flexShrink: 0, marginTop: 2 }} />}
                <h3 style={{ fontSize: 15, fontWeight: 600, color: c.slate800, lineHeight: 1.4 }}>{plan.title}</h3>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{plan.age}</span>
                <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{plan.duration} min</span>
                <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{plan.drills} drills</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {(plan.focus || []).map(f => <span key={f} style={{ ...badgeBase, background: "#dbeafe", color: "#1d4ed8", fontSize: 11 }}>{f}</span>)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: c.slate500 }}>{plan.date}</span>
                <span style={{ ...badgeBase, background: plan.status === "complete" ? c.green100 : c.slate100, color: plan.status === "complete" ? c.green700 : c.slate500, fontSize: 11 }}>
                  {plan.status === "complete" ? "Complete" : "Draft"}
                </span>
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
