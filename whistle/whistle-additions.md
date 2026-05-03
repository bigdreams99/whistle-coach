# Whistle App — Feature Additions

> **How to use this file:** Each section contains complete React component code that matches the existing `whistle-app.jsx` patterns (inline styles, functional components, hooks, `c` color tokens, `lucide-react` icons). After the parallel task finishes editing `whistle-app.jsx`, merge these additions in by:
>
> 1. Adding new imports at the top
> 2. Pasting each component above the main `WhistleApp` component
> 3. Adding new nav items and page routes in the `pages` object
> 4. Adding new `useLocalStorage` state hooks in `WhistleApp`

---

## 1. Season Planner Feature

### What it does
A full season planning view (8–16 weeks) where coaches map out practices across the season with progressive skill development, drag-and-drop reordering, sport-specific templates, and completion tracking.

### New imports needed

Add to the existing import block at the top of `whistle-app.jsx`:

```jsx
// Add to the lucide-react import line:
import { /* ...existing imports... */ GripVertical, CalendarDays, Repeat, MapPin } from "lucide-react";
```

### New nav item

In the `Sidebar` component, add to the `navItems` array (after "history"):

```jsx
{ key: "season", label: "Season Plan", icon: CalendarDays },
```

### New page route

In the `pages` object inside `WhistleApp`, add:

```jsx
season: <SeasonPlannerPage sport={sport} setPage={setPage} />,
```

### New state in `WhistleApp`

Add these `useLocalStorage` hooks alongside the existing ones:

```jsx
const [seasonPlans, setSeasonPlans] = useLocalStorage("seasonPlans", []);
```

### Component Code

Paste this above the `WhistleApp` function:

```jsx
// ═══════════════════════════════════════════════════════════════════════════
// SEASON PLANNER
// ═══════════════════════════════════════════════════════════════════════════

const SEASON_TEMPLATES = {
  Soccer: [
    {
      name: "Full Season (12 weeks)",
      weeks: 12,
      phases: [
        { name: "Pre-Season", weeks: [1, 2, 3], focus: "Fitness, fundamentals, team bonding", color: c.blue500 },
        { name: "Early Season", weeks: [4, 5, 6], focus: "Skill development, basic tactics", color: c.green500 },
        { name: "Mid-Season", weeks: [7, 8, 9], focus: "Tactical depth, set pieces, game situations", color: c.amber500 },
        { name: "Tournament Prep", weeks: [10, 11, 12], focus: "Match sharpness, mental prep, peak performance", color: c.rose500 },
      ],
    },
    {
      name: "Short Season (8 weeks)",
      weeks: 8,
      phases: [
        { name: "Foundation", weeks: [1, 2], focus: "Fitness baseline, core skills", color: c.blue500 },
        { name: "Development", weeks: [3, 4, 5], focus: "Technical growth, small-sided play", color: c.green500 },
        { name: "Competition", weeks: [6, 7, 8], focus: "Game tactics, pressure situations", color: c.amber500 },
      ],
    },
    {
      name: "Extended Season (16 weeks)",
      weeks: 16,
      phases: [
        { name: "Pre-Season", weeks: [1, 2, 3, 4], focus: "Conditioning, fundamentals, assessment", color: c.blue500 },
        { name: "Early Season", weeks: [5, 6, 7, 8], focus: "Technical refinement, build-up play", color: c.green500 },
        { name: "Mid-Season", weeks: [9, 10, 11, 12], focus: "Tactical systems, positional play", color: c.purple500 },
        { name: "Late Season", weeks: [13, 14, 15, 16], focus: "Peak form, tournament prep, review", color: c.rose500 },
      ],
    },
  ],
  Basketball: [
    {
      name: "Full Season (12 weeks)",
      weeks: 12,
      phases: [
        { name: "Pre-Season", weeks: [1, 2, 3], focus: "Conditioning, fundamentals, ball handling", color: c.blue500 },
        { name: "Early Season", weeks: [4, 5, 6], focus: "Shooting form, offensive sets, man defense", color: c.green500 },
        { name: "Mid-Season", weeks: [7, 8, 9], focus: "Play execution, zone defense, fast break", color: c.amber500 },
        { name: "Playoffs", weeks: [10, 11, 12], focus: "Scouting adjustments, clutch situations, peak focus", color: c.rose500 },
      ],
    },
  ],
  Baseball: [
    {
      name: "Full Season (12 weeks)",
      weeks: 12,
      phases: [
        { name: "Pre-Season", weeks: [1, 2, 3], focus: "Arm care, hitting fundamentals, fielding basics", color: c.blue500 },
        { name: "Early Season", weeks: [4, 5, 6], focus: "Live at-bats, defensive positioning, baserunning", color: c.green500 },
        { name: "Mid-Season", weeks: [7, 8, 9], focus: "Situational hitting, cutoffs/relays, pitch sequences", color: c.amber500 },
        { name: "Postseason Prep", weeks: [10, 11, 12], focus: "Clutch situations, short game, mental toughness", color: c.rose500 },
      ],
    },
  ],
  Football: [
    {
      name: "Full Season (12 weeks)",
      weeks: 12,
      phases: [
        { name: "Camp", weeks: [1, 2, 3], focus: "Conditioning, install base offense/defense, fundamentals", color: c.blue500 },
        { name: "Early Season", weeks: [4, 5, 6], focus: "Game plan refinement, special teams, situational", color: c.green500 },
        { name: "Mid-Season", weeks: [7, 8, 9], focus: "Advanced schemes, opponent-specific adjustments", color: c.amber500 },
        { name: "Playoff Push", weeks: [10, 11, 12], focus: "Peak execution, two-minute drills, red zone", color: c.rose500 },
      ],
    },
  ],
};

// Progressive focus mapping: what to emphasize each phase of the season
const PROGRESSIVE_FOCUS = {
  Soccer: {
    "Pre-Season": ["fitness", "passing", "dribbling", "first touch", "fun"],
    "Foundation": ["fitness", "passing", "dribbling", "first touch", "fun"],
    "Early Season": ["passing", "dribbling", "shooting", "1v1", "first touch"],
    "Development": ["passing", "dribbling", "shooting", "1v1", "first touch"],
    "Mid-Season": ["possession", "defending", "transition", "decision making", "shooting"],
    "Competition": ["possession", "defending", "transition", "decision making"],
    "Tournament Prep": ["transition", "decision making", "defending", "shooting"],
    "Late Season": ["transition", "decision making", "defending", "shooting"],
    "Playoffs": ["transition", "decision making", "defending", "shooting"],
    "Postseason Prep": ["transition", "decision making", "defending", "shooting"],
    "Camp": ["fitness", "passing", "dribbling", "fun"],
    "Playoff Push": ["transition", "decision making", "defending"],
  },
  Basketball: {
    "Pre-Season": ["dribbling", "shooting", "passing", "footwork", "fun"],
    "Early Season": ["shooting", "passing", "defense", "layups", "rebounding"],
    "Mid-Season": ["teamwork", "transition", "defense", "shooting"],
    "Playoffs": ["teamwork", "transition", "defense", "shooting"],
  },
  Baseball: {
    "Pre-Season": ["throwing", "hitting", "fielding", "fun"],
    "Early Season": ["hitting", "fielding", "pitching", "baserunning"],
    "Mid-Season": ["situational", "pitching", "hitting", "teamwork"],
    "Postseason Prep": ["situational", "hitting", "pitching"],
  },
  Football: {
    "Camp": ["passing", "catching", "running", "agility", "fun"],
    "Early Season": ["passing", "route running", "defense", "teamwork"],
    "Mid-Season": ["teamwork", "defense", "passing", "blocking"],
    "Playoff Push": ["teamwork", "defense", "passing", "agility"],
  },
};

function SeasonPlannerPage({ sport, setPage }) {
  const [seasonPlans, setSeasonPlans] = useLocalStorage("seasonPlans", []);
  const [activePlan, setActivePlan] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const isMobile = useIsMobile();

  const sportTemplates = SEASON_TEMPLATES[sport] || SEASON_TEMPLATES.Soccer;
  const currentPlan = activePlan
    ? seasonPlans.find((p) => p.id === activePlan)
    : null;

  const createFromTemplate = (template) => {
    const startDate = new Date();
    // Find next Monday
    const dayOfWeek = startDate.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    startDate.setDate(startDate.getDate() + daysUntilMonday);

    const weeks = [];
    for (let i = 0; i < template.weeks; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + i * 7);
      const phase = template.phases.find((p) => p.weeks.includes(i + 1));
      const focusOptions = PROGRESSIVE_FOCUS[sport]?.[phase?.name] || [];

      weeks.push({
        id: `w-${Date.now()}-${i}`,
        weekNumber: i + 1,
        date: weekDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        phase: phase?.name || "General",
        phaseColor: phase?.color || c.slate400,
        focus: focusOptions.slice(0, 2),
        practices: [
          { id: `p-${Date.now()}-${i}-1`, title: "", status: "planned", drills: [] },
        ],
        completed: false,
        notes: "",
      });
    }

    const newPlan = {
      id: `sp-${Date.now()}`,
      name: `${sport} ${template.name}`,
      sport,
      template: template.name,
      createdAt: new Date().toISOString(),
      weeks,
    };

    setSeasonPlans((prev) => [...prev, newPlan]);
    setActivePlan(newPlan.id);
    setShowTemplates(false);
  };

  const toggleWeekComplete = (weekId) => {
    setSeasonPlans((prev) =>
      prev.map((plan) =>
        plan.id === activePlan
          ? {
              ...plan,
              weeks: plan.weeks.map((w) =>
                w.id === weekId ? { ...w, completed: !w.completed } : w
              ),
            }
          : plan
      )
    );
  };

  const updateWeekNotes = (weekId, notes) => {
    setSeasonPlans((prev) =>
      prev.map((plan) =>
        plan.id === activePlan
          ? {
              ...plan,
              weeks: plan.weeks.map((w) =>
                w.id === weekId ? { ...w, notes } : w
              ),
            }
          : plan
      )
    );
  };

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    setSeasonPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== activePlan) return plan;
        const newWeeks = [...plan.weeks];
        const [moved] = newWeeks.splice(dragIdx, 1);
        newWeeks.splice(idx, 0, moved);
        // Re-number weeks
        return {
          ...plan,
          weeks: newWeeks.map((w, i) => ({ ...w, weekNumber: i + 1 })),
        };
      })
    );
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const deletePlan = (planId) => {
    setSeasonPlans((prev) => prev.filter((p) => p.id !== planId));
    if (activePlan === planId) setActivePlan(null);
  };

  // ── Template Picker ──
  if (showTemplates) {
    return (
      <div>
        <PageHero
          title="Choose a Season Template"
          subtitle={`Pick a starting structure for your ${sport} season. You can customize everything after.`}
          gradient={sportConfig[sport]?.heroGradient}
        />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {sportTemplates.map((tmpl, idx) => (
            <HoverCard key={idx} onClick={() => createFromTemplate(tmpl)} style={{ padding: 0 }}>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: c.slate800, marginBottom: 8 }}>
                  {tmpl.name}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {tmpl.phases.map((phase, i) => (
                    <span key={i} style={{
                      ...badgeBase,
                      background: phase.color + "18",
                      color: phase.color,
                    }}>
                      {phase.name} ({phase.weeks.length}w)
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: c.slate500 }}>
                  {tmpl.phases.map((p) => p.focus).join(" → ")}
                </div>
              </div>
              <div style={{ padding: "12px 20px", background: c.green50, borderTop: `1px solid ${c.slate100}`, display: "flex", alignItems: "center", gap: 6, color: c.green700, fontWeight: 600, fontSize: 13 }}>
                <Plus size={14} /> Use This Template
              </div>
            </HoverCard>
          ))}
        </div>
        <button onClick={() => setShowTemplates(false)} style={{
          marginTop: 16, padding: "10px 20px", borderRadius: 10,
          border: `1px solid ${c.slate200}`, background: c.white,
          color: c.slate600, fontWeight: 600, fontSize: 14, cursor: "pointer",
        }}>
          Back
        </button>
      </div>
    );
  }

  // ── Active Season Plan View ──
  if (currentPlan) {
    const completedWeeks = currentPlan.weeks.filter((w) => w.completed).length;
    const totalWeeks = currentPlan.weeks.length;
    const progressPct = Math.round((completedWeeks / totalWeeks) * 100);
    const phases = [...new Set(currentPlan.weeks.map((w) => w.phase))];

    return (
      <div>
        <PageHero
          title={currentPlan.name}
          subtitle={`${completedWeeks} of ${totalWeeks} weeks completed · ${progressPct}% through the season`}
          gradient={sportConfig[sport]?.heroGradient}
          actions={
            <>
              <HeroBtn label="Back to Plans" icon={ChevronLeft} onClick={() => setActivePlan(null)} />
            </>
          }
        />

        {/* Progress bar */}
        <div style={{ background: c.slate100, borderRadius: 8, height: 8, marginBottom: 24, overflow: "hidden" }}>
          <div style={{
            width: `${progressPct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${c.green500}, ${c.green400})`,
            borderRadius: 8,
            transition: "width 0.3s ease",
          }} />
        </div>

        {/* Phase legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          {phases.map((phase) => {
            const pw = currentPlan.weeks.find((w) => w.phase === phase);
            return (
              <div key={phase} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: c.slate600 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: pw?.phaseColor || c.slate400 }} />
                {phase}
              </div>
            );
          })}
        </div>

        {/* Week timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {currentPlan.weeks.map((week, idx) => (
            <div
              key={week.id}
              draggable={!isMobile}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                background: c.white,
                borderRadius: 12,
                border: `1px solid ${dragOverIdx === idx ? c.green400 : c.slate200}`,
                overflow: "hidden",
                opacity: week.completed ? 0.7 : 1,
                transition: "all 0.2s",
              }}
            >
              {/* Phase color bar */}
              <div style={{ width: 5, background: week.phaseColor, flexShrink: 0 }} />

              {/* Drag handle */}
              {!isMobile && (
                <div style={{
                  display: "flex", alignItems: "center", padding: "0 8px",
                  cursor: "grab", color: c.slate300,
                }}>
                  <GripVertical size={16} />
                </div>
              )}

              {/* Week content */}
              <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 8 : 16 }}>
                {/* Week number + date */}
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: c.slate800 }}>
                    Week {week.weekNumber}
                  </div>
                  <div style={{ fontSize: 12, color: c.slate400 }}>{week.date}</div>
                </div>

                {/* Phase badge */}
                <span style={{
                  ...badgeBase,
                  background: week.phaseColor + "18",
                  color: week.phaseColor,
                  fontSize: 11,
                }}>
                  {week.phase}
                </span>

                {/* Focus areas */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", flex: 1 }}>
                  {week.focus.map((f) => (
                    <span key={f} style={{
                      ...badgeBase,
                      background: c.slate100,
                      color: c.slate600,
                      fontSize: 11,
                    }}>
                      {f}
                    </span>
                  ))}
                </div>

                {/* Notes input */}
                <input
                  type="text"
                  placeholder="Add notes..."
                  value={week.notes}
                  onChange={(e) => updateWeekNotes(week.id, e.target.value)}
                  style={{
                    flex: 1,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: `1px solid ${c.slate200}`,
                    fontSize: 13,
                    color: c.slate700,
                    background: c.slate50,
                    outline: "none",
                    minWidth: 120,
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Complete toggle */}
              <button
                onClick={() => toggleWeekComplete(week.id)}
                aria-label={week.completed ? "Mark incomplete" : "Mark complete"}
                style={{
                  padding: "0 16px",
                  border: "none",
                  background: week.completed ? c.green50 : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: week.completed ? c.green600 : c.slate300,
                  transition: "all 0.15s",
                }}
              >
                {week.completed
                  ? <CheckCircle2 size={22} />
                  : <Circle size={22} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Season Plans List (default view) ──
  const myPlans = seasonPlans.filter((p) => p.sport === sport);

  return (
    <div>
      <PageHero
        title="Season Planner"
        subtitle="Map out your entire season with progressive skill development. Start from a template and customize each week."
        gradient={sportConfig[sport]?.heroGradient}
        actions={
          <HeroBtn label="New Season Plan" primary icon={Plus} onClick={() => setShowTemplates(true)} />
        }
      />

      {myPlans.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
        }}>
          <CalendarDays size={48} color={c.slate300} style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, marginBottom: 8 }}>
            No season plans yet
          </h3>
          <p style={{ fontSize: 14, color: c.slate500, marginBottom: 20 }}>
            Create your first season plan from a template to get started.
          </p>
          <button onClick={() => setShowTemplates(true)} style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: c.green600, color: c.white, fontWeight: 600,
            fontSize: 14, cursor: "pointer",
          }}>
            Choose a Template
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {myPlans.map((plan) => {
            const done = plan.weeks.filter((w) => w.completed).length;
            const total = plan.weeks.length;
            const pct = Math.round((done / total) * 100);
            return (
              <HoverCard key={plan.id} style={{ padding: 0 }}>
                <div style={{ padding: 20 }} onClick={() => setActivePlan(plan.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800 }}>
                      {plan.name}
                    </h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); deletePlan(plan.id); }}
                      aria-label="Delete plan"
                      style={{
                        padding: 4, border: "none", background: "transparent",
                        cursor: "pointer", color: c.slate400,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: c.slate500, marginBottom: 12 }}>
                    {total} weeks · {done} completed · {pct}% done
                  </div>
                  <div style={{ background: c.slate100, borderRadius: 6, height: 6, overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%",
                      background: c.green500, borderRadius: 6,
                    }} />
                  </div>
                </div>
              </HoverCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

## 2. Animated Drill Diagrams

### What it does
A reusable `DrillAnimation` component that renders SVG-based animated drill visualizations with player dots moving along paths, cone/marker positions, and play/pause controls. Covers the most common drill patterns.

### Component Code

Paste this alongside the existing `DrillDiagram` component:

```jsx
// ═══════════════════════════════════════════════════════════════════════════
// ANIMATED DRILL DIAGRAMS
// ═══════════════════════════════════════════════════════════════════════════

const DRILL_ANIMATIONS = {
  passingCircle: {
    label: "Passing Circle",
    fieldWidth: 200,
    fieldHeight: 200,
    players: (count = 6) => {
      const ps = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        ps.push({ x: 100 + Math.cos(angle) * 70, y: 100 + Math.sin(angle) * 70 });
      }
      return ps;
    },
    cones: [],
    paths: (count = 6) => {
      // Ball passes across the circle in sequence
      const ps = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        ps.push({ x: 100 + Math.cos(angle) * 70, y: 100 + Math.sin(angle) * 70 });
      }
      const result = [];
      for (let i = 0; i < count; i++) {
        const next = (i + 2) % count; // pass to the player across
        result.push({ from: ps[i], to: ps[next], delay: i * 0.4, type: "ball" });
      }
      return result;
    },
  },
  shuttleRun: {
    label: "Shuttle Run",
    fieldWidth: 240,
    fieldHeight: 140,
    players: () => [
      { x: 30, y: 70 },
      { x: 30, y: 90 },
      { x: 30, y: 110 },
    ],
    cones: [
      { x: 30, y: 50 },
      { x: 120, y: 50 },
      { x: 210, y: 50 },
    ],
    paths: () => [
      {
        waypoints: [
          { x: 30, y: 70 },
          { x: 120, y: 70 },
          { x: 30, y: 70 },
          { x: 210, y: 70 },
          { x: 30, y: 70 },
        ],
        delay: 0,
        type: "player",
      },
      {
        waypoints: [
          { x: 30, y: 90 },
          { x: 120, y: 90 },
          { x: 30, y: 90 },
          { x: 210, y: 90 },
          { x: 30, y: 90 },
        ],
        delay: 0.3,
        type: "player",
      },
    ],
  },
  oneVone: {
    label: "1v1 to Goal",
    fieldWidth: 200,
    fieldHeight: 240,
    players: () => [
      { x: 100, y: 200, team: "A" },
      { x: 100, y: 160, team: "B" },
    ],
    cones: [
      { x: 60, y: 130 },
      { x: 140, y: 130 },
    ],
    paths: () => [
      {
        waypoints: [
          { x: 100, y: 200 },
          { x: 70, y: 160 },
          { x: 90, y: 120 },
          { x: 100, y: 40 },
        ],
        delay: 0,
        type: "player",
      },
      {
        waypoints: [
          { x: 100, y: 160 },
          { x: 80, y: 140 },
          { x: 95, y: 100 },
          { x: 100, y: 50 },
        ],
        delay: 0.2,
        type: "defender",
      },
    ],
    goals: [{ x: 80, y: 20, w: 40, h: 15 }],
  },
  smallSided: {
    label: "Small-Sided Game (3v3)",
    fieldWidth: 260,
    fieldHeight: 180,
    players: () => [
      { x: 50, y: 60, team: "A" },
      { x: 80, y: 120, team: "A" },
      { x: 50, y: 140, team: "A" },
      { x: 180, y: 50, team: "B" },
      { x: 200, y: 100, team: "B" },
      { x: 180, y: 140, team: "B" },
    ],
    cones: [],
    paths: () => [
      {
        waypoints: [{ x: 50, y: 60 }, { x: 100, y: 50 }, { x: 140, y: 70 }],
        delay: 0,
        type: "player",
      },
      {
        waypoints: [{ x: 80, y: 120 }, { x: 130, y: 110 }, { x: 160, y: 90 }],
        delay: 0.3,
        type: "player",
      },
      { from: { x: 50, y: 60 }, to: { x: 80, y: 120 }, delay: 0.1, type: "ball" },
      { from: { x: 80, y: 120 }, to: { x: 140, y: 70 }, delay: 0.6, type: "ball" },
    ],
    goals: [
      { x: 5, y: 70, w: 10, h: 40 },
      { x: 245, y: 70, w: 10, h: 40 },
    ],
  },
  relayRace: {
    label: "Relay Race",
    fieldWidth: 260,
    fieldHeight: 140,
    players: () => [
      { x: 20, y: 40, team: "A" },
      { x: 20, y: 70, team: "A" },
      { x: 20, y: 100, team: "B" },
      { x: 20, y: 130, team: "B" },
    ],
    cones: [
      { x: 130, y: 40 },
      { x: 130, y: 70 },
      { x: 130, y: 100 },
      { x: 130, y: 130 },
      { x: 240, y: 40 },
      { x: 240, y: 100 },
    ],
    paths: () => [
      {
        waypoints: [
          { x: 20, y: 40 }, { x: 130, y: 40 }, { x: 240, y: 40 },
          { x: 130, y: 40 }, { x: 20, y: 40 },
        ],
        delay: 0,
        type: "player",
      },
      {
        waypoints: [
          { x: 20, y: 100 }, { x: 130, y: 100 }, { x: 240, y: 100 },
          { x: 130, y: 100 }, { x: 20, y: 100 },
        ],
        delay: 0.2,
        type: "player",
      },
    ],
  },
};

function DrillAnimation({ drillType = "passingCircle", sport = "Soccer", width = 300, height = 200 }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 4000; // 4-second loop

  const config = DRILL_ANIMATIONS[drillType];
  if (!config) return null;

  const fieldColor = sportConfig[sport]?.fieldColor || c.green600;
  const players = config.players();
  const cones = config.cones || [];
  const goals = config.goals || [];
  const paths = config.paths();

  const vw = config.fieldWidth;
  const vh = config.fieldHeight;

  useEffect(() => {
    if (!playing) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = (elapsed % DURATION) / DURATION; // 0 → 1 looping
      setProgress(t);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      startRef.current = null;
    };
  }, [playing]);

  // Interpolate a point along a path of waypoints
  const interpolate = (waypoints, t) => {
    if (!waypoints || waypoints.length < 2) return waypoints?.[0] || { x: 0, y: 0 };
    const segCount = waypoints.length - 1;
    const rawIdx = t * segCount;
    const idx = Math.floor(rawIdx);
    const frac = rawIdx - idx;
    const from = waypoints[Math.min(idx, segCount)];
    const to = waypoints[Math.min(idx + 1, segCount)];
    return {
      x: from.x + (to.x - from.x) * frac,
      y: from.y + (to.y - from.y) * frac,
    };
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        style={{
          width,
          height,
          borderRadius: 12,
          background: fieldColor,
          display: "block",
        }}
      >
        {/* Field markings */}
        <rect x="4" y="4" width={vw - 8} height={vh - 8} rx="6" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

        {/* Goals */}
        {goals.map((g, i) => (
          <rect key={`goal-${i}`} x={g.x} y={g.y} width={g.w} height={g.h} rx="2" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
        ))}

        {/* Cones */}
        {cones.map((cn, i) => (
          <polygon
            key={`cone-${i}`}
            points={`${cn.x},${cn.y - 5} ${cn.x - 4},${cn.y + 3} ${cn.x + 4},${cn.y + 3}`}
            fill={c.orange500}
            stroke="white"
            strokeWidth="0.5"
          />
        ))}

        {/* Movement paths (dotted lines showing where players go) */}
        {paths
          .filter((p) => p.waypoints)
          .map((path, i) => {
            const pts = path.waypoints;
            const d = pts.map((p, j) => `${j === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
            return (
              <path
                key={`path-${i}`}
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
            );
          })}

        {/* Ball pass lines */}
        {paths
          .filter((p) => p.from && p.to && p.type === "ball")
          .map((path, i) => {
            const delayedT = Math.max(0, progress - path.delay);
            const opacity = delayedT > 0 && delayedT < 0.3 ? 0.6 : 0.15;
            return (
              <line
                key={`ballpath-${i}`}
                x1={path.from.x}
                y1={path.from.y}
                x2={path.to.x}
                y2={path.to.y}
                stroke={c.amber400}
                strokeWidth="1.5"
                strokeDasharray="3 2"
                opacity={playing ? opacity : 0.15}
              />
            );
          })}

        {/* Static player positions */}
        {players.map((p, i) => {
          const fillColor = p.team === "B" ? c.rose500 : c.blue500;
          return (
            <circle
              key={`player-${i}`}
              cx={p.x}
              cy={p.y}
              r={7}
              fill={fillColor}
              stroke="white"
              strokeWidth="1.5"
              opacity={0.4}
            />
          );
        })}

        {/* Animated players moving along paths */}
        {playing &&
          paths
            .filter((p) => p.waypoints && p.type !== "ball")
            .map((path, i) => {
              const adjustedT = ((progress - path.delay + 1) % 1);
              const pos = interpolate(path.waypoints, adjustedT);
              const fillColor = path.type === "defender" ? c.rose500 : c.blue500;
              return (
                <circle
                  key={`anim-${i}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={8}
                  fill={fillColor}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}

        {/* Animated ball */}
        {playing &&
          paths
            .filter((p) => p.from && p.to && p.type === "ball")
            .map((path, i) => {
              const adjustedT = Math.max(0, Math.min(1, (progress - path.delay) / 0.25));
              if (adjustedT <= 0 || adjustedT >= 1) return null;
              const x = path.from.x + (path.to.x - path.from.x) * adjustedT;
              const y = path.from.y + (path.to.y - path.from.y) * adjustedT;
              return (
                <circle
                  key={`ball-${i}`}
                  cx={x}
                  cy={y}
                  r={5}
                  fill={c.amber400}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
      </svg>

      {/* Play/Pause control */}
      <button
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? "Pause animation" : "Play animation"}
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect x="1" y="1" width="3" height="10" fill="white" rx="1" />
            <rect x="7" y="1" width="3" height="10" fill="white" rx="1" />
          </svg>
        ) : (
          <Play size={14} fill="white" />
        )}
      </button>
    </div>
  );
}

// ── Usage within DrillDetailPage ──
// Add this inside the DrillDetailPage component, alongside the existing DrillDiagram:
//
//   <div style={{ marginTop: 16 }}>
//     <h4 style={{ fontSize: 14, fontWeight: 600, color: c.slate600, marginBottom: 8 }}>
//       Animated Preview
//     </h4>
//     <DrillAnimation
//       drillType={mapDrillToAnimation(drill)}
//       sport={sport}
//       width={isMobile ? 280 : 400}
//       height={isMobile ? 180 : 260}
//     />
//   </div>
//
// Helper function to map drill focus → animation type:

function mapDrillToAnimation(drill) {
  const focus = drill?.focus || drill?.skills?.map((s) => s.toLowerCase()) || [];
  const phase = drill?.phase || drill?.category || "";

  if (focus.some((f) => f.includes("passing")) && phase === "warmup") return "passingCircle";
  if (focus.some((f) => f.includes("1v1"))) return "oneVone";
  if (focus.some((f) => f.includes("agility") || f.includes("speed"))) return "shuttleRun";
  if (phase === "game" || focus.some((f) => f.includes("match"))) return "smallSided";
  if (focus.some((f) => f.includes("fun") || f.includes("relay"))) return "relayRace";
  if (focus.some((f) => f.includes("passing"))) return "passingCircle";
  return "passingCircle"; // default
}
```

---

## 3. Stripe Payment Integration

### Pricing/Checkout Component

This replaces or extends the existing `PricingPage`. It uses Stripe Checkout (redirect-based) so there's no need to handle card forms or PCI compliance yourself.

```jsx
// ═══════════════════════════════════════════════════════════════════════════
// STRIPE CHECKOUT INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

// Configure this in your environment / hosting platform:
// REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
// You'll also need a small backend or serverless function for creating
// Checkout Sessions (see setup steps below).

const STRIPE_PUBLISHABLE_KEY = typeof window !== "undefined"
  ? window.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_YOUR_KEY_HERE"
  : "";

const PRO_FEATURES = [
  { name: "Season Planning", desc: "Map out your entire season with templates", free: false },
  { name: "PDF Export", desc: "Download practice plans as polished PDFs", free: false },
  { name: "Unlimited Saved Plans", desc: "Save as many practice plans as you need", free: false },
  { name: "Animated Drill Diagrams", desc: "Interactive drill visualizations", free: false },
  { name: "Generate Practice Plans", desc: "AI-powered plan generation", free: true },
  { name: "Drill Library (192+ drills)", desc: "Full access to all drills", free: true },
  { name: "Team Management", desc: "Manage your roster and track attendance", free: true },
  { name: "Practice History", desc: "Log and review past sessions", free: true },
];

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: PRO_FEATURES.filter((f) => f.free).map((f) => f.name),
    cta: "Current Plan",
    disabled: true,
    stripePriceId: null,
  },
  {
    name: "Pro",
    price: "$8",
    period: "/month",
    description: "Everything you need to run a great season",
    features: PRO_FEATURES.map((f) => f.name),
    cta: "Start Free Trial",
    popular: true,
    stripePriceId: "price_YOUR_MONTHLY_PRICE_ID", // Replace after Stripe setup
  },
  {
    name: "Pro Annual",
    price: "$60",
    period: "/year",
    description: "Save 37% with annual billing",
    features: PRO_FEATURES.map((f) => f.name),
    cta: "Start Free Trial",
    stripePriceId: "price_YOUR_ANNUAL_PRICE_ID", // Replace after Stripe setup
    savings: "Save $36/yr",
  },
];

function PricingPagePro({ sport }) {
  const [loading, setLoading] = useState(null);
  const isMobile = useIsMobile();

  const handleCheckout = async (tier) => {
    if (!tier.stripePriceId) return;
    setLoading(tier.name);

    try {
      // Call your backend to create a Checkout Session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: tier.stripePriceId,
          successUrl: window.location.origin + "?checkout=success",
          cancelUrl: window.location.origin + "?checkout=cancel",
        }),
      });
      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(null);
    }
  };

  return (
    <div>
      <PageHero
        title="Upgrade to Whistle Pro"
        subtitle="Unlock season planning, PDF exports, animated diagrams, and unlimited saved plans."
        gradient={sportConfig[sport]?.heroGradient}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 40,
      }}>
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            style={{
              background: c.white,
              borderRadius: 16,
              border: tier.popular
                ? `2px solid ${c.green500}`
                : `1px solid ${c.slate200}`,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {tier.popular && (
              <div style={{
                background: c.green500,
                color: c.white,
                textAlign: "center",
                padding: "4px 0",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}>
                MOST POPULAR
              </div>
            )}

            <div style={{ padding: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>
                {tier.name}
              </h3>
              <p style={{ fontSize: 13, color: c.slate500, marginBottom: 16 }}>
                {tier.description}
              </p>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: c.slate900 }}>
                  {tier.price}
                </span>
                <span style={{ fontSize: 14, color: c.slate500 }}>{tier.period}</span>
                {tier.savings && (
                  <span style={{
                    ...badgeBase,
                    background: c.green100,
                    color: c.green700,
                    marginLeft: 8,
                  }}>
                    {tier.savings}
                  </span>
                )}
              </div>

              <button
                onClick={() => handleCheckout(tier)}
                disabled={tier.disabled || loading === tier.name}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 10,
                  border: tier.disabled ? `1px solid ${c.slate200}` : "none",
                  background: tier.disabled
                    ? c.white
                    : tier.popular
                    ? c.green600
                    : c.slate800,
                  color: tier.disabled ? c.slate400 : c.white,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: tier.disabled ? "default" : "pointer",
                  marginBottom: 20,
                }}
              >
                {loading === tier.name ? "Redirecting..." : tier.cta}
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tier.features.map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: c.slate600 }}>
                    <CheckCircle2 size={14} color={c.green500} />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pro feature gate hook ──
// Use this throughout the app to check if a feature requires Pro:

function useProAccess() {
  const [isPro, setIsPro] = useLocalStorage("wc_isPro", false);

  // On mount, check for successful checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setIsPro(true);
      // Clean up the URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return isPro;
}

// ── Example usage in other components ──
// In SeasonPlannerPage, wrap the content:
//
//   const isPro = useProAccess();
//   if (!isPro) {
//     return (
//       <div style={{ textAlign: "center", padding: 40 }}>
//         <Trophy size={48} color={c.amber400} style={{ marginBottom: 12 }} />
//         <h3>Season Planning is a Pro Feature</h3>
//         <p>Upgrade to map out your entire season.</p>
//         <button onClick={() => setPage("pricing")}>Upgrade to Pro</button>
//       </div>
//     );
//   }
//
// For PDF export, add a similar gate around the download button.
// For saved plans, check: if (!isPro && practicePlans.length >= 3) { show upgrade prompt }
```

### Stripe Dashboard Setup Steps

Follow these steps to configure Stripe for Whistle:

1. **Create a Stripe account** at [dashboard.stripe.com](https://dashboard.stripe.com)

2. **Create your Products:**
   - Go to **Products** → **Add Product**
   - Name: "Whistle Pro Monthly" — Price: $8/month, recurring
   - Name: "Whistle Pro Annual" — Price: $60/year, recurring
   - Copy each Price ID (`price_...`) into the `PRICING_TIERS` array above

3. **Set up a backend endpoint** to create Checkout Sessions. If you're using Vercel, create `api/create-checkout-session.js`:

```js
// api/create-checkout-session.js (Vercel serverless function)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const { priceId, successUrl, cancelUrl } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14,
    },
  });

  res.json({ sessionUrl: session.url });
};
```

4. **Environment Variables** (set in your hosting platform):
   ```
   STRIPE_SECRET_KEY=sk_live_...          # Server-side only, NEVER expose
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Safe for client-side
   ```

5. **Set up a Webhook** for subscription status changes:
   - Go to **Developers** → **Webhooks** → **Add endpoint**
   - URL: `https://whistlecoach.com/api/stripe-webhook`
   - Events to listen for: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`

6. **Test with test keys first** — use `pk_test_...` and `sk_test_...` keys until you're ready to go live. Stripe provides test card numbers like `4242 4242 4242 4242`.

### Features to Gate Behind Pro

| Feature | Free Tier | Pro Tier |
|---------|-----------|----------|
| Generate plans | ✅ Unlimited | ✅ Unlimited |
| Drill library | ✅ All 192+ drills | ✅ All 192+ drills |
| Team management | ✅ 1 team | ✅ Unlimited teams |
| Saved plans | ✅ 3 max | ✅ Unlimited |
| PDF export | ❌ | ✅ |
| Season planning | ❌ | ✅ |
| Animated diagrams | ❌ | ✅ |
| Practice timer | ❌ | ✅ |

---

## 4. Marketing Assets

### 4A. Reddit Posts

These are written as a coach sharing a useful tool — casual, helpful, no marketing-speak.

**Post 1 — r/soccercoaching**

> **Title:** Built a free tool to generate practice plans — 60+ youth soccer drills inside
>
> I coach U10s and got tired of spending Sunday nights scrambling to put together practice plans. I built a little web app called Whistle that generates structured practice plans based on age group, focus area, and how much time you have.
>
> It has 60+ youth soccer drills organized by phase (warm-up → technical → tactical → game → cool-down) and it auto-builds a plan that flows well. You pick the age group, how many players you usually have, what you want to focus on, and it spits out a full session.
>
> It's free to use at whistlecoach.com — no login required to try it. Would love feedback from other coaches. What drills would you add?

**Post 2 — r/soccercoaching**

> **Title:** How do you plan your season progression? (U8-U12)
>
> Second year coaching my U10 team and I've been thinking more about how to structure the whole season vs. just individual practices. Last year I kind of winged it week to week.
>
> This year I'm trying a phased approach: first 3 weeks = fundamentals and fitness, next 3 = tactical concepts, final weeks = game situations and scrimmages.
>
> I've been using a tool called Whistle (whistlecoach.com) that has season planning templates for this — you pick 8, 12, or 16 week seasons and it maps out what to focus on each phase. Has anyone else tried structuring their season this way? What worked?

**Post 3 — r/footballcoaching**

> **Title:** Free practice plan generator with 40+ youth football drills
>
> Hey coaches — I put together a web tool with my buddy that helps generate practice plans for youth football. It's got drills for every position group: QB footwork, route running, defensive coverage, OL techniques, even fun games for the younger kids.
>
> You just pick the age group, how long your practice is, what you want to focus on, and it builds out a full plan with warm-up through cool-down. It's at whistlecoach.com — also covers basketball and baseball if any of you coach multiple sports.
>
> We're still adding drills so let me know what's missing. Trying to make this actually useful and not just another app.

**Post 4 — r/youthsports**

> **Title:** For coaches who spend way too long planning practice
>
> Anyone else spend more time planning practice than actually running it? I started coaching my kid's soccer team last year with zero experience and the hardest part wasn't the actual coaching — it was figuring out WHAT to do for 60 minutes twice a week.
>
> Found a free tool called Whistle (whistlecoach.com) that generates age-appropriate practice plans. You tell it the age group and what skills to work on, and it gives you a structured session with actual drill descriptions and coaching tips. They have soccer, basketball, baseball, and football.
>
> Saved me a ton of time. If you're a parent-turned-coach like me, might be worth checking out.

**Post 5 — r/youthsports**

> **Title:** What's your approach to keeping practices fun AND productive? (Ages 6-10)
>
> Third season coaching and I've learned the hard way that the drills that are "best" for development mean nothing if the kids don't want to come back next week. My U8s need at least 40% of practice to feel like games or they check out.
>
> I've been using this structure: fun warm-up game (Sharks & Minnows, tag with balls), one focused skill drill, then a game that reinforces the skill. I found a drill library at whistlecoach.com that tags drills by intensity and has a "fun" category which has been clutch for planning.
>
> What's your ratio of fun to structured for the younger ages?

### 4B. 60-Second Demo Video Script

```
SCENE 1 (0:00–0:08) — Hook
[Screen recording: whistlecoach.com landing page]
VOICEOVER: "If you coach youth sports and you're tired of spending
your Sunday nights planning practice... this is for you."

SCENE 2 (0:08–0:20) — Generate a Plan
[Click "Generate Plan" → select U10, Soccer, 60 min, Passing & Dribbling]
VOICEOVER: "Pick your age group, how long your practice is, and
what you want to work on. Whistle builds a complete practice plan
in seconds — warm-up through cool-down."

SCENE 3 (0:20–0:32) — Review the Plan
[Scroll through generated plan showing drill cards with diagrams]
VOICEOVER: "Every drill has coaching tips, equipment lists, and
a field diagram so you know exactly what to set up. Don't like a
drill? Swap it with one tap."

SCENE 4 (0:32–0:42) — Drill Library
[Navigate to Drills tab, filter by "Shooting", click a drill]
VOICEOVER: "192 drills across soccer, basketball, baseball, and
football. Filter by age, skill, intensity — find exactly what you need."

SCENE 5 (0:42–0:52) — Season Planner
[Show season planner with weekly timeline, check off a week]
VOICEOVER: "Plan your whole season, not just one practice. Templates
for pre-season through playoffs, with skill progression built in."

SCENE 6 (0:52–1:00) — CTA
[Back to landing page]
VOICEOVER: "Whistle is free to start. No login required.
whistlecoach.com — practice plans that don't take all weekend."
[URL appears large on screen: whistlecoach.com]
```

### 4C. Meta Description & OG Tags

Add these to the `<head>` of your `index.html`:

```html
<!-- Primary Meta Tags -->
<title>Whistle — Youth Sports Practice Plan Generator</title>
<meta name="title" content="Whistle — Youth Sports Practice Plan Generator" />
<meta name="description" content="Generate structured practice plans for youth soccer, basketball, baseball, and football in seconds. 192+ drills with coaching tips, field diagrams, and progressive skill development. Free to use." />
<meta name="keywords" content="youth sports, practice plan, soccer drills, basketball drills, baseball drills, football drills, coaching, youth coaching, practice planner, drill library, season planner" />
<meta name="author" content="Whistle Coach" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://whistlecoach.com/" />
<meta property="og:title" content="Whistle — Youth Sports Practice Plan Generator" />
<meta property="og:description" content="Generate age-appropriate practice plans in seconds. 192+ drills across 4 sports with coaching tips and field diagrams. Free." />
<meta property="og:image" content="https://whistlecoach.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://whistlecoach.com/" />
<meta property="twitter:title" content="Whistle — Youth Sports Practice Plan Generator" />
<meta property="twitter:description" content="Practice plans that don't take all weekend. 192+ youth drills across soccer, basketball, baseball & football." />
<meta property="twitter:image" content="https://whistlecoach.com/og-image.png" />

<!-- Canonical -->
<link rel="canonical" href="https://whistlecoach.com/" />
```

**OG Image guidance:** Create a 1200×630 image with:
- The Whistle logo/name
- A tagline: "Practice plans that don't take all weekend"
- A screenshot or mockup of a generated plan
- Sport icons (⚽🏀⚾🏈)
- Green gradient background matching the app's hero

---

## Integration Checklist

After the parallel task completes, merge everything in this order:

1. **Imports** — Add `GripVertical`, `CalendarDays`, `Repeat`, `MapPin` to the lucide-react import
2. **Season Planner** — Paste `SEASON_TEMPLATES`, `PROGRESSIVE_FOCUS`, and `SeasonPlannerPage` component above `WhistleApp`
3. **Drill Animation** — Paste `DRILL_ANIMATIONS`, `DrillAnimation`, and `mapDrillToAnimation` near `DrillDiagram`
4. **Stripe** — Paste `PricingPagePro`, `useProAccess`, the pricing tiers data, and the backend function
5. **Nav & Routes** — Add `{ key: "season", label: "Season Plan", icon: CalendarDays }` to `navItems` and `season: <SeasonPlannerPage ... />` to the `pages` object
6. **Replace pricing page** — Swap `pricing: <PricingPage ... />` with `pricing: <PricingPagePro ... />`
7. **HTML head** — Add meta/OG tags to `index.html`
8. **Stripe backend** — Deploy the serverless function and set env variables
