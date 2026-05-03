export const sportConfig = {
  Soccer: {
    emoji: "⚽", tip: "Effective practices balance repetition with game-like situations. Keep passing drills dynamic with movement off the ball.",
    fieldColor: "#22c55e", heroGradient: `linear-gradient(135deg, #166534 0%, #15803d 50%, #059669 100%)`,
    positions: ["GK","CB","LB","RB","CDM","CM","CAM","LW","RW","ST"],
  },
  Basketball: {
    emoji: "🏀", tip: "Focus on fundamentals — dribbling, footwork, and shooting form. Build competitive drills to keep energy high.",
    fieldColor: "#c2855a", heroGradient: `linear-gradient(135deg, #7c2d12 0%, #c2855a 50%, #f59e0b 100%)`,
    positions: ["PG","SG","SF","PF","C"],
  },
  Baseball: {
    emoji: "⚾", tip: "Balance repetition with game-like situations. Keep batting practice engaging with live pitching when possible.",
    fieldColor: "#65a30d", heroGradient: `linear-gradient(135deg, #365314 0%, #65a30d 50%, #84cc16 100%)`,
    positions: ["P","C","1B","2B","3B","SS","LF","CF","RF"],
  },
  Football: {
    emoji: "🏈", tip: "Structure practice around position groups, then bring the team together for full-speed reps. Film review is key.",
    fieldColor: "#16a34a", heroGradient: `linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #3b82f6 100%)`,
    positions: ["QB","RB","WR","TE","OL","DL","LB","CB","S","K"],
  },
};

export const AGE_GROUPS = [
  { value: "U6", label: "U6 (5-6 yrs)", ages: [6], philosophy: "Fun & exploration. No positions, no pressure." },
  { value: "U8", label: "U8 (7-8 yrs)", ages: [7, 8], philosophy: "Love of the game. Basic ball skills and small-sided play." },
  { value: "U10", label: "U10 (9-10 yrs)", ages: [9, 10], philosophy: "Skill development. Introduce passing concepts and 1v1s." },
  { value: "U12", label: "U12 (11-12 yrs)", ages: [11, 12], philosophy: "Golden age of learning. Technical refinement and tactical awareness." },
  { value: "U14", label: "U14 (13-14 yrs)", ages: [13, 14], philosophy: "Competitive development. Tactical depth, position-specific training." },
];

export const FOCUS_OPTIONS_BY_SPORT = {
  Soccer: [
    { value: "passing", label: "Passing", icon: "↔️" },
    { value: "dribbling", label: "Dribbling", icon: "⚡" },
    { value: "shooting", label: "Shooting", icon: "🎯" },
    { value: "defending", label: "Defending", icon: "🛡️" },
    { value: "possession", label: "Possession", icon: "🔄" },
    { value: "1v1", label: "1v1 Skills", icon: "⚔️" },
    { value: "first touch", label: "First Touch", icon: "🤜" },
    { value: "transition", label: "Transition", icon: "🔀" },
    { value: "decision making", label: "Decision Making", icon: "🧠" },
    { value: "fun", label: "Fun & Games", icon: "🎉" },
  ],
  Basketball: [
    { value: "dribbling", label: "Ball Handling", icon: "⚡" },
    { value: "shooting", label: "Shooting", icon: "🎯" },
    { value: "passing", label: "Passing", icon: "↔️" },
    { value: "defense", label: "Defense", icon: "🛡️" },
    { value: "rebounding", label: "Rebounding", icon: "🔄" },
    { value: "transition", label: "Fast Break", icon: "🔀" },
    { value: "footwork", label: "Footwork", icon: "🤜" },
    { value: "teamwork", label: "Team Offense", icon: "🧠" },
    { value: "layups", label: "Layups & Finishing", icon: "⚔️" },
    { value: "fun", label: "Fun & Games", icon: "🎉" },
  ],
  Baseball: [
    { value: "hitting", label: "Hitting", icon: "🎯" },
    { value: "fielding", label: "Fielding", icon: "🛡️" },
    { value: "throwing", label: "Throwing", icon: "↔️" },
    { value: "pitching", label: "Pitching", icon: "⚡" },
    { value: "baserunning", label: "Base Running", icon: "🔀" },
    { value: "catching", label: "Catching", icon: "🤜" },
    { value: "situational", label: "Situational Play", icon: "🧠" },
    { value: "teamwork", label: "Team Defense", icon: "🔄" },
    { value: "fun", label: "Fun & Games", icon: "🎉" },
  ],
  Football: [
    { value: "passing", label: "Passing", icon: "↔️" },
    { value: "catching", label: "Catching", icon: "🤜" },
    { value: "running", label: "Running & Carrying", icon: "⚡" },
    { value: "defense", label: "Defense", icon: "🛡️" },
    { value: "route running", label: "Route Running", icon: "🎯" },
    { value: "agility", label: "Agility", icon: "🔀" },
    { value: "blocking", label: "Blocking", icon: "🔄" },
    { value: "teamwork", label: "Team Concepts", icon: "🧠" },
    { value: "fun", label: "Fun & Games", icon: "🎉" },
  ],
};
export const FOCUS_OPTIONS = FOCUS_OPTIONS_BY_SPORT.Soccer; // backward compat

export const EQUIPMENT_BY_SPORT = {
  Soccer: ["cones", "balls", "bibs", "goals"],
  Basketball: ["balls", "cones", "bibs"],
  Baseball: ["balls", "gloves", "bat", "bases", "tee"],
  Football: ["balls", "cones", "flags", "pads", "ladder"],
};
export const EQUIPMENT_OPTIONS = EQUIPMENT_BY_SPORT.Soccer; // backward compat
export const DURATION_OPTIONS = [45, 60, 75, 90];
