function generatePlan(config, sport = "Soccer", recentDrillIds = []) {
  const { ageGroup, playerCount, duration, focusAreas, equipment } = config;
  const ages = AGE_GROUPS.find(a => a.value === ageGroup)?.ages || [];
  const rawDrills = sport === "Soccer" ? soccerDrillsFull : (drillsBySport[sport] || []);
  const allDrills = rawDrills.map(normalizeDrill);

  // --- Filter to eligible drills ---
  const available = allDrills.filter(d =>
    d.ages.some(a => ages.includes(a)) &&
    d.equipment.every(e => equipment.includes(e)) &&
    (Array.isArray(d.players) ? d.players[0] <= playerCount : true)
  );

  // --- Age group flags ---
  const isVeryYoung = ["U6"].includes(ageGroup);
  const isYoung = ["U6", "U8"].includes(ageGroup);
  const isOlder = ["U14", "U16", "U18"].includes(ageGroup);

  // --- Expected intensity per phase ---
  const phaseIntensity = {
    warmup: "low",
    technical: "medium",
    tactical: "medium",
    game: "high",
    cooldown: "low",
  };

  const intensityOrder = { low: 0, medium: 1, high: 2 };

  // --- Track covered focus areas across the whole plan ---
  const coveredFocuses = new Set();
  const usedIds = new Set();

  // --- Scoring function ---
  const scoreDrill = (drill, phase, preferredFocuses) => {
    let score = 0;

    // 1. Focus area scoring with balance awareness
    if (preferredFocuses.length > 0) {
      const drillFocuses = drill.focus || [];
      for (const f of drillFocuses) {
        if (preferredFocuses.includes(f)) {
          // Bonus for matching a requested focus
          score += 10;
          // Extra bonus if this focus has NOT been covered yet (balance)
          if (!coveredFocuses.has(f)) {
            score += 15;
          }
        }
      }
    }

    // 2. Intensity match scoring
    const expectedIntensity = phaseIntensity[phase] || "medium";
    const drillIntensity = (drill.intensity || "medium").toLowerCase();
    const diff = Math.abs(
      (intensityOrder[drillIntensity] ?? 1) - (intensityOrder[expectedIntensity] ?? 1)
    );
    // Perfect match = +10, one step off = +5, two steps off = 0
    score += Math.max(0, 10 - diff * 5);

    // 3. Recent drill history penalty (soft)
    if (recentDrillIds.includes(drill.id)) {
      score -= 20;
    }

    // 4. Age-appropriate preferences
    const drillFocuses = drill.focus || [];
    if (isYoung && drillFocuses.includes("fun")) {
      score += 12;
    }
    if (isOlder && (drillFocuses.includes("tactical") || drillFocuses.includes("decision-making"))) {
      score += 8;
    }

    // 5. Already used in this plan — strong penalty but not excluded
    if (usedIds.has(drill.id)) {
      score -= 40;
    }

    return score;
  };

  // --- Pick function with scoring ---
  const pick = (phase, preferredFocuses) => {
    let pool = available.filter(d => d.phase === phase && !usedIds.has(d.id));

    // Fallback: any unused drill
    if (pool.length === 0) pool = available.filter(d => !usedIds.has(d.id));

    // Last resort: allow reuse from same phase
    if (pool.length === 0) pool = available.filter(d => d.phase === phase);

    if (pool.length === 0) return null;

    // Score every drill in the pool
    const scored = pool.map(d => ({
      ...d,
      _score: scoreDrill(d, phase, preferredFocuses),
    }));

    // Sort descending by score
    scored.sort((a, b) => b._score - a._score);

    // Weighted random from top candidates (top 3 or fewer)
    const topN = Math.min(3, scored.length);
    const top = scored.slice(0, topN);

    // Weighted selection: higher scores get proportionally more chance
    const minScore = Math.min(...top.map(d => d._score));
    const weights = top.map(d => Math.max(1, d._score - minScore + 1));
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    let rand = Math.random() * totalWeight;
    let selected = top[0];
    for (let i = 0; i < top.length; i++) {
      rand -= weights[i];
      if (rand <= 0) {
        selected = top[i];
        break;
      }
    }

    // Register selection
    if (selected) {
      usedIds.add(selected.id);
      // Track which requested focuses this drill covers
      for (const f of (selected.focus || [])) {
        if (preferredFocuses.includes(f)) {
          coveredFocuses.add(f);
        }
      }
    }

    // Strip internal scoring field
    if (selected) {
      const { _score, ...clean } = selected;
      return clean;
    }
    return null;
  };

  // --- Phase durations (base, before extra-drill splitting) ---
  let phases;
  if (duration <= 50) {
    phases = { warmup: 8, technical: 12, tactical: 10, game: 12, cooldown: 5 };
  } else if (duration <= 65) {
    phases = { warmup: 8, technical: 15, tactical: 12, game: 15, cooldown: 5 };
  } else if (duration <= 80) {
    phases = { warmup: 10, technical: 18, tactical: 15, game: 18, cooldown: 5 };
  } else {
    phases = { warmup: 10, technical: 20, tactical: 20, game: 25, cooldown: 5 };
  }

  // Age adjustments to phase durations
  if (isYoung) {
    phases.tactical = Math.max(8, phases.tactical - 5);
    phases.game += 5;
  }

  // --- For U6: skip tactical entirely, give that time to a second game/fun drill ---
  const skipTactical = isVeryYoung;
  if (skipTactical) {
    phases.game += phases.tactical;
    phases.tactical = 0;
  }

  // --- Determine how many drills per phase based on duration ---
  const drillCounts = {
    warmup: 1,
    technical: 1,
    tactical: skipTactical ? 0 : 1,
    game: skipTactical ? 2 : 1, // U6 gets two game drills
    cooldown: 1,
  };

  if (duration >= 75) {
    drillCounts.technical = 2;
  }
  if (duration >= 90 && !skipTactical) {
    drillCounts.tactical = 2;
  }

  // --- Build the plan ---
  const plan = [];

  const phaseOrder = ["warmup", "technical", "tactical", "game", "cooldown"];
  const phaseLabels = {
    warmup: "Warm-Up",
    technical: "Technical",
    tactical: "Tactical",
    game: "Game",
    cooldown: "Cool-Down",
  };

  for (const phase of phaseOrder) {
    const count = drillCounts[phase];
    if (count === 0 || phases[phase] === 0) continue;

    const totalTime = phases[phase];
    const drills = [];

    for (let i = 0; i < count; i++) {
      // For cooldown, don't bias toward focus areas
      const preferred = phase === "cooldown" ? [] : focusAreas;
      const drill = pick(phase, preferred);
      if (drill) drills.push(drill);
    }

    if (drills.length === 0) continue;

    // Split phase time proportionally across drills in this phase
    // For now, split evenly (could weight by drill.suggestedDuration if available)
    const perDrill = Math.floor(totalTime / drills.length);
    const remainder = totalTime - perDrill * drills.length;

    drills.forEach((drill, idx) => {
      plan.push({
        ...drill,
        phaseDuration: perDrill + (idx === 0 ? remainder : 0),
        phaseLabel: phaseLabels[phase],
      });
    });
  }

  return plan.filter(Boolean);
}
