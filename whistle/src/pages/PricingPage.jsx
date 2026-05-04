import React from "react";
import { CheckCircle2 } from "lucide-react";
import { sportConfig } from "../constants/sports.js";
import { PageHero, Badge, Button, Card } from "../components/ui/index.js";

export default function PricingPage({ sport }) {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: ["3 practice plans per month", "Full drill library", "Animated drill diagrams", "1 team"],
      active: false,
      popular: false,
    },
    {
      name: "Pro",
      price: "$49.99",
      period: "/year",
      sub: "$4.17/month · Save $21.89/yr",
      features: ["Unlimited practice plans", "Full drill library", "Animated drill diagrams", "Unlimited teams", "PDF export", "Shareable plan links", "Priority support"],
      active: true,
      popular: true,
    },
  ];

  return (
    <div>
      <PageHero
        gradient={sportConfig[sport].heroGradient}
        title="Pricing"
        subtitle="Choose the plan that works for your coaching needs"
      />
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-6)", maxWidth: 800, margin: "0 auto" }}>
        {tiers.map((plan) => (
          <Card
            key={plan.name}
            elevation={plan.popular ? "high" : "low"}
            style={{
              padding: "var(--space-8) var(--space-8)",
              position: "relative",
              border: plan.popular ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
            }}
          >
            {plan.popular && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)" }}>
                <Badge
                  bg="var(--color-primary)"
                  textColor="var(--color-text-inverse)"
                  size="sm"
                >
                  Most Popular
                </Badge>
              </div>
            )}

            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", textAlign: "center", marginBottom: "var(--space-1)" }}>
              {plan.name}
            </h3>

            <div style={{ textAlign: "center", marginBottom: "var(--space-1)" }}>
              <span style={{ fontSize: "var(--text-4xl)", fontWeight: "var(--weight-extrabold)", color: "var(--color-text-primary)" }}>{plan.price}</span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{plan.period}</span>
            </div>

            {plan.sub && (
              <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: "var(--weight-medium)", marginBottom: "var(--space-1)" }}>
                {plan.sub}
              </p>
            )}

            {plan.active && (
              <div style={{ textAlign: "center", marginBottom: "var(--space-3)" }}>
                <Badge color="green">Active (Promo)</Badge>
              </div>
            )}

            <div style={{ marginTop: "var(--space-4)" }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>

            {!plan.active && (
              <Button
                variant="secondary"
                size="lg"
                style={{ width: "100%", marginTop: "var(--space-5)", justifyContent: "center" }}
              >
                Current Plan
              </Button>
            )}
            {plan.active && (
              <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-4)" }}>
                Enjoying free Pro access
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
