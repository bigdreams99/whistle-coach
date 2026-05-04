import React from "react";
import { Sparkles, Search, Activity, BarChart3, Award, Trophy, CheckCircle2, Circle, ArrowRight, Zap, Users, ClipboardList } from "lucide-react";
import { sportConfig } from "../constants/sports.js";
import { drillsBySport } from "../data/drills.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultPracticePlans } from "../constants/defaults.js";
import { PageHero, HeroBtn, Stars, Badge, Card } from "../components/ui/index.js";

export default function DashboardPage({ sport, setPage }) {
  const isMobile = useIsMobile();
  const cfg = sportConfig[sport];
  const drills = drillsBySport[sport] || [];
  const [practicePlans] = useLocalStorage("practicePlans", defaultPracticePlans);

  const statCards = [
    { label: "Generate Plan", value: "New", icon: Sparkles, gradient: `linear-gradient(135deg, #16a34a, #059669)`, onClick: () => setPage("generate") },
    { label: "Drill Library", value: String(drills.length), icon: Zap, gradient: `linear-gradient(135deg, #3b82f6, #6366f1)`, onClick: () => setPage("drills") },
    { label: "My Teams", value: "1", icon: Users, gradient: `linear-gradient(135deg, #8b5cf6, #a855f7)`, onClick: () => setPage("teams") },
    { label: "Saved Plans", value: String(practicePlans.length), icon: ClipboardList, gradient: `linear-gradient(135deg, #f59e0b, #f97316)`, onClick: () => setPage("plans") },
  ];

  return (
    <div>
      <PageHero
        gradient={cfg.heroGradient}
        title={`Welcome back, Daniel! ${cfg.emoji}`}
        subtitle={`Ready to build your next great ${sport.toLowerCase()} practice? Generate a plan, browse drills, or manage your teams.`}
        actions={
          <>
            <HeroBtn label="Generate New Plan" primary icon={Sparkles} onClick={() => setPage("generate")} />
            <HeroBtn label="Browse Drills" icon={Search} onClick={() => setPage("drills")} />
          </>
        }
      />

      {/* Stat Cards */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={card.onClick}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.onClick(); } }}
              style={{
                background: card.gradient,
                color: "var(--color-text-inverse)",
                padding: "var(--space-5) var(--space-5)",
                borderRadius: "var(--radius-xl)",
                border: "none",
                boxShadow: "var(--shadow-md)",
                cursor: "pointer",
                transition: `all var(--transition-fast)`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                <span className="overline" style={{ color: "rgba(255,255,255,0.85)" }}>{card.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-bold)" }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Coaching Tip */}
      <div style={{
        background: cfg.heroGradient,
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-5) var(--space-6)",
        color: "var(--color-text-inverse)",
        marginBottom: "var(--space-8)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
      }}>
        <div style={{ width: 42, height: 42, borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Trophy size={20} />
        </div>
        <div>
          <div className="overline" style={{ color: "rgba(255,255,255,0.7)", marginBottom: "var(--space-1)" }}>Coaching Tip</div>
          <div style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}>{cfg.tip}</div>
        </div>
      </div>

      {/* Recent Plans */}
      <Card elevation="low" padding="md" style={{ marginBottom: "var(--space-8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
          <div>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: 2 }}>Recent Practice Plans</h2>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>Your latest practice plans</p>
          </div>
          <button
            onClick={() => setPage("generate")}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "var(--color-primary)",
              color: "var(--color-text-inverse)",
              fontWeight: "var(--weight-semibold)",
              fontFamily: "var(--font-family)",
              fontSize: "var(--text-sm)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              transition: `all var(--transition-fast)`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-primary)"; }}
          >
            <Sparkles size={14} /> Generate New
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {practicePlans.slice(0, 3).map((plan) => (
            <button
              key={plan.id}
              onClick={() => setPage("plans")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                padding: "var(--space-4) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface-alt)",
                transition: `background var(--transition-fast)`,
                cursor: "pointer",
                border: "none",
                width: "100%",
                textAlign: "left",
                fontFamily: "var(--font-family)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-primary-lighter)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-alt)")}
            >
              {plan.status === "complete" ? <CheckCircle2 size={20} color="var(--color-success)" /> : <Circle size={20} color="var(--color-text-faint)" />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-primary)" }}>{plan.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: 2 }}>{plan.date} · {plan.drills} drills</div>
              </div>
              <Badge color="green">{plan.age}</Badge>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{plan.duration} min</span>
              <ArrowRight size={16} color="var(--color-text-faint)" />
            </button>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "var(--space-4)" }}>
        <Card elevation="low" padding="md">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--color-primary-lighter)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Activity size={18} color="var(--color-primary)" />
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-secondary)" }}>This Week</span>
          </div>
          <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)" }}>2</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>practices completed</div>
        </Card>

        <Card elevation="low" padding="md">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--color-accent-blue-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={18} color="var(--color-accent-blue)" />
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-secondary)" }}>Avg Attendance</span>
          </div>
          <div style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)" }}>92%</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: "var(--weight-medium)" }}>+5% from last week</div>
        </Card>

        <Card elevation="low" padding="md">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--color-accent-amber-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={18} color="var(--color-accent-amber)" />
            </div>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-secondary)" }}>Avg Rating</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)" }}>4.0</span>
            <Stars rating={4} />
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>across 3 sessions</div>
        </Card>
      </div>
    </div>
  );
}
