import React from "react";
import { sportConfig } from "../../constants/sports.js";

// ── Color constants ──────────────────────────────────────────────────
const COLORS = {
  teamA: "#3b82f6",
  teamB: "#f43f5e",
  cone: "#f97316",
  ball: "#fbbf24",
  goal: "rgba(255,255,255,0.8)",
  arrow: "rgba(255,255,255,0.5)",
  line: "rgba(255,255,255,0.4)",
  lineDash: "rgba(255,255,255,0.35)",
};

// ── Deterministic seeded RNG from drill id ───────────────────────────
function makeRng(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  // Simple LCG
  let state = Math.abs(h) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// ── Helpers ──────────────────────────────────────────────────────────
function getPlayerCount(players) {
  if (Array.isArray(players)) return Math.min(players[0] || 4, 10);
  if (typeof players === "string") {
    const n = parseInt(players, 10);
    return Math.min(isNaN(n) ? 4 : n, 10);
  }
  return 4;
}

function has(arr, keyword) {
  if (!arr) return false;
  return arr.some((s) => s.toLowerCase().includes(keyword.toLowerCase()));
}

function hasEquip(equipment, keyword) {
  return has(equipment, keyword);
}

// ── SVG micro-components ─────────────────────────────────────────────
function PlayerDot({ x, y, team = "A", r = 3.5 }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill={team === "A" ? COLORS.teamA : COLORS.teamB}
      stroke="white"
      strokeWidth="0.8"
    />
  );
}

function Cone({ x, y }) {
  return (
    <polygon
      points={`${x},${y - 2.5} ${x - 2},${y + 1.5} ${x + 2},${y + 1.5}`}
      fill={COLORS.cone}
      stroke="white"
      strokeWidth="0.4"
      opacity="0.9"
    />
  );
}

function Goal({ x, y, w = 10, h = 5, facing = "up" }) {
  const yOff = facing === "up" ? y - h : y;
  return (
    <rect
      x={x - w / 2}
      y={yOff}
      width={w}
      height={h}
      rx="1"
      fill="none"
      stroke={COLORS.goal}
      strokeWidth="1"
    />
  );
}

function Ball({ x, y }) {
  return (
    <circle cx={x} cy={y} r="2" fill={COLORS.ball} stroke="white" strokeWidth="0.5" />
  );
}

function Arrow({ x1, y1, x2, y2 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const ux = dx / len;
  const uy = dy / len;
  // Arrowhead
  const ax = x2 - ux * 2.5;
  const ay = y2 - uy * 2.5;
  const px = -uy * 1.5;
  const py = ux * 1.5;
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={COLORS.arrow}
        strokeWidth="0.8"
        strokeDasharray="2 1"
      />
      <polygon
        points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`}
        fill={COLORS.arrow}
      />
    </g>
  );
}

function CurvedArrow({ x1, y1, x2, y2, bend = 8 }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return null;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bend;
  const cy = my + ny * bend;
  // Arrowhead at end
  const ux = (x2 - cx) / Math.sqrt((x2 - cx) ** 2 + (y2 - cy) ** 2);
  const uy = (y2 - cy) / Math.sqrt((x2 - cx) ** 2 + (y2 - cy) ** 2);
  const ax = x2 - ux * 2.5;
  const ay = y2 - uy * 2.5;
  const px = -uy * 1.5;
  const py = ux * 1.5;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
        fill="none"
        stroke={COLORS.arrow}
        strokeWidth="0.8"
        strokeDasharray="2 1"
      />
      <polygon
        points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`}
        fill={COLORS.arrow}
      />
    </g>
  );
}

function ZigZagPath({ x, y, segments = 4, width = 6, height = 40 }) {
  const step = height / segments;
  let d = `M ${x} ${y}`;
  for (let i = 0; i < segments; i++) {
    const xOff = i % 2 === 0 ? width : -width;
    d += ` L ${x + xOff} ${y + step * (i + 1)}`;
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={COLORS.arrow}
      strokeWidth="0.8"
      strokeDasharray="2 1"
    />
  );
}

// ── Field backgrounds ────────────────────────────────────────────────
function SoccerField() {
  return (
    <>
      <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
      <line x1="70" y1="2" x2="70" y2="88" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
      <circle cx="70" cy="45" r="14" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
    </>
  );
}

function BasketballCourt() {
  return (
    <>
      <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke={COLORS.line} strokeWidth="1.5" />
      <line x1="70" y1="2" x2="70" y2="88" stroke={COLORS.line} strokeWidth="1" />
      <circle cx="70" cy="45" r="14" fill="none" stroke={COLORS.line} strokeWidth="1" />
    </>
  );
}

function BaseballDiamond() {
  return (
    <>
      <polygon points="70,75 30,40 70,5 110,40" fill="none" stroke={COLORS.line} strokeWidth="1.5" />
      <circle cx="70" cy="45" r="10" fill="none" stroke={COLORS.lineDash} strokeWidth="1" />
    </>
  );
}

function FootballField() {
  return (
    <>
      <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" />
      {/* Yard lines every ~17px (rough 20yd intervals) */}
      {[28, 47, 70, 93, 112].map((x) => (
        <line key={x} x1={x} y1="2" x2={x} y2="88" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />
      ))}
    </>
  );
}

function FieldBackground({ sport }) {
  switch (sport) {
    case "Basketball": return <BasketballCourt />;
    case "Baseball": return <BaseballDiamond />;
    case "Football": return <FootballField />;
    default: return <SoccerField />;
  }
}

// ── Layout generators ────────────────────────────────────────────────
// Each returns { players, cones, goals, arrows, balls, extras }
// players: [{ x, y, team }], cones: [{ x, y }], etc.

function layoutWarmupAgility(rng, count) {
  // Players in a line, zig-zag cones ahead
  const players = [];
  const cones = [];
  for (let i = 0; i < Math.min(count, 5); i++) {
    players.push({ x: 15 + i * 12, y: 70, team: "A" });
  }
  for (let i = 0; i < 5; i++) {
    cones.push({ x: 30 + (i % 2 === 0 ? 8 : -8), y: 15 + i * 11 });
  }
  return {
    players,
    cones,
    goals: [],
    arrows: [],
    zigzag: { x: 30, y: 15, segments: 5, width: 8, height: 55 },
    balls: [],
  };
}

function layoutWarmupPassing(rng, count) {
  // Circle arrangement with passing arrows
  const n = Math.min(count, 6);
  const cx = 70, cy = 45, r = 28;
  const players = [];
  const arrows = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    players.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, team: "A" });
  }
  // A few passing arrows across circle
  if (n >= 4) {
    arrows.push({ x1: players[0].x, y1: players[0].y, x2: players[2].x, y2: players[2].y, curved: true });
    arrows.push({ x1: players[1].x, y1: players[1].y, x2: players[3].x, y2: players[3].y, curved: true });
  }
  return { players, cones: [], goals: [], arrows, balls: [{ x: cx, y: cy }], zigzag: null };
}

function layoutWarmupDribbling(rng, count) {
  // Scattered in a grid with boundary cones
  const players = [];
  const cones = [];
  const n = Math.min(count, 6);
  for (let i = 0; i < n; i++) {
    players.push({
      x: 30 + rng() * 80,
      y: 20 + rng() * 50,
      team: "A",
    });
  }
  // Boundary cones
  cones.push({ x: 20, y: 15 }, { x: 120, y: 15 }, { x: 20, y: 75 }, { x: 120, y: 75 });
  return { players, cones, goals: [], arrows: [], balls: [{ x: players[0]?.x + 3 || 50, y: players[0]?.y || 40 }], zigzag: null };
}

function layoutTechnicalPassing(rng, count) {
  // Pairs facing each other
  const players = [];
  const arrows = [];
  const pairs = Math.min(Math.floor(count / 2), 3);
  for (let i = 0; i < pairs; i++) {
    const y = 22 + i * 22;
    players.push({ x: 35, y, team: "A" });
    players.push({ x: 105, y, team: "A" });
    arrows.push({ x1: 39, y1: y, x2: 101, y2: y });
  }
  return { players, cones: [], goals: [], arrows, balls: [{ x: 70, y: 22 }], zigzag: null };
}

function layoutTechnicalDribbling(rng, count) {
  // Line of cones with a player weaving
  const cones = [];
  const players = [{ x: 20, y: 45, team: "A" }];
  for (let i = 0; i < 6; i++) {
    cones.push({ x: 35 + i * 15, y: 45 });
  }
  return {
    players,
    cones,
    goals: [],
    arrows: [],
    balls: [{ x: 23, y: 43 }],
    zigzag: { x: 28, y: 35, segments: 6, width: 7.5, height: 80 },
    zigzagHorizontal: true,
  };
}

function layoutTechnicalShooting(rng, count) {
  // Players lined up facing a goal
  const players = [];
  const n = Math.min(count, 5);
  for (let i = 0; i < n; i++) {
    players.push({ x: 25 + i * 10, y: 65, team: "A" });
  }
  const arrows = [{ x1: 60, y1: 62, x2: 70, y2: 18, curved: true }];
  return {
    players,
    cones: [],
    goals: [{ x: 70, y: 8, facing: "down" }],
    arrows,
    balls: [{ x: 62, y: 60 }],
    zigzag: null,
  };
}

function layoutTechnicalGoalkeeping(rng, count) {
  // GK at goal, shots coming in
  const players = [{ x: 70, y: 12, team: "A" }]; // GK
  // Shooters
  const shooters = [
    { x: 40, y: 55, team: "B" },
    { x: 70, y: 65, team: "B" },
    { x: 100, y: 55, team: "B" },
  ];
  const arrows = shooters.map((s) => ({
    x1: s.x, y1: s.y, x2: 70, y2: 15, curved: true,
  }));
  return {
    players: [...players, ...shooters],
    cones: [],
    goals: [{ x: 70, y: 6, facing: "down" }],
    arrows,
    balls: [{ x: 70, y: 60 }],
    zigzag: null,
  };
}

function layoutTacticalPossession(rng, count) {
  // Rondo circle layout
  const n = Math.min(count, 6);
  const cx = 70, cy = 45, r = 26;
  const players = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    players.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, team: "A" });
  }
  // 1-2 defenders in center
  players.push({ x: cx + 3, y: cy - 3, team: "B" });
  if (count >= 6) players.push({ x: cx - 4, y: cy + 4, team: "B" });
  const arrows = [];
  if (n >= 3) {
    arrows.push({ x1: players[0].x, y1: players[0].y, x2: players[1].x, y2: players[1].y });
    arrows.push({ x1: players[1].x, y1: players[1].y, x2: players[2].x, y2: players[2].y });
  }
  return {
    players,
    cones: [{ x: cx - r - 2, y: cy - r - 2 }, { x: cx + r + 2, y: cy - r - 2 }, { x: cx - r - 2, y: cy + r + 2 }, { x: cx + r + 2, y: cy + r + 2 }],
    goals: [],
    arrows,
    balls: [{ x: players[0]?.x + 3 || cx, y: players[0]?.y || cy }],
    zigzag: null,
  };
}

function layoutTacticalDefending(rng, count) {
  // Two lines facing each other
  const players = [];
  const arrows = [];
  const n = Math.min(Math.floor(count / 2), 4);
  for (let i = 0; i < n; i++) {
    const x = 30 + i * 25;
    players.push({ x, y: 30, team: "A" });
    players.push({ x, y: 60, team: "B" });
    arrows.push({ x1: x, y1: 57, x2: x, y2: 33 });
  }
  return { players, cones: [], goals: [], arrows, balls: [{ x: 30, y: 28 }], zigzag: null };
}

function layoutTacticalTransition(rng, count) {
  // Two goals on opposite ends, players in between
  const players = [];
  const n = Math.min(count, 8);
  const half = Math.floor(n / 2);
  for (let i = 0; i < half; i++) {
    players.push({ x: 30 + rng() * 30, y: 30 + rng() * 30, team: "A" });
  }
  for (let i = 0; i < n - half; i++) {
    players.push({ x: 80 + rng() * 30, y: 30 + rng() * 30, team: "B" });
  }
  const arrows = [
    { x1: 50, y1: 45, x2: 15, y2: 45, curved: true },
    { x1: 90, y1: 45, x2: 125, y2: 45, curved: true },
  ];
  return {
    players,
    cones: [],
    goals: [{ x: 8, y: 38, facing: "right" }, { x: 132, y: 38, facing: "left" }],
    arrows,
    balls: [{ x: 70, y: 45 }],
    zigzag: null,
    sideGoals: true,
  };
}

function layoutTacticalAttacking(rng, count) {
  // Overload formation (3v2 style)
  const players = [
    { x: 40, y: 50, team: "A" },
    { x: 70, y: 60, team: "A" },
    { x: 100, y: 50, team: "A" },
    { x: 55, y: 35, team: "B" },
    { x: 85, y: 35, team: "B" },
  ];
  // GK
  players.push({ x: 70, y: 12, team: "B" });
  const arrows = [
    { x1: 70, y1: 57, x2: 70, y2: 18, curved: false },
    { x1: 42, y1: 48, x2: 65, y2: 20, curved: true },
    { x1: 98, y1: 48, x2: 75, y2: 20, curved: true },
  ];
  return {
    players,
    cones: [],
    goals: [{ x: 70, y: 6, facing: "down" }],
    arrows,
    balls: [{ x: 70, y: 55 }],
    zigzag: null,
  };
}

function layoutGame(rng, count) {
  // Two teams spread across the field
  const players = [];
  const n = Math.min(count, 10);
  const half = Math.floor(n / 2);
  for (let i = 0; i < half; i++) {
    players.push({ x: 15 + rng() * 50, y: 15 + rng() * 60, team: "A" });
  }
  for (let i = 0; i < n - half; i++) {
    players.push({ x: 75 + rng() * 50, y: 15 + rng() * 60, team: "B" });
  }
  return {
    players,
    cones: [],
    goals: [{ x: 8, y: 38, facing: "right" }, { x: 132, y: 38, facing: "left" }],
    arrows: [],
    balls: [{ x: 70, y: 45 }],
    zigzag: null,
    sideGoals: true,
  };
}

function layoutCooldown(rng, count) {
  // Players in a relaxed circle
  const n = Math.min(count, 8);
  const cx = 70, cy = 45, r = 25;
  const players = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    players.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, team: "A" });
  }
  return { players, cones: [], goals: [], arrows: [], balls: [{ x: cx, y: cy }], zigzag: null };
}

// ── Layout selector ──────────────────────────────────────────────────
function selectLayout(drill, rng) {
  const { phase, focus, equipment, players, name } = drill;
  const count = getPlayerCount(players);
  const focusArr = focus || [];
  const equipArr = equipment || [];
  const nameLower = (name || "").toLowerCase();

  // Phase + focus matching
  if (phase === "cooldown") return layoutCooldown(rng, count);

  if (phase === "game") return layoutGame(rng, count);

  if (phase === "warmup") {
    if (has(focusArr, "agility") && !has(focusArr, "passing") && !has(focusArr, "dribbling"))
      return layoutWarmupAgility(rng, count);
    if (has(focusArr, "passing") || has(focusArr, "possession"))
      return layoutWarmupPassing(rng, count);
    if (has(focusArr, "dribbling") || has(focusArr, "fun") || has(focusArr, "1v1"))
      return layoutWarmupDribbling(rng, count);
    if (has(focusArr, "fitness"))
      return layoutWarmupAgility(rng, count);
    return layoutWarmupDribbling(rng, count);
  }

  if (phase === "technical") {
    if (has(focusArr, "goalkeeping"))
      return layoutTechnicalGoalkeeping(rng, count);
    if (has(focusArr, "shooting"))
      return layoutTechnicalShooting(rng, count);
    if (has(focusArr, "dribbling") || has(focusArr, "first touch") || has(focusArr, "agility"))
      return layoutTechnicalDribbling(rng, count);
    if (has(focusArr, "passing"))
      return layoutTechnicalPassing(rng, count);
    return layoutTechnicalPassing(rng, count);
  }

  if (phase === "tactical") {
    if (has(focusArr, "possession"))
      return layoutTacticalPossession(rng, count);
    if (has(focusArr, "defending"))
      return layoutTacticalDefending(rng, count);
    if (has(focusArr, "transition"))
      return layoutTacticalTransition(rng, count);
    if (has(focusArr, "attacking") || has(focusArr, "1v1"))
      return layoutTacticalAttacking(rng, count);
    if (has(focusArr, "decision making"))
      return layoutTacticalAttacking(rng, count);
    return layoutTacticalPossession(rng, count);
  }

  // Fallback: try name-based matching
  if (nameLower.includes("rondo") || nameLower.includes("possession"))
    return layoutTacticalPossession(rng, count);
  if (nameLower.includes("shooting") || nameLower.includes("finishing"))
    return layoutTechnicalShooting(rng, count);
  if (nameLower.includes("dribbl"))
    return layoutTechnicalDribbling(rng, count);

  return layoutWarmupDribbling(rng, count);
}

// ── Main component ───────────────────────────────────────────────────
export function DrillDiagram({ drill, sport }) {
  const fieldColor = sportConfig?.[sport]?.fieldColor || "#16a34a";
  const rng = makeRng(drill?.id || "default");
  const layout = selectLayout(drill || {}, rng);

  const {
    players = [],
    cones = [],
    goals = [],
    arrows = [],
    balls = [],
    zigzag,
    sideGoals,
  } = layout;

  // Also add cones from equipment if the layout didn't already include them
  const equipArr = drill?.equipment || [];
  const extraCones = [];
  if (hasEquip(equipArr, "cone") && cones.length === 0) {
    // Add a few cones around the field edge
    extraCones.push({ x: 25, y: 20 }, { x: 115, y: 20 }, { x: 25, y: 70 }, { x: 115, y: 70 });
  }

  const showGoalFromEquip = hasEquip(equipArr, "goal") && goals.length === 0;

  return (
    <svg
      viewBox="0 0 140 90"
      style={{ width: "100%", height: 100, borderRadius: 12, background: fieldColor }}
    >
      {/* Field markings */}
      <FieldBackground sport={sport} />

      {/* Goals from equipment (if layout didn't supply them) */}
      {showGoalFromEquip && <Goal x={70} y={8} facing="down" />}

      {/* Layout-supplied goals */}
      {goals.map((g, i) =>
        sideGoals ? (
          <rect
            key={`goal-${i}`}
            x={g.x - 3}
            y={g.y}
            width={6}
            height={14}
            rx="1"
            fill="none"
            stroke={COLORS.goal}
            strokeWidth="1"
          />
        ) : (
          <Goal key={`goal-${i}`} x={g.x} y={g.y} facing={g.facing || "down"} />
        )
      )}

      {/* Zig-zag paths */}
      {zigzag && !layout.zigzagHorizontal && (
        <ZigZagPath x={zigzag.x} y={zigzag.y} segments={zigzag.segments} width={zigzag.width} height={zigzag.height} />
      )}
      {zigzag && layout.zigzagHorizontal && (
        // Horizontal serpentine through cones
        <path
          d={(() => {
            const pts = cones.sort((a, b) => a.x - b.x);
            if (pts.length < 2) return "";
            let d = `M ${pts[0].x - 8} ${pts[0].y}`;
            pts.forEach((p, i) => {
              const yOff = i % 2 === 0 ? -8 : 8;
              d += ` Q ${p.x} ${p.y + yOff} ${p.x + 7} ${p.y}`;
            });
            return d;
          })()}
          fill="none"
          stroke={COLORS.arrow}
          strokeWidth="0.8"
          strokeDasharray="2 1"
        />
      )}

      {/* Arrows */}
      {arrows.map((a, i) =>
        a.curved ? (
          <CurvedArrow key={`arr-${i}`} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} />
        ) : (
          <Arrow key={`arr-${i}`} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} />
        )
      )}

      {/* Cones */}
      {[...cones, ...extraCones].map((c, i) => (
        <Cone key={`cone-${i}`} x={c.x} y={c.y} />
      ))}

      {/* Player dots */}
      {players.map((p, i) => (
        <PlayerDot key={`player-${i}`} x={p.x} y={p.y} team={p.team} />
      ))}

      {/* Balls */}
      {balls.map((b, i) => (
        <Ball key={`ball-${i}`} x={b.x} y={b.y} />
      ))}
    </svg>
  );
}

export default DrillDiagram;
