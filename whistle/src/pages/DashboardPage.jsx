import React from "react";
import { Sparkles, Search, Activity, BarChart3, Award, Trophy, CheckCircle2, Circle, ArrowRight, Zap, Users, ClipboardList } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig, drillsBySport } from "../constants/sports.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultPracticePlans } from "../constants/defaults.js";
import { PageHero, HeroBtn, Stars } from "../components/ui/index.js";

const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};
const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};

export default function DashboardPage({ sport, setPage }) {
  const isMobile = useIsMobile();
  const cfg = sportConfig[sport];
  const drills = drillsBySport[sport] || [];
  const [practicePlans] = useLocalStorage("practicePlans", defaultPracticePlans);

  const statCards = [
    { label: "Generate Plan", value: "New", icon: Sparkles, gradient: `linear-gradient(135deg, ${c.green600}, ${c.emerald600})`, onClick: () => setPage("generate") },
    { label: "Drill Library", value: String(drills.length), icon: Zap, gradient: `linear-gradient(135deg, ${c.blue500}, #6366f1)`, onClick: () => setPage("drills") },
    { label: "My Teams", value: "1", icon: Users, gradient: `linear-gradient(135deg, ${c.purple500}, #a855f7)`, onClick: () => setPage("teams") },
    { label: "Saved Plans", value: String(practicePlans.length), icon: ClipboardList, gradient: `linear-gradient(135deg, ${c.amber500}, ${c.orange500})`, onClick: () => setPage("plans") },
  ];

  return (
    <div>
      <PageHero gradient={cfg.heroGradient}
        title={`Welcome back, Daniel! ${cfg.emoji}`}
        subtitle={`Ready to build your next great ${sport.toLowerCase()} practice? Generate a plan, browse drills, or manage your teams.`}
        actions={<><HeroBtn label="Generate New Plan" primary icon={Sparkles} onClick={() => setPage("generate")} /><HeroBtn label="Browse Drills" icon={Search} onClick={() => setPage("drills")} /></>}
      />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} onClick={card.onClick} style={{ ...cardStyle, background: card.gradient, color: c.white, padding: "22px 20px", border: "none" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.5 }}>{card.label}</span>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={18} /></div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Coaching Tip */}
      <div style={{ background: cfg.heroGradient, borderRadius: 16, padding: "20px 24px", color: c.white, marginBottom: 28, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Trophy size={20} /></div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, opacity: 0.7, marginBottom: 4 }}>Coaching Tip</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{cfg.tip}</div>
        </div>
      </div>

      {/* Recent Plans */}
      <div style={{ ...cardStyle, padding: "24px 28px", marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, marginBottom: 2 }}>Recent Practice Plans</h2>
            <p style={{ fontSize: 13, color: c.slate500 }}>Your latest practice plans</p>
          </div>
          <button onClick={() => setPage("generate")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: c.green600, color: c.white, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><Sparkles size={14} /> Generate New</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {practicePlans.slice(0, 3).map(plan => (
            <div key={plan.id} onClick={() => setPage("plans")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, background: c.slate50, transition: "background 0.15s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = c.green50}
              onMouseLeave={e => e.currentTarget.style.background = c.slate50}>
              {plan.status === "complete" ? <CheckCircle2 size={20} color={c.green500} /> : <Circle size={20} color={c.slate300} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.slate700 }}>{plan.title}</div>
                <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{plan.date} · {plan.drills} drills</div>
              </div>
              <span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{plan.age}</span>
              <span style={{ fontSize: 13, color: c.slate500 }}>{plan.duration} min</span>
              <ArrowRight size={16} color={c.slate300} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.green50, display: "flex", alignItems: "center", justifyContent: "center" }}><Activity size={18} color={c.green600} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.slate600 }}>This Week</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.slate800 }}>2</div>
          <div style={{ fontSize: 12, color: c.slate500 }}>practices completed</div>
        </div>
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart3 size={18} color={c.blue600} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.slate600 }}>Avg Attendance</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.slate800 }}>92%</div>
          <div style={{ fontSize: 12, color: c.green600, fontWeight: 500 }}>+5% from last week</div>
        </div>
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}><Award size={18} color={c.amber500} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.slate600 }}>Avg Rating</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: c.slate800 }}>4.0</span>
            <Stars rating={4} />
          </div>
          <div style={{ fontSize: 12, color: c.slate500 }}>across 3 sessions</div>
        </div>
      </div>
    </div>
  );
}
