import React from "react";
import { Timer, Users, Calendar } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { defaultHistoryData } from "../constants/defaults.js";
import { PageHero, HoverCard, Stars } from "../components/ui/index.js";

export default function HistoryPage() {
  const [history] = useLocalStorage("practiceHistory", defaultHistoryData);
  return (
    <div>
      <PageHero
        gradient={`linear-gradient(135deg, #0f172a 0%, #334155 100%)`}
        title="Practice History"
        subtitle="Log and track your completed sessions"
      />

      {history.length === 0 ? (
        <div style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          padding: "60px 40px",
          textAlign: "center",
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-full)",
            background: "var(--color-surface-alt)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-5)",
          }}>
            <Calendar size={28} color="var(--color-text-faint)" />
          </div>
          <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>
            No practice history yet
          </h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", maxWidth: 300, margin: "0 auto" }}>
            Complete and log a practice to see your history here
          </p>
        </div>
      ) : (
        <div className="stagger-children" style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {history.map((session) => (
            <HoverCard key={session.id}>
              <div style={{ padding: "var(--space-5) var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-3)" }}>
                  <div>
                    <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)" }}>
                      {session.plan}
                    </h3>
                    <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{session.date}</span>
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-faint)" }}>·</span>
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{session.team}</span>
                    </div>
                  </div>
                  <Stars rating={session.rating} />
                </div>

                <div style={{ display: "flex", gap: "var(--space-5)", marginBottom: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
                    <Timer size={14} color="var(--color-text-faint)" />
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{session.duration} min</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
                    <Users size={14} color="var(--color-text-faint)" />
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                      {session.attendance}/{session.total} attended
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <div style={{ width: 80, height: 8, borderRadius: "var(--radius-full)", background: "var(--color-surface-alt)", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${(session.attendance / session.total) * 100}%`,
                          height: "100%",
                          borderRadius: "var(--radius-full)",
                          background: "var(--color-primary)",
                          animation: "progressFill 0.8s ease-out",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: "var(--weight-medium)" }}>
                      {Math.round((session.attendance / session.total) * 100)}%
                    </span>
                  </div>
                </div>

                {session.notes && (
                  <div
                    style={{
                      padding: "var(--space-3) var(--space-4)",
                      background: "var(--color-surface-alt)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      lineHeight: "var(--leading-normal)",
                    }}
                  >
                    {session.notes}
                  </div>
                )}
              </div>
            </HoverCard>
          ))}
        </div>
      )}
    </div>
  );
}
