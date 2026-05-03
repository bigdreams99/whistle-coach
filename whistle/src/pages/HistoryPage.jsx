import React from "react";
import { Timer, Users } from "lucide-react";
import { c } from "../constants/colors.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultHistoryData } from "../constants/defaults.js";
import { PageHero, HoverCard, Stars } from "../components/ui/index.js";

export default function HistoryPage() {
  const [history] = useLocalStorage("practiceHistory", defaultHistoryData);
  return (
    <div>
      <PageHero gradient={`linear-gradient(135deg, ${c.slate900} 0%, ${c.slate700} 100%)`} title="Practice History" subtitle="Log and track your completed sessions" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {history.map(session => (
          <HoverCard key={session.id}>
            <div style={{ padding: "22px 26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>{session.plan}</h3>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: c.slate500 }}>{session.date}</span>
                    <span style={{ fontSize: 13, color: c.slate500 }}>·</span>
                    <span style={{ fontSize: 13, color: c.slate500 }}>{session.team}</span>
                  </div>
                </div>
                <Stars rating={session.rating} />
              </div>
              <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Timer size={14} color={c.slate400} /><span style={{ fontSize: 13, color: c.slate600 }}>{session.duration} min</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={14} color={c.slate400} /><span style={{ fontSize: 13, color: c.slate600 }}>{session.attendance}/{session.total} attended</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 60, height: 6, borderRadius: 3, background: c.slate200, overflow: "hidden" }}>
                    <div style={{ width: `${(session.attendance / session.total) * 100}%`, height: "100%", borderRadius: 3, background: c.green500 }} />
                  </div>
                  <span style={{ fontSize: 12, color: c.slate500 }}>{Math.round((session.attendance / session.total) * 100)}%</span>
                </div>
              </div>
              {session.notes && <div style={{ padding: "10px 14px", background: c.slate50, borderRadius: 8, fontSize: 13, color: c.slate600, lineHeight: 1.5 }}>{session.notes}</div>}
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
