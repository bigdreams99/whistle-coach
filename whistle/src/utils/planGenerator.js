import { AGE_GROUPS } from "../constants/sports.js";
import { soccerDrillsFull, drillsBySport } from "../data/drills.js";

// Normalize a drill from any sport into a common format for the engine
export function normalizeDrill(d) {
  // Soccer drills already have numeric ages arrays and phase field
  if (Array.isArray(d.ages) && typeof d.ages[0] === "number") return d;
  // Other sport drills use string ages like ["U8","U10"] and category instead of phase
  const ageMap = { U6: [6], U8: [7,8], U10: [9,10], U12: [11,12], U14: [13,14] };
  const numericAges = (d.ages || []).flatMap(a => ageMap[a] || []);
  // Map non-standard categories to engine phases
  const catMap = { fitness: "warmup", game: "game", cooldown: "cooldown", scrimmage: "game" };
  const phase = catMap[d.category] || d.category || "technical";
  const focus = (d.skills || []).map(s => s.toLowerCase());
  const equip = (d.equipment || []).map(e => e.toLowerCase());
  const players = typeof d.players === "string"
    ? [parseInt(d.players) || 1, 30]
    : Array.isArray(d.players) ? d.players : [1, 30];
  return { ...d, ages: numericAges, phase, focus, equipment: equip, players, coaching: d.coaching || [] };
}

export function generatePlan(config, sport = "Soccer") {
  const { ageGroup, playerCount, duration, focusAreas, equipment } = config;
  const ages = AGE_GROUPS.find(a => a.value === ageGroup)?.ages || [];

  // Get the drill pool for this sport, normalized
  const rawDrills = sport === "Soccer"
    ? soccerDrillsFull
    : (drillsBySport[sport] || []);
  const allDrills = rawDrills.map(normalizeDrill);

  const available = allDrills.filter(d =>
    d.ages.some(a => ages.includes(a)) &&
    d.equipment.every(e => equipment.includes(e)) &&
    (Array.isArray(d.players) ? d.players[0] <= playerCount : true)
  );

  const pick = (phase, preferred) => {
    let pool = available.filter(d => d.phase === phase);
    if (pool.length === 0) pool = available; // fallback: use any drill if phase is empty
    if (preferred.length > 0) {
      const scored = pool.map(d => ({
        ...d, score: d.focus.filter(f => preferred.includes(f)).length,
      }));
      scored.sort((a, b) => b.score - a.score);
      pool = scored;
    }
    const top = pool.slice(0, Math.max(3, pool.length));
    return top[Math.floor(Math.random() * top.length)] || pool[0];
  };

  const isYoung = ["U6", "U8"].includes(ageGroup);
  let phases;
  if (duration <= 50) phases = { warmup: 8, technical: 12, tactical: 10, game: 12, cooldown: 5 };
  else if (duration <= 65) phases = { warmup: 8, technical: 15, tactical: 12, game: 15, cooldown: 5 };
  else if (duration <= 80) phases = { warmup: 10, technical: 18, tactical: 15, game: 18, cooldown: 5 };
  else phases = { warmup: 10, technical: 20, tactical: 20, game: 25, cooldown: 5 };

  if (isYoung) { phases.tactical = Math.max(8, phases.tactical - 5); phases.game += 5; }

  return [
    { ...pick("warmup", focusAreas), phaseDuration: phases.warmup, phaseLabel: "Warm-Up" },
    { ...pick("technical", focusAreas), phaseDuration: phases.technical, phaseLabel: "Technical" },
    { ...pick("tactical", focusAreas), phaseDuration: phases.tactical, phaseLabel: "Tactical" },
    { ...pick("game", focusAreas), phaseDuration: phases.game, phaseLabel: "Game" },
    { ...pick("cooldown", []), phaseDuration: phases.cooldown, phaseLabel: "Cool-Down" },
  ].filter(Boolean);
}

// Get normalized drills for any sport (used by drill swap)
// Always returns drills with numeric ages, phase field, lowercase equipment
export function getDrillPool(sport) {
  if (sport === "Soccer") return soccerDrillsFull.map(normalizeDrill);
  return (drillsBySport[sport] || []).map(normalizeDrill);
}
