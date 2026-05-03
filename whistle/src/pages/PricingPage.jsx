import React from "react";
import { CheckCircle2 } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig } from "../constants/sports.js";
import { PageHero } from "../components/ui/index.js";

const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};

const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

export default function PricingPage({ sport }) {
  const tiers = [
    { name: "Free", price: "$0", period: "/month", features: ["3 practice plans per month","Full drill library","Animated drill diagrams","1 team"], active: false, popular: false },
    { name: "Pro", price: "$49.99", period: "/year", sub: "$4.17/month · Save $21.89/yr", features: ["Unlimited practice plans","Full drill library","Animated drill diagrams","Unlimited teams","PDF export","Shareable plan links","Priority support"], active: true, popular: true },
  ];
  return (
    <div>
      <PageHero gradient={sportConfig[sport].heroGradient} title="Pricing" subtitle="Choose the plan that works for your coaching needs" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
        {tiers.map(plan => (
          <div key={plan.name} style={{ ...cardStyle, padding: "32px 28px", position: "relative", border: plan.popular ? `2px solid ${c.green500}` : `1px solid ${c.slate200}` }}>
            {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", ...badgeBase, background: c.green600, color: c.white, fontSize: 11 }}>Most Popular</div>}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, textAlign: "center", marginBottom: 4 }}>{plan.name}</h3>
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: c.slate900 }}>{plan.price}</span>
              <span style={{ fontSize: 14, color: c.slate500 }}>{plan.period}</span>
            </div>
            {plan.sub && <p style={{ textAlign: "center", fontSize: 13, color: c.green600, fontWeight: 500, marginBottom: 4 }}>{plan.sub}</p>}
            {plan.active && <div style={{ textAlign: "center", marginBottom: 12 }}><span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>Active (Promo)</span></div>}
            <div style={{ marginTop: 16 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14, color: c.slate600 }}><CheckCircle2 size={16} color={c.green500} />{f}</div>
              ))}
            </div>
            {!plan.active && <button style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 10, border: "none", background: c.slate100, color: c.slate600, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Current Plan</button>}
            {plan.active && <p style={{ textAlign: "center", fontSize: 13, color: c.slate500, marginTop: 16 }}>Enjoying free Pro access</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
