import React from "react";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";
import { sportConfig } from "../constants/sports.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultPracticePlans } from "../constants/defaults.js";
import { PageHero, HeroBtn, HoverCard, Badge } from "../components/ui/index.js";

export default function PlansPage({ sport, setPage }) {
  const [plans] = useLocalStorage("practicePlans", defaultPracticePlans);
  return (
    <div>
      <PageHero
        gradient={sportConfig[sport].heroGradient}
        title={`${sportConfig[sport].emoji} Practice Plans`}
        subtitle="All your saved practice plans"
        actions={<HeroBtn label="Generate New Plan" primary icon={Sparkles} onClick={() => setPage("generate")} />}
      />
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
        {plans.map((plan) => (
          <HoverCard key={plan.id}>
            <div style={{ padding: "var(--space-5) var(--space-6)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                {plan.status === "complete" ? (
                  <CheckCircle2 size={22} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <Circle size={22} color="var(--color-text-faint)" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-primary)", lineHeight: "var(--leading-snug)" }}>
                  {plan.title}
                </h3>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", marginBottom: "var(--space-3)" }}>
                <Badge color="green">{plan.age}</Badge>
                <Badge color="gray">{plan.duration} min</Badge>
                <Badge color="gray">{plan.drills} drills</Badge>
              </div>
              <div style={{ display: "flex", gap: "var(--space-1-5)", flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
                {(plan.focus || []).map((f) => (
                  <Badge key={f} color="blue" size="sm">{f}</Badge>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{plan.date}</span>
                <Badge color={plan.status === "complete" ? "green" : "gray"} size="sm">
                  {plan.status === "complete" ? "Complete" : "Draft"}
                </Badge>
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
