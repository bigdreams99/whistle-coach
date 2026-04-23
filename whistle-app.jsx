import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Home, ClipboardList, Zap, Users, Clock, Star, ChevronDown, ChevronLeft,
  Plus, Search, Heart, ArrowRight, Calendar, Timer, Target, Trophy,
  TrendingUp, Filter, MoreHorizontal, CheckCircle2, Circle, Sparkles,
  UserPlus, Trash2, BarChart3, Activity, Award, Play, RotateCcw, ChevronRight, Info,
  Download, Printer, Share2, Menu, X,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE RESPONSIVENESS HOOK
// ═══════════════════════════════════════════════════════════════════════════
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    checkMobile();

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

// ═══════════════════════════════════════════════════════════════════════════
// COLOR TOKENS
// ═══════════════════════════════════════════════════════════════════════════
const c = {
  green50: "#f0fdf4", green100: "#dcfce7", green200: "#bbf7d0", green400: "#4ade80",
  green500: "#22c55e", green600: "#16a34a", green700: "#15803d", green800: "#166534", green900: "#14532d",
  emerald600: "#047857",
  slate50: "#f8fafc", slate100: "#f1f5f9", slate200: "#e2e8f0", slate300: "#cbd5e1",
  slate400: "#94a3b8", slate500: "#64748b", slate600: "#475569", slate700: "#334155",
  slate800: "#1e293b", slate900: "#0f172a",
  white: "#ffffff",
  amber400: "#fbbf24", amber500: "#f59e0b",
  blue500: "#3b82f6", blue600: "#2563eb",
  purple500: "#8b5cf6",
  rose500: "#f43f5e",
  orange500: "#f97316",
  cyan500: "#06b6d4",
};

// Phase colors for plan generation
const phaseColorMap = {
  warmup: c.amber500, technical: c.blue500, tactical: c.purple500, game: c.green500, cooldown: c.cyan500,
};

// ═══════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE HOOK
// ═══════════════════════════════════════════════════════════════════════════
function useLocalStorage(key, initialValue) {
  const prefixedKey = `wc_${key}`;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const item = window.localStorage.getItem(prefixedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(prefixedKey, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [prefixedKey, storedValue]);

  return [storedValue, setValue];
}

// ═══════════════════════════════════════════════════════════════════════════
// SPORT CONFIG
// ═══════════════════════════════════════════════════════════════════════════
const sportConfig = {
  Soccer: {
    emoji: "\u26bd", tip: "Effective practices balance repetition with game-like situations. Keep passing drills dynamic with movement off the ball.",
    fieldColor: "#22c55e", heroGradient: `linear-gradient(135deg, #166534 0%, #15803d 50%, #047857 100%)`,
    positions: ["GK","CB","LB","RB","CDM","CM","CAM","LW","RW","ST"],
  },
  Basketball: {
    emoji: "\ud83c\udfc0", tip: "Focus on fundamentals \u2014 dribbling, footwork, and shooting form. Build competitive drills to keep energy high.",
    fieldColor: "#c2855a", heroGradient: `linear-gradient(135deg, #7c2d12 0%, #c2855a 50%, #f59e0b 100%)`,
    positions: ["PG","SG","SF","PF","C"],
  },
  Baseball: {
    emoji: "\u26be", tip: "Balance repetition with game-like situations. Keep batting practice engaging with live pitching when possible.",
    fieldColor: "#65a30d", heroGradient: `linear-gradient(135deg, #365314 0%, #65a30d 50%, #84cc16 100%)`,
    positions: ["P","C","1B","2B","3B","SS","LF","CF","RF"],
  },
  Football: {
    emoji: "\ud83c\udfc8", tip: "Structure practice around position groups, then bring the team together for full-speed reps. Film review is key.",
    fieldColor: "#16a34a", heroGradient: `linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #3b82f6 100%)`,
    positions: ["QB","RB","WR","TE","OL","DL","LB","CB","S","K"],
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPANDED DRILL LIBRARY (63 youth soccer drills + multi-sport)
// ═══════════════════════════════════════════════════════════════════════════
const AGE_GROUPS = [
  { value: "U6", label: "U6 (5-6 yrs)", ages: [6], philosophy: "Fun & exploration. No positions, no pressure." },
  { value: "U8", label: "U8 (7-8 yrs)", ages: [7, 8], philosophy: "Love of the game. Basic ball skills and small-sided play." },
  { value: "U10", label: "U10 (9-10 yrs)", ages: [9, 10], philosophy: "Skill development. Introduce passing concepts and 1v1s." },
  { value: "U12", label: "U12 (11-12 yrs)", ages: [11, 12], philosophy: "Golden age of learning. Technical refinement and tactical awareness." },
  { value: "U14", label: "U14 (13-14 yrs)", ages: [13, 14], philosophy: "Competitive development. Tactical depth, position-specific training." },
];

const FOCUS_OPTIONS_BY_SPORT = {
  Soccer: [
    { value: "passing", label: "Passing", icon: "\u2194\ufe0f" },
    { value: "dribbling", label: "Dribbling", icon: "\u26a1" },
    { value: "shooting", label: "Shooting", icon: "\ud83c\udfaf" },
    { value: "defending", label: "Defending", icon: "\ud83d\udee1\ufe0f" },
    { value: "possession", label: "Possession", icon: "\ud83d\udd04" },
    { value: "1v1", label: "1v1 Skills", icon: "\u2694\ufe0f" },
    { value: "first touch", label: "First Touch", icon: "\ud83e\uddb6" },
    { value: "transition", label: "Transition", icon: "\ud83d\udd00" },
    { value: "decision making", label: "Decision Making", icon: "\ud83e\udde0" },
    { value: "fun", label: "Fun & Games", icon: "\ud83c\udf89" },
  ],
  Basketball: [
    { value: "dribbling", label: "Ball Handling", icon: "\u26a1" },
    { value: "shooting", label: "Shooting", icon: "\ud83c\udfaf" },
    { value: "passing", label: "Passing", icon: "\u2194\ufe0f" },
    { value: "defense", label: "Defense", icon: "\ud83d\udee1\ufe0f" },
    { value: "rebounding", label: "Rebounding", icon: "\ud83d\udd04" },
    { value: "transition", label: "Fast Break", icon: "\ud83d\udd00" },
    { value: "footwork", label: "Footwork", icon: "\ud83e\uddb6" },
    { value: "teamwork", label: "Team Offense", icon: "\ud83e\udde0" },
    { value: "layups", label: "Layups & Finishing", icon: "\u2694\ufe0f" },
    { value: "fun", label: "Fun & Games", icon: "\ud83c\udf89" },
  ],
  Baseball: [
    { value: "hitting", label: "Hitting", icon: "\ud83c\udfaf" },
    { value: "fielding", label: "Fielding", icon: "\ud83d\udee1\ufe0f" },
    { value: "throwing", label: "Throwing", icon: "\u2194\ufe0f" },
    { value: "pitching", label: "Pitching", icon: "\u26a1" },
    { value: "baserunning", label: "Base Running", icon: "\ud83d\udd00" },
    { value: "catching", label: "Catching", icon: "\ud83e\uddb6" },
    { value: "situational", label: "Situational Play", icon: "\ud83e\udde0" },
    { value: "teamwork", label: "Team Defense", icon: "\ud83d\udd04" },
    { value: "fun", label: "Fun & Games", icon: "\ud83c\udf89" },
  ],
  Football: [
    { value: "passing", label: "Passing", icon: "\u2194\ufe0f" },
    { value: "catching", label: "Catching", icon: "\ud83e\uddb6" },
    { value: "running", label: "Running & Carrying", icon: "\u26a1" },
    { value: "defense", label: "Defense", icon: "\ud83d\udee1\ufe0f" },
    { value: "route running", label: "Route Running", icon: "\ud83c\udfaf" },
    { value: "agility", label: "Agility", icon: "\ud83d\udd00" },
    { value: "blocking", label: "Blocking", icon: "\ud83d\udd04" },
    { value: "teamwork", label: "Team Concepts", icon: "\ud83e\udde0" },
    { value: "fun", label: "Fun & Games", icon: "\ud83c\udf89" },
  ],
};
const FOCUS_OPTIONS = FOCUS_OPTIONS_BY_SPORT.Soccer; // backward compat

const EQUIPMENT_BY_SPORT = {
  Soccer: ["cones", "balls", "bibs", "goals"],
  Basketball: ["balls", "cones", "bibs"],
  Baseball: ["balls", "gloves", "bat", "bases", "tee"],
  Football: ["balls", "cones", "flags", "pads", "ladder"],
};
const EQUIPMENT_OPTIONS = EQUIPMENT_BY_SPORT.Soccer; // backward compat
const DURATION_OPTIONS = [45, 60, 75, 90];

// Full 18-drill soccer library from CoachPlan
const soccerDrillsFull = [
  { id: "w1", name: "Tag Game", phase: "warmup", focus: ["agility", "fun"], ages: [6,7,8,9,10,11,12,13,14], duration: 5, players: [4,30], equipment: ["cones"], description: "Players dribble in a grid. 2 taggers try to tag dribblers. Tagged players do 3 toe-taps then rejoin.", coaching: ["Keep head up while dribbling", "Change direction to escape", "Use both feet"], category: "warmup", skills: ["Agility","Fun"], intensity: "low" },
  { id: "w2", name: "Rondo Warm-Up (4v1)", phase: "warmup", focus: ["passing", "possession"], ages: [9,10,11,12,13,14], duration: 8, players: [5,25], equipment: ["cones", "balls"], description: "Groups of 5 in a circle. 4 outside players keep the ball from 1 defender. Rotate defender every 60 seconds.", coaching: ["Open body shape", "Play one or two touch", "Support at angles"], category: "warmup", skills: ["Passing","Possession"], intensity: "medium" },
  { id: "w3", name: "Sharks & Minnows", phase: "warmup", focus: ["dribbling", "fun"], ages: [6,7,8,9,10], duration: 5, players: [6,30], equipment: ["cones", "balls"], description: "All players dribble across a grid. 1-2 sharks try to kick balls out. If your ball leaves, do 5 juggles to rejoin.", coaching: ["Shield the ball", "Keep ball close", "Look for open space"], category: "warmup", skills: ["Dribbling","Fun"], intensity: "low" },
  { id: "w4", name: "Dynamic Stretching Circuit", phase: "warmup", focus: ["fitness", "agility"], ages: [10,11,12,13,14], duration: 6, players: [4,30], equipment: ["cones"], description: "Players move through a 20m channel doing: high knees, butt kicks, side shuffles, carioca, skipping, and light sprints.", coaching: ["Full range of motion", "Stay light on your feet", "Gradually increase intensity"], category: "fitness", skills: ["Speed","Agility"], intensity: "medium" },
  { id: "t1", name: "Passing Pairs", phase: "technical", focus: ["passing"], ages: [6,7,8,9,10,11,12,13,14], duration: 10, players: [4,30], equipment: ["cones", "balls"], description: "Pairs 8-10m apart. Inside foot pass back and forth. Progress: weak foot only, one touch, add movement.", coaching: ["Lock ankle", "Follow through toward target", "Receive across body"], category: "technical", skills: ["Passing"], intensity: "low" },
  { id: "t2", name: "Cone Dribbling Course", phase: "technical", focus: ["dribbling"], ages: [6,7,8,9,10,11,12], duration: 10, players: [4,20], equipment: ["cones", "balls"], description: "Weave through cones using inside/outside of foot. Progress: speed up, weak foot, add turns (Cruyff, drag-back).", coaching: ["Small touches through cones", "Use both feet", "Accelerate out of turns"], category: "technical", skills: ["Dribbling"], intensity: "medium" },
  { id: "t3", name: "Shooting Technique", phase: "technical", focus: ["shooting"], ages: [8,9,10,11,12,13,14], duration: 12, players: [4,16], equipment: ["cones", "balls", "goals"], description: "Players line up 16-20 yards out. Coach serves balls for first-time or controlled shots on goal. Rotate sides.", coaching: ["Plant foot beside ball", "Strike with laces", "Keep body over the ball", "Aim for corners"], category: "technical", skills: ["Shooting","Finishing"], intensity: "high" },
  { id: "t4", name: "First Touch Box", phase: "technical", focus: ["first touch", "passing"], ages: [8,9,10,11,12,13,14], duration: 10, players: [4,16], equipment: ["cones", "balls"], description: "4 players at corners of a 10x10 box. Receive, take a touch out of feet, pass to next player. Rotate direction.", coaching: ["Soft first touch", "Open hip to receive", "Look before the ball arrives"], category: "technical", skills: ["First Touch","Passing"], intensity: "medium" },
  { id: "t5", name: "Ball Mastery Circuit", phase: "technical", focus: ["dribbling", "first touch"], ages: [6,7,8,9,10,11], duration: 8, players: [4,20], equipment: ["cones", "balls"], description: "Individual ball work: toe taps, inside-inside, sole rolls, pull-push combos. 30s per move, coach demos each.", coaching: ["Eyes up when comfortable", "Light touches", "Both feet equally"], category: "technical", skills: ["Dribbling","First Touch"], intensity: "low" },
  { id: "t6", name: "1v1 Attacking Moves", phase: "technical", focus: ["dribbling", "1v1"], ages: [9,10,11,12,13,14], duration: 10, players: [4,20], equipment: ["cones", "balls"], description: "Teach 2-3 moves (step-over, scissors, body feint). Practice against passive then active defender in a 10x15 grid.", coaching: ["Sell the fake with your body", "Explode past defender", "Attack at speed"], category: "technical", skills: ["Dribbling","1v1"], intensity: "medium" },
  { id: "ta1", name: "3v1 Possession", phase: "tactical", focus: ["possession", "passing"], ages: [8,9,10,11,12,13,14], duration: 10, players: [8,20], equipment: ["cones", "bibs"], description: "3 attackers try to complete 5 passes without defender winning it. Rotate defender. Progress to 4v2.", coaching: ["Move after you pass", "Create triangles", "Communicate early"], category: "tactical", skills: ["Passing","Movement","Positioning"], intensity: "medium" },
  { id: "ta2", name: "Small-Sided Game 3v3", phase: "tactical", focus: ["decision making", "attacking"], ages: [6,7,8,9,10,11,12,13,14], duration: 12, players: [6,12], equipment: ["cones", "bibs", "goals"], description: "3v3 on a 25x20 yard field with small goals. No goalkeepers. Focus on quick combinations and finding space.", coaching: ["Width and depth", "Look to play forward", "Support the ball carrier"], category: "tactical", skills: ["Decision Making","Attacking"], intensity: "high" },
  { id: "ta3", name: "Defensive Shape (4v4)", phase: "tactical", focus: ["defending", "positioning"], ages: [10,11,12,13,14], duration: 12, players: [8,16], equipment: ["cones", "bibs", "goals"], description: "4v4 with emphasis on defensive team staying compact. Coach freezes play to show shape. Rotate attack/defense.", coaching: ["Pressure the ball", "Cover behind the presser", "Stay compact", "Communicate"], category: "tactical", skills: ["Defending","Positioning"], intensity: "medium" },
  { id: "ta4", name: "Transition Game", phase: "tactical", focus: ["transition", "decision making"], ages: [10,11,12,13,14], duration: 12, players: [8,20], equipment: ["cones", "bibs", "goals"], description: "5v5 with two end zones. When you win the ball, attack the opposite end zone within 8 seconds for bonus points.", coaching: ["Quick decisions on turnover", "Play forward early", "Sprint to support"], category: "tactical", skills: ["Transition","Decision Making"], intensity: "high" },
  { id: "g1", name: "Scrimmage (Free Play)", phase: "game", focus: ["match play"], ages: [6,7,8,9,10,11,12,13,14], duration: 15, players: [8,22], equipment: ["cones", "bibs", "goals"], description: "Full scrimmage with minimal stoppages. Let players apply what they learned. Coach observes and gives brief guidance.", coaching: ["Let them play", "Praise when session themes appear", "Quick encouragement, not lectures"], category: "tactical", skills: ["Match Play"], intensity: "high" },
  { id: "g2", name: "Conditioned Scrimmage", phase: "game", focus: ["match play", "possession"], ages: [9,10,11,12,13,14], duration: 15, players: [8,22], equipment: ["cones", "bibs", "goals"], description: "Scrimmage with conditions: e.g., 3 touch max, must complete 5 passes before shooting, goals from crosses count double.", coaching: ["Enforce conditions fairly", "Adapt conditions if too easy/hard", "Connect back to session theme"], category: "tactical", skills: ["Match Play","Possession"], intensity: "high" },
  { id: "c1", name: "Passing Circle & Stretch", phase: "cooldown", focus: ["recovery"], ages: [6,7,8,9,10,11,12,13,14], duration: 5, players: [4,30], equipment: ["balls"], description: "Team in a circle, gentle passing across while stretching. Coach reviews session highlights and asks players what they learned.", coaching: ["Hold each stretch 15-20 seconds", "Positive feedback on session effort", "Preview next session theme"], category: "warmup", skills: ["Recovery"], intensity: "low" },
  { id: "c2", name: "Juggling Challenge", phase: "cooldown", focus: ["recovery", "ball mastery"], ages: [8,9,10,11,12,13,14], duration: 5, players: [4,30], equipment: ["balls"], description: "Individual juggling \u2014 each player tries to beat their personal record. Light activity to cool down.", coaching: ["Relax and enjoy", "Soft touches", "It's okay to let it bounce for younger players"], category: "technical", skills: ["Ball Mastery"], intensity: "low" },

  // ── WARM-UP ADDITIONS ──────────────────────────────────────────────────
  { id: "w5", name: "Chase the Cones", phase: "warmup", focus: ["agility", "fun"], ages: [6,7,8,9,10,11,12], duration: 6, players: [6,24], equipment: ["cones"], description: "Set up 3 poles with 4 colored cones nearby. Teams race to collect cones one at a time and stack them on their pole. First team to stack all 4 wins.", coaching: ["Sprint on the return", "One cone at a time", "Encourage teammates"], category: "warmup", skills: ["Speed","Agility","Fun"], intensity: "medium" },
  { id: "w6", name: "Soccer Tic-Tac-Toe", phase: "warmup", focus: ["agility", "decision making", "fun"], ages: [6,7,8,9,10,11,12,13,14], duration: 6, players: [6,24], equipment: ["cones", "bibs"], description: "A 3x3 grid of cones. Two teams relay-race to place bibs on cones. First to get 3 in a row wins. Losers do 5 toe-taps.", coaching: ["Think before you place", "Sprint there and back", "Communicate with your team"], category: "warmup", skills: ["Decision Making","Speed","Fun"], intensity: "medium" },
  { id: "w7", name: "Box Run Warm-Up", phase: "warmup", focus: ["fitness", "agility"], ages: [8,9,10,11,12,13,14], duration: 6, players: [4,30], equipment: ["cones"], description: "Players run combinations around a 15x15 box: jog sides, sprint diagonals, side-shuffle, backpedal. Coach calls changes.", coaching: ["Stay on your toes", "Quick transitions between movements", "Pump your arms"], category: "fitness", skills: ["Speed","Agility"], intensity: "medium" },
  { id: "w8", name: "Pass & Follow Circle", phase: "warmup", focus: ["passing", "first touch"], ages: [7,8,9,10,11,12,13,14], duration: 7, players: [6,20], equipment: ["cones", "balls"], description: "Players stand in a circle. Pass to someone across, then follow your pass to take their spot. Add a second ball for older groups.", coaching: ["Call the name before passing", "Crisp ground passes", "Move immediately after passing"], category: "warmup", skills: ["Passing","Movement"], intensity: "low" },
  { id: "w9", name: "1v1 Warm-Up Duels", phase: "warmup", focus: ["1v1", "dribbling"], ages: [8,9,10,11,12,13,14], duration: 7, players: [4,20], equipment: ["cones", "balls", "goals"], description: "Pairs face each other at cones 15m apart. Coach serves a ball between them — first to it attacks, other defends. Play to mini goals.", coaching: ["Explode to the ball", "Get your body between defender and ball", "Take on with confidence"], category: "warmup", skills: ["1v1","Dribbling"], intensity: "high" },
  { id: "w10", name: "Locomotion Passing", phase: "warmup", focus: ["passing", "fitness"], ages: [6,7,8,9,10,11,12], duration: 6, players: [4,24], equipment: ["cones", "balls"], description: "Pairs jog side by side across a 30m channel passing back and forth. Vary the movement: skip, side-shuffle, high knees.", coaching: ["Keep pass on the ground", "Time the pass to partner's stride", "Communication is key"], category: "warmup", skills: ["Passing","Conditioning"], intensity: "low" },

  // ── TECHNICAL ADDITIONS ─────────────────────────────────────────────────
  { id: "t7", name: "T-Cone Dribbling", phase: "technical", focus: ["dribbling", "agility"], ages: [7,8,9,10,11,12,13,14], duration: 8, players: [4,20], equipment: ["cones", "balls"], description: "Set up T-shaped cone patterns. Dribble forward, shuffle right around cone, shuffle left around far cone, backpedal to start. Use inside/outside cuts.", coaching: ["Low center of gravity", "Close ball control through turns", "Accelerate on the straight"], category: "technical", skills: ["Dribbling","Agility"], intensity: "medium" },
  { id: "t8", name: "Figure Eight Dribbling", phase: "technical", focus: ["dribbling", "first touch"], ages: [6,7,8,9,10,11,12], duration: 8, players: [4,20], equipment: ["cones", "balls"], description: "Two cones 3m apart. Dribble in a figure-8 pattern using inside and outside of both feet. Progress to weak foot only.", coaching: ["Alternate feet on each turn", "Keep ball within playing distance", "Smooth rhythm over speed"], category: "technical", skills: ["Dribbling","First Touch"], intensity: "low" },
  { id: "t9", name: "Wall Pass Combination", phase: "technical", focus: ["passing", "1v1"], ages: [9,10,11,12,13,14], duration: 10, players: [6,20], equipment: ["cones", "balls"], description: "In pairs, player 1 passes to player 2 (the wall), then sprints into space to receive the return pass. Progress to include a passive defender.", coaching: ["Weight of pass is crucial", "Time your run with the pass", "Open body to receive"], category: "technical", skills: ["Passing","Movement","1v1"], intensity: "medium" },
  { id: "t10", name: "Crossing & Finishing", phase: "technical", focus: ["shooting", "passing"], ages: [10,11,12,13,14], duration: 12, players: [6,16], equipment: ["cones", "balls", "goals"], description: "Wingers deliver crosses from wide positions. Strikers attack near post, far post, and penalty spot. Rotate positions.", coaching: ["Cross before the byline", "Driven ball for near post, lofted for far", "Attack the ball, don't wait for it"], category: "technical", skills: ["Crossing","Finishing","Shooting"], intensity: "high" },
  { id: "t11", name: "Receive & Turn", phase: "technical", focus: ["first touch", "dribbling"], ages: [8,9,10,11,12,13,14], duration: 10, players: [4,16], equipment: ["cones", "balls"], description: "Player receives with back to goal from a server. Use different turns: Cruyff, drag-back, outside hook, body feint — then accelerate to a cone 10m away.", coaching: ["Check shoulder before receiving", "First touch should set up the turn", "Accelerate out of the turn"], category: "technical", skills: ["First Touch","Turning","Dribbling"], intensity: "medium" },
  { id: "t12", name: "Heading Technique", phase: "technical", focus: ["shooting", "defending"], ages: [11,12,13,14], duration: 8, players: [4,16], equipment: ["balls", "goals"], description: "Pairs practice heading from gentle tosses, focusing on forehead contact. Progress to heading from crosses for attacking/defensive headers.", coaching: ["Eyes open, mouth closed", "Attack the ball — don't let it hit you", "Use neck and core, not just head"], category: "technical", skills: ["Heading","Finishing"], intensity: "medium" },
  { id: "t13", name: "Drag-Back Relay", phase: "technical", focus: ["dribbling", "fun"], ages: [6,7,8,9,10,11], duration: 8, players: [6,24], equipment: ["cones", "balls"], description: "Teams line up behind a cone. Dribble to a cone 15m away, perform a drag-back turn, dribble back. Next player goes. First team to finish wins.", coaching: ["Sole of foot on top of ball", "Pull ball back and push off with other foot", "Speed with control"], category: "technical", skills: ["Dribbling","Turning"], intensity: "medium" },
  { id: "t14", name: "Six-Cone Passing", phase: "technical", focus: ["passing", "first touch"], ages: [8,9,10,11,12,13,14], duration: 10, players: [6,18], equipment: ["cones", "balls"], description: "6 players at cones in a hexagon. Follow a passing sequence: pass and move to the next cone. Add one-touch and weak foot progressions.", coaching: ["Awareness of passing sequence", "Firm, accurate passes", "Move before the ball arrives"], category: "technical", skills: ["Passing","Movement","First Touch"], intensity: "medium" },

  // ── TACTICAL ADDITIONS ──────────────────────────────────────────────────
  { id: "ta5", name: "Rondo 4v2", phase: "tactical", focus: ["possession", "passing", "defending"], ages: [9,10,11,12,13,14], duration: 10, players: [6,24], equipment: ["cones", "bibs"], description: "4 outside players keep possession from 2 defenders in a 10x10 grid. If defenders win it or it goes out, the passer who lost it swaps in.", coaching: ["Play away from pressure", "Body open to see all options", "Defenders work as a pair — one presses, one covers"], category: "tactical", skills: ["Possession","Pressing","Passing"], intensity: "medium" },
  { id: "ta6", name: "Four Goal Game", phase: "tactical", focus: ["attacking", "decision making", "transition"], ages: [8,9,10,11,12,13,14], duration: 12, players: [8,20], equipment: ["cones", "bibs"], description: "4v4 with 4 mini goals, one on each side of a square field. Score in any goal. Encourages quick switches of play and scanning.", coaching: ["Always look for the undefended goal", "Switch the play quickly", "Defend as a unit — step together"], category: "tactical", skills: ["Decision Making","Attacking","Transition"], intensity: "high" },
  { id: "ta7", name: "Pressing Triggers", phase: "tactical", focus: ["defending", "transition"], ages: [11,12,13,14], duration: 12, players: [10,22], equipment: ["cones", "bibs", "goals"], description: "6v6 game. Coach identifies pressing triggers: bad touch, back pass, sideways pass. Team presses collectively on the trigger and tries to win ball in 5 seconds.", coaching: ["Recognize the trigger instantly", "Nearest player sprints to press", "Cut off passing lanes behind the press", "If press fails, drop and regroup"], category: "tactical", skills: ["Defending","Pressing","Transition"], intensity: "high" },
  { id: "ta8", name: "Overload Attack (3v2)", phase: "tactical", focus: ["attacking", "decision making", "passing"], ages: [9,10,11,12,13,14], duration: 10, players: [5,15], equipment: ["cones", "bibs", "goals"], description: "3 attackers vs 2 defenders plus GK. Attackers start from halfway. Finish within 10 seconds. Rotate groups. Focus on creating and exploiting the extra player.", coaching: ["Spread wide to stretch defenders", "Pass to the free player", "Shoot early if the gap opens", "Don't over-play it — be direct"], category: "tactical", skills: ["Attacking","Decision Making","Finishing"], intensity: "high" },
  { id: "ta9", name: "Possession with Target Players", phase: "tactical", focus: ["possession", "passing"], ages: [10,11,12,13,14], duration: 12, players: [10,22], equipment: ["cones", "bibs"], description: "5v5 in a grid with a target player on each end line. Earn a point by playing the ball into your target and receiving it back. Target players play one-touch.", coaching: ["Look to play forward to target early", "Move to support after each pass", "Switch play to find space"], category: "tactical", skills: ["Possession","Passing","Vision"], intensity: "medium" },
  { id: "ta10", name: "2v2 to Mini Goals", phase: "tactical", focus: ["1v1", "attacking", "defending"], ages: [7,8,9,10,11,12,13,14], duration: 10, players: [4,20], equipment: ["cones", "bibs", "goals"], description: "Pairs play 2v2 on a small field with mini goals. Quick rounds of 90 seconds, losers rotate out. Teaches combination play in tight spaces.", coaching: ["Communicate with your partner", "Create width even in small spaces", "Recover quickly when you lose the ball"], category: "tactical", skills: ["1v1","Attacking","Defending"], intensity: "high" },
  { id: "ta11", name: "Offside Line Game", phase: "tactical", focus: ["defending", "positioning"], ages: [12,13,14], duration: 12, players: [10,22], equipment: ["cones", "bibs", "goals"], description: "7v7 with offside enforced. Defensive line practices holding and stepping up together. Coach freezes play to check the line.", coaching: ["Watch the ball, not just the attacker", "Step up as a unit on the whistle", "Communicate — one voice to push or drop"], category: "tactical", skills: ["Defending","Positioning","Communication"], intensity: "medium" },

  // ── GAME ADDITIONS ──────────────────────────────────────────────────────
  { id: "g3", name: "World Cup Tournament", phase: "game", focus: ["match play", "fun"], ages: [6,7,8,9,10,11,12], duration: 15, players: [8,30], equipment: ["cones", "bibs", "goals"], description: "Teams of 2-3 play a mini World Cup bracket. Losing team is eliminated or goes to a consolation bracket. Winners get bragging rights.", coaching: ["Let them compete", "Quick transitions between games", "Celebrate effort not just results"], category: "tactical", skills: ["Match Play","Fun"], intensity: "high" },
  { id: "g4", name: "King of the Ring", phase: "game", focus: ["dribbling", "1v1", "fun"], ages: [6,7,8,9,10,11,12,13,14], duration: 10, players: [6,24], equipment: ["cones", "balls"], description: "All players dribble inside a circle. Try to knock others' balls out while protecting yours. Last player with a ball wins. Eliminated players juggle outside.", coaching: ["Head up to see opponents", "Shield with your body", "Attack when others aren't looking"], category: "tactical", skills: ["Dribbling","1v1","Fun"], intensity: "medium" },
  { id: "g5", name: "End Zone Game", phase: "game", focus: ["possession", "attacking", "transition"], ages: [8,9,10,11,12,13,14], duration: 15, players: [8,20], equipment: ["cones", "bibs"], description: "5v5 — score by dribbling or passing into a 5-yard end zone. No goals needed. Emphasizes build-up play and collective movement.", coaching: ["Patient build-up", "Stretch the field wide", "Time runs into the end zone"], category: "tactical", skills: ["Possession","Attacking","Movement"], intensity: "high" },

  // ── COOL-DOWN ADDITIONS ─────────────────────────────────────────────────
  { id: "c3", name: "Static Stretching Circle", phase: "cooldown", focus: ["recovery"], ages: [6,7,8,9,10,11,12,13,14], duration: 5, players: [4,30], equipment: [], description: "Team in a circle. Hold each stretch 15-20 seconds: calves, hamstrings, quads, hip flexors, groin, shoulders. A different player leads each stretch.", coaching: ["No bouncing — hold steady", "Breathe through each stretch", "Work from ankles up to shoulders"], category: "warmup", skills: ["Recovery","Flexibility"], intensity: "low" },
  { id: "c4", name: "Cool-Down Keepaway", phase: "cooldown", focus: ["recovery", "passing"], ages: [8,9,10,11,12,13,14], duration: 5, players: [6,20], equipment: ["balls"], description: "6v2 keepaway at walking pace only. No running allowed. Focuses on gentle movement and passing accuracy while heart rate comes down.", coaching: ["Walking pace only", "Crisp passes, no lobs", "Use this time to chat about the session"], category: "warmup", skills: ["Recovery","Passing"], intensity: "low" },
  { id: "c5", name: "Partner Stretch & Review", phase: "cooldown", focus: ["recovery"], ages: [9,10,11,12,13,14], duration: 6, players: [4,30], equipment: [], description: "Players pair up and assist each other with stretches (hamstring, quad, calf). While stretching, coach asks each pair to name one thing they learned.", coaching: ["Gentle pressure — never force a stretch", "Hold 20 seconds per side", "End on a positive note"], category: "warmup", skills: ["Recovery","Flexibility"], intensity: "low" },

  // ── FUN GAMES (U6-U8 STAPLES) ──────────────────────────────────────────
  { id: "w11", name: "Red Light, Green Light", phase: "warmup", focus: ["dribbling", "fun"], ages: [6,7,8,9,10], duration: 5, players: [4,30], equipment: ["cones", "balls"], description: "Players line up with a ball. Coach shouts 'Green Light' — dribble forward. 'Red Light' — stop the ball dead with sole of foot. 'Yellow Light' — dribble slowly. Last to stop does 3 toe-taps.", coaching: ["Stop ball with sole, not by kicking ahead", "Keep ball close so you can stop quickly", "Head up to watch for the signal"], category: "warmup", skills: ["Dribbling","Ball Control","Fun"], intensity: "low" },
  { id: "w12", name: "Cops & Robbers", phase: "warmup", focus: ["dribbling", "fun", "1v1"], ages: [6,7,8,9,10], duration: 6, players: [6,24], equipment: ["cones", "balls", "bibs"], description: "Robbers dribble across a grid. 2-3 Cops (in bibs, no ball) try to kick robbers' balls out. If caught, go to 'jail' (cone area) and do 5 toe-taps to rejoin. Rotate cops every 2 minutes.", coaching: ["Robbers: shield the ball, change direction", "Cops: approach at an angle, be patient", "Use the whole space — don't bunch up"], category: "warmup", skills: ["Dribbling","Defending","Fun"], intensity: "medium" },
  { id: "w13", name: "Pirate Treasure", phase: "warmup", focus: ["dribbling", "fun"], ages: [6,7,8,9], duration: 6, players: [6,24], equipment: ["cones", "balls"], description: "Balls (treasure) are scattered in a central island. Pirates (teams of 3-4) dribble balls back to their base. Once the island is empty, you can steal from other bases. Team with the most treasure after 3 minutes wins.", coaching: ["Dribble under control — no kicking and chasing", "Protect your base treasure", "Decision making: steal nearby or go far?"], category: "warmup", skills: ["Dribbling","Decision Making","Fun"], intensity: "medium" },
  { id: "w14", name: "Wolf Tail Tag", phase: "warmup", focus: ["agility", "fun"], ages: [6,7,8,9,10,11,12], duration: 5, players: [6,30], equipment: ["bibs"], description: "Each player tucks a bib into the back of their shorts as a 'tail.' Everyone tries to pull others' tails while protecting their own. Last player with a tail wins. Can play with or without balls.", coaching: ["Stay low and agile", "Protect your tail with body positioning", "Keep moving — standing still makes you a target"], category: "warmup", skills: ["Agility","Fun","Awareness"], intensity: "medium" },
  { id: "g6", name: "Knockout", phase: "game", focus: ["dribbling", "1v1", "fun"], ages: [6,7,8,9,10,11,12], duration: 8, players: [6,24], equipment: ["cones", "balls"], description: "Everyone dribbles in a circle. Protect your ball while trying to kick others' balls out of the area. If your ball leaves, you're knocked out. Last 3 standing win. Eliminated players practice juggling outside.", coaching: ["Head up — scan for threats and targets", "Shield ball with body", "Use quick changes of direction"], category: "tactical", skills: ["Dribbling","1v1","Fun"], intensity: "medium" },

  // ── GATE PASSING & AWARENESS ───────────────────────────────────────────
  { id: "t15", name: "Gate Passing", phase: "technical", focus: ["passing", "dribbling", "decision making"], ages: [6,7,8,9,10,11,12], duration: 8, players: [4,20], equipment: ["cones", "balls"], description: "Scatter 10-15 cone gates (1m wide) around a 25x25 grid. Pairs try to pass through as many gates as possible in 2 minutes. Ball must go through the gate to a partner on the other side.", coaching: ["Scan for open gates", "Weight of pass matters — too hard goes past partner", "Move to a new gate immediately after scoring"], category: "technical", skills: ["Passing","Scanning","Decision Making"], intensity: "low" },
  { id: "t16", name: "Scanning Dribble", phase: "technical", focus: ["dribbling", "decision making"], ages: [8,9,10,11,12,13,14], duration: 8, players: [4,20], equipment: ["cones", "balls"], description: "Players dribble in a grid. Coach holds up colored cones or fingers — players must call out the number/color while dribbling. Progress: add defenders, increase speed.", coaching: ["Glance up every 2-3 touches", "Use peripheral vision", "Don't stop the ball to look — keep it moving"], category: "technical", skills: ["Dribbling","Awareness","Decision Making"], intensity: "medium" },
  { id: "t17", name: "Long Passing / Switching Play", phase: "technical", focus: ["passing"], ages: [10,11,12,13,14], duration: 10, players: [6,20], equipment: ["cones", "balls"], description: "Two groups 30-40m apart. Driven passes along the ground or lofted balls to switch play. Receive, control, turn, and switch back. Progress to moving targets.", coaching: ["Open body to the target", "Strike through the ball with laces for driven pass", "Get under the ball for lofted pass", "Cushion first touch on receive"], category: "technical", skills: ["Passing","Long Range","First Touch"], intensity: "medium" },

  // ── NUMBERS GAME ───────────────────────────────────────────────────────
  { id: "ta12", name: "Numbers Game", phase: "tactical", focus: ["transition", "1v1", "decision making", "fun"], ages: [7,8,9,10,11,12,13,14], duration: 12, players: [8,24], equipment: ["cones", "bibs", "goals"], description: "Two teams sit behind opposite goals, numbered 1 to N. Coach plays a ball into the field and calls a number — that number from each team sprints on to play 1v1. Call two numbers for 2v2, etc.", coaching: ["React to the ball instantly", "1v1: take the player on or shoot early", "2v2+: find your teammate quickly"], category: "tactical", skills: ["Transition","1v1","Decision Making","Fun"], intensity: "high" },

  // ── GOALKEEPER DRILLS ──────────────────────────────────────────────────
  { id: "gk1", name: "Shot Stopping Basics", phase: "technical", focus: ["goalkeeping"], ages: [8,9,10,11,12,13,14], duration: 10, players: [1,4], equipment: ["balls", "goals", "cones"], description: "GK starts in ready position. Coach serves shots from 12-16 yards — low left, low right, mid-height, high. 5 shots per round, rest, repeat. Focus on technique over power.", coaching: ["Set position: feet shoulder width, slight crouch, hands ready", "Step toward the ball", "Collapse technique for low shots — lead with bottom hand", "Catch when possible, parry only when necessary"], category: "technical", skills: ["Goalkeeping","Shot Stopping"], intensity: "medium" },
  { id: "gk2", name: "Angle Play & Positioning", phase: "technical", focus: ["goalkeeping", "positioning"], ages: [9,10,11,12,13,14], duration: 8, players: [1,4], equipment: ["balls", "goals", "cones"], description: "GK starts at the penalty spot. Coach positions at 5 different spots around the box. GK moves to correct angle for each position — coach checks the gap. Progress to live shots from each spot.", coaching: ["Bisect the angle between ball and posts", "Cover near post first", "Shuffle, don't cross feet", "Set before the shot"], category: "technical", skills: ["Goalkeeping","Positioning"], intensity: "medium" },
  { id: "gk3", name: "Crosses & High Balls", phase: "technical", focus: ["goalkeeping"], ages: [11,12,13,14], duration: 10, players: [2,6], equipment: ["balls", "goals"], description: "Servers cross from wide positions. GK must decide: come and claim or stay on the line. Add a striker to challenge. Call 'KEEPER' loudly when coming for the ball.", coaching: ["Attack the ball at the highest point", "Call early and loud", "Catch with hands in a W-shape above your head", "If you come, be decisive — no half measures"], category: "technical", skills: ["Goalkeeping","Crossing","Communication"], intensity: "high" },
  { id: "gk4", name: "Distribution Drill", phase: "technical", focus: ["goalkeeping", "passing"], ages: [9,10,11,12,13,14], duration: 8, players: [2,6], equipment: ["balls", "goals", "cones"], description: "GK practices 4 types of distribution: roll to feet, overarm throw, goal kick, and drop-kick. Targets at 10m, 20m, and 30m. Switch between quick release and building from the back.", coaching: ["Roll: smooth delivery to feet", "Throw: overarm like a quarterback for distance", "Goal kick: approach at an angle, strike with laces", "Choose the right option for the situation"], category: "technical", skills: ["Goalkeeping","Distribution","Passing"], intensity: "low" },

  // ── SET PIECES ─────────────────────────────────────────────────────────
  { id: "sp1", name: "Corner Kick Routine", phase: "tactical", focus: ["attacking", "shooting"], ages: [10,11,12,13,14], duration: 10, players: [8,16], equipment: ["balls", "goals", "cones"], description: "Practice 3 corner routines: near-post flick, far-post delivery, and short corner. Assign runs: near post, penalty spot, far post, edge of box. Defenders included for realistic practice.", coaching: ["Attackers: time your run — arrive with the ball", "Delivery: aim for the target area, not a specific head", "Defenders: mark a player or a zone, not both", "GK: organize the box before the kick"], category: "tactical", skills: ["Set Pieces","Attacking","Finishing"], intensity: "medium" },
  { id: "sp2", name: "Free Kick Shooting", phase: "tactical", focus: ["shooting"], ages: [10,11,12,13,14], duration: 10, players: [4,12], equipment: ["balls", "goals", "cones"], description: "Practice free kicks from 20-25 yards. Set up a wall of mannequins or players. Work on: over the wall with dip, around the wall with curve, low and hard under the wall. Rotate takers.", coaching: ["Approach at a slight angle", "Non-kicking foot next to the ball", "Strike across the ball for curve", "Follow through toward the target"], category: "technical", skills: ["Shooting","Set Pieces","Technique"], intensity: "medium" },
  { id: "sp3", name: "Throw-In Plays", phase: "tactical", focus: ["attacking", "possession"], ages: [9,10,11,12,13,14], duration: 8, players: [6,16], equipment: ["balls", "cones"], description: "Practice 3 throw-in patterns: short to feet and lay off, long throw into the box, and a decoy run with a check-back. Emphasize retaining possession from every throw-in.", coaching: ["Receiver: check away then come short", "Thrower: both feet on the ground, ball behind head", "Third-man run to receive the lay-off", "Never throw into a crowd — have a plan"], category: "tactical", skills: ["Set Pieces","Possession","Movement"], intensity: "low" },
  // ── VOLLEY & FINISHING ────────────────────────────────────────────
  { id: "t18", name: "Volley Finishing", phase: "technical", focus: ["shooting"], ages: [10,11,12,13,14], duration: 10, players: [4,16], equipment: ["cones", "balls", "goals"], description: "Server tosses or crosses ball for volleys on goal. Progress: stationary side volleys, moving volleys, half-volleys off the bounce, then headed finishes.", coaching: ["Plant foot beside the ball", "Knee over the ball, lean forward", "Lock ankle and follow through", "Practice both feet"], category: "technical", skills: ["Shooting","Volleys","Technique"], intensity: "medium" },
  { id: "t19", name: "One-Two Combination Play", phase: "technical", focus: ["passing", "attacking"], ages: [8,9,10,11,12,13,14], duration: 10, players: [4,20], equipment: ["cones", "balls"], description: "Pairs practice wall passes in a 15x10 grid. Player A passes to B, sprints past, receives the return pass. Progress to trios and add a passive defender.", coaching: ["Firm first pass into partner's feet", "Sprint immediately after passing", "Receiving player: one-touch return", "Time the run — don't go too early"], category: "technical", skills: ["Passing","Movement","Combination Play"], intensity: "medium" },
  // ── DEFENSIVE 1v1 ────────────────────────────────────────────────
  { id: "ta13", name: "1v1 Defensive Jockeying", phase: "tactical", focus: ["defending"], ages: [9,10,11,12,13,14], duration: 10, players: [4,20], equipment: ["cones", "bibs"], description: "Defender practices staying on their feet and jockeying the attacker toward the sideline. Attacker tries to dribble past in a 10x15 channel. Focus on body shape, not diving in.", coaching: ["Stay on your feet — don't lunge", "Bend knees, stay side-on to force one direction", "Arm's length distance from attacker", "Patience — wait for a heavy touch"], category: "tactical", skills: ["Defending","1v1","Positioning"], intensity: "medium" },
  // ── RECEIVING UNDER PRESSURE ─────────────────────────────────────
  { id: "t20", name: "Receive Under Pressure", phase: "technical", focus: ["first touch", "passing"], ages: [9,10,11,12,13,14], duration: 10, players: [6,16], equipment: ["cones", "balls", "bibs"], description: "Player receives a pass with a defender closing from behind. Must scan before receiving, take a touch away from pressure, then play forward. Rotate all three roles.", coaching: ["Check your shoulder BEFORE the ball arrives", "Open your body to see the field", "First touch away from the defender", "Play forward when possible"], category: "technical", skills: ["First Touch","Awareness","Passing"], intensity: "medium" },
  // ── RONDO & POSSESSION ───────────────────────────────────────────
  { id: "ta14", name: "Rondo 6v2", phase: "tactical", focus: ["possession", "passing"], ages: [10,11,12,13,14], duration: 10, players: [8,16], equipment: ["cones", "bibs"], description: "6 outside players keep possession from 2 pressing defenders in a 12x12 grid. Defenders work as a pair to cut passing lanes. Rotate in after winning the ball or every 90 seconds.", coaching: ["One-touch when possible", "Defenders: press as a pair, not individually", "Support at angles, not behind the ball", "Split the defenders with through-passes"], category: "tactical", skills: ["Passing","Possession","Pressing"], intensity: "medium" },
  // ── OFF-BALL MOVEMENT ────────────────────────────────────────────
  { id: "ta15", name: "Support Runs & Overlaps", phase: "tactical", focus: ["attacking", "movement"], ages: [10,11,12,13,14], duration: 12, players: [6,16], equipment: ["cones", "bibs", "balls"], description: "Groups of 3 practice attacking combinations: overlap runs (outside), underlap runs (inside), and checking runs (toward then away). Progress from patterns on cones to 3v2 live.", coaching: ["Timing — don't run too early", "Call for the ball on the overlap", "Ball carrier: sell the dribble before passing", "Vary the runs to stay unpredictable"], category: "tactical", skills: ["Movement","Attacking","Teamwork"], intensity: "medium" },
  // ── SMALL-SIDED GAMES ────────────────────────────────────────────
  { id: "g7", name: "Touch-Limit Game (3v3)", phase: "game", focus: ["decision making", "passing"], ages: [9,10,11,12,13,14], duration: 12, players: [6,12], equipment: ["cones", "bibs", "goals"], description: "3v3 on a small pitch with a 2-touch maximum. Forces quick scanning, pre-decision, and fast passing. Award bonus points for one-touch goals.", coaching: ["Scan before you receive", "First touch sets up the second", "Position yourself to play one-touch", "Move immediately after passing"], category: "tactical", skills: ["Decision Making","Passing","Awareness"], intensity: "high" },
  // ── TRANSITION ───────────────────────────────────────────────────
  { id: "ta16", name: "Counter-Attack Transition", phase: "tactical", focus: ["transition", "attacking"], ages: [10,11,12,13,14], duration: 12, players: [8,20], equipment: ["cones", "bibs", "goals"], description: "4v4 with transition focus. When a team wins the ball they must attack the opposite goal within 6 seconds. Defending team must reorganize quickly. Emphasize speed of play after the turnover.", coaching: ["First action: look forward", "Play the killer pass early", "Support runners sprint into space", "If you can't score in 6 seconds, keep possession"], category: "tactical", skills: ["Transition","Decision Making","Speed of Play"], intensity: "high" },
  // ── GOALKEEPER ────────────────────────────────────────────────────
  { id: "gk5", name: "GK Footwork & Reactions", phase: "technical", focus: ["goalkeeping"], ages: [8,9,10,11,12,13,14], duration: 8, players: [1,4], equipment: ["balls", "cones", "goals"], description: "GK shuffles between cones, then reacts to a shot. Variations: shuffle left then save right, shuffle forward then backpedal and save, two rapid shots in succession.", coaching: ["Stay on the balls of your feet", "Set your feet before the shot", "Push off the near foot to dive", "Get back to your feet quickly after each save"], category: "technical", skills: ["Goalkeeping","Footwork","Reactions"], intensity: "high" },
];

// Convert full drills to Whistle-format display data
const drillsBySport = {
  Soccer: soccerDrillsFull.map(d => ({
    ...d,
    desc: d.description,
    ages: AGE_GROUPS.filter(ag => ag.ages.some(a => d.ages.includes(a))).map(ag => ag.value),
    instructions: d.description + "\n\nCoaching Points:\n" + (d.coaching || []).map((cp, i) => `${i+1}. ${cp}`).join("\n"),
    variations: d.focus.length > 1 ? `Progress by focusing on ${d.focus.join(" and ")}. Adjust grid size and player count as needed.` : null,
    skills: d.skills || d.focus.map(f => f.charAt(0).toUpperCase() + f.slice(1)),
    players: `${d.players[0]}-${d.players[1]}`,
    equipment: d.equipment.map(e => e.charAt(0).toUpperCase() + e.slice(1)),
  })),
  Basketball: [
    // ── WARM-UP ─────────────────────────────────────────────────────────
    { id: 101, name: "3-Man Weave", duration: 8, category: "warmup", ages: ["U10","U12","U14"], skills: ["Passing","Conditioning"], desc: "Classic full-court passing drill with layup finish", intensity: "medium", players: "3+", equipment: ["Balls"], instructions: "Three players line up at the baseline.\n1. Middle player passes right and goes behind\n2. Receiver passes to the other side and goes behind\n3. Continue weaving down the court\n4. Finish with a layup", coaching: ["Chest passes, call for the ball, fill the lanes wide."], variations: "Add a 2-on-1 back. No-dribble rule." },
    { id: 105, name: "Dynamic Warm-Up Lines", duration: 6, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["Conditioning","Agility"], desc: "Movement patterns across the court to activate muscles", intensity: "medium", players: "4+", equipment: [], instructions: "Players line up on the baseline.\n1. High knees to half court\n2. Butt kicks back\n3. Defensive slides across\n4. Carioca, skipping, backpedal", coaching: ["Full range of motion. Stay low on slides. Light on your feet."], variations: "Add ball handling while moving. Race format." },
    { id: 106, name: "Dribble Knockout", duration: 6, category: "warmup", ages: ["U8","U10","U12"], skills: ["Dribbling","Awareness"], desc: "Protect your dribble while knocking out others' balls", intensity: "medium", players: "6+", equipment: ["Balls","Cones"], instructions: "All players dribble in a confined area.\n1. Protect your ball with your body\n2. Try to knock others' balls out of bounds\n3. If your ball goes out, you're eliminated\n4. Last 3 standing win", coaching: ["Keep head up. Use off-hand to shield. Stay low."], variations: "Shrink the area over time. Weak-hand only." },
    // ── DRIBBLING / BALL HANDLING ────────────────────────────────────────
    { id: 107, name: "Cone Dribbling Course", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Dribbling","Ball Handling"], desc: "Weave through cones with crossovers and between-the-legs moves", intensity: "medium", players: "1+", equipment: ["Balls","Cones"], instructions: "Set cones in a line 5 feet apart.\n1. Crossover dribble at each cone\n2. Return with between-the-legs\n3. Third rep: behind-the-back\n4. Time each run", coaching: ["Eyes up, not on the ball. Low dribble through cones. Explode out."], variations: "Add a defender trailing. Two-ball dribbling." },
    { id: 108, name: "Stationary Ball Handling", duration: 6, category: "technical", ages: ["U6","U8","U10"], skills: ["Ball Handling","Coordination"], desc: "In-place drills to build comfort and hand speed", intensity: "low", players: "1+", equipment: ["Balls"], instructions: "Each player with a ball, standing in place.\n1. Pound dribble (right, left)\n2. Crossover low and fast\n3. Figure-8 around legs\n4. Spider dribble\n30 seconds each", coaching: ["Keep the ball below your knee. Use fingertips, not palms."], variations: "Eyes closed for advanced players. Two balls." },
    // ── PASSING ──────────────────────────────────────────────────────────
    { id: 109, name: "Partner Passing on the Move", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Passing","Conditioning"], desc: "Pairs jog the court passing chest, bounce, and overhead", intensity: "medium", players: "2+", equipment: ["Balls"], instructions: "Two players jog side by side up the court.\n1. Chest pass back and forth\n2. Return with bounce passes\n3. Third trip: overhead passes\n4. Finish with a layup", coaching: ["Step into your pass. Hit your partner's chest. Hands ready to receive."], variations: "Add a defender between the passers. No-look passes." },
    { id: 110, name: "Star Passing", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Passing","Movement"], desc: "5 players in a star formation, pass and follow your pass", intensity: "medium", players: "5+", equipment: ["Balls"], instructions: "5 spots in a star shape.\n1. Pass to the player two spots away\n2. Follow your pass to their spot\n3. Add a second ball for advanced groups", coaching: ["Call the name before passing. Crisp passes. Move immediately."], variations: "One-touch passing. Add a defender in the middle." },
    // ── SHOOTING ─────────────────────────────────────────────────────────
    { id: 102, name: "Mikan Drill", duration: 6, category: "technical", ages: ["U8","U10","U12"], skills: ["Layups","Footwork"], desc: "Alternating layups from each side of the basket", intensity: "low", players: "1+", equipment: ["Balls"], instructions: "Stand under the basket.\n1. Right-hand layup from the right side\n2. Catch the ball out of the net\n3. Left-hand layup from the left side\n4. Repeat continuously", coaching: ["Use the backboard. Soft touch. Keep ball high."], variations: "Add reverse layups. Use power finishes." },
    { id: 104, name: "Spot Shooting", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Shooting","Form"], desc: "Shoot from 5 spots around the arc for form and consistency", intensity: "low", players: "1+", equipment: ["Balls"], instructions: "5 spots: corners, wings, top of key.\n1. Shoot 5 from each spot\n2. Track makes\n3. Catch and shoot — feet set before the catch\n4. Move to the next spot", coaching: ["Balance, elbow in, follow through, hold the release."], variations: "Add a defender closing out. Off-the-dribble pull-ups." },
    { id: 111, name: "Form Shooting", duration: 8, category: "technical", ages: ["U6","U8","U10","U12"], skills: ["Shooting","Form"], desc: "Close-range shots focusing on perfect technique", intensity: "low", players: "1+", equipment: ["Balls"], instructions: "Start 3-4 feet from the basket.\n1. One-hand shooting: guide hand off, elbow in\n2. Flick wrist, hold follow-through\n3. Make 5, take a step back\n4. Repeat out to free throw line", coaching: ["Elbow under the ball. Eyes on the rim. Hold your follow-through."], variations: "Shooting off the catch. Add a jab step before shooting." },
    { id: 112, name: "Layup Lines", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Layups","Finishing"], desc: "Classic two-line layup drill for game-speed finishing", intensity: "medium", players: "6+", equipment: ["Balls"], instructions: "Two lines: shooting line (balls) and rebounding line.\n1. Dribble in, right-hand layup from right side\n2. Rebounder gets the ball, passes to next in shooting line\n3. Switch sides halfway through", coaching: ["Inside foot plants, outside knee drives up. Use backboard. Game speed."], variations: "Left-hand layups. Euro-step finish. Reverse layups." },
    // ── DEFENSE ──────────────────────────────────────────────────────────
    { id: 103, name: "Shell Defense", duration: 12, category: "tactical", ages: ["U10","U12","U14"], skills: ["Defense","Positioning"], desc: "Teach help-side defensive positioning and rotations", intensity: "medium", players: "8+", equipment: ["Balls","Cones"], instructions: "4 offensive players on the perimeter, 4 defenders.\n1. Ball moves around the perimeter (no dribble)\n2. Defenders adjust positions: on-ball, deny, help\n3. Coach calls 'drive' — offense attacks, defense rotates", coaching: ["See man and ball. Jump to the ball on every pass."], variations: "Allow dribble drives. Play live 4v4." },
    { id: 113, name: "Zig-Zag Defensive Slides", duration: 6, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Defense","Footwork"], desc: "Defensive slide technique in a zig-zag pattern down the court", intensity: "high", players: "1+", equipment: ["Cones"], instructions: "Set cones in a zig-zag down the court.\n1. Defensive slide to each cone\n2. Drop step and slide the opposite direction\n3. Stay low, hands active\n4. Sprint back and repeat", coaching: ["Never cross your feet. Stay low. Chest in front of the ball handler."], variations: "Add a ball handler to guard. Race a partner." },
    { id: 114, name: "Closeout Drill", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Defense","Closeouts"], desc: "Practice closing out on shooters with proper technique", intensity: "high", players: "4+", equipment: ["Balls","Cones"], instructions: "Defender under the basket, offensive player on the wing.\n1. Coach passes to the wing player\n2. Defender sprints out with choppy steps\n3. Contest the shot without fouling\n4. Box out and rebound", coaching: ["Sprint then chop your feet. High hand on the shot. Don't fly by."], variations: "Offensive player can drive or shoot. Add a help defender." },
    // ── TACTICAL / GAME ─────────────────────────────────────────────────
    { id: 115, name: "3-on-2 / 2-on-1 Fast Break", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Transition","Decision Making"], desc: "Continuous fast break drill with advantage situations", intensity: "high", players: "5+", equipment: ["Balls"], instructions: "3 offensive players attack 2 defenders.\n1. Fill the lanes: ball in the middle, wings wide\n2. Attack quickly, make the extra pass\n3. After the play, 2 defenders become offense going back 2-on-1", coaching: ["Push the ball ahead. Attack before defense sets. Make the simple play."], variations: "4-on-3 version. Add a trailing defender." },
    { id: 116, name: "5-on-5 Half Court", duration: 15, category: "game", ages: ["U10","U12","U14"], skills: ["Offense","Defense","Teamwork"], desc: "Half-court scrimmage with coaching stoppages", intensity: "high", players: "10+", equipment: ["Balls"], instructions: "5v5 half-court game.\n1. Play to 7 points (make-it take-it or change possession)\n2. Coach can freeze play to teach spacing\n3. Emphasize motion offense, screen-away, cut principles", coaching: ["Move without the ball. Set screens. Talk on defense."], variations: "Conditioned: must pass 3 times before shooting. No-dribble scrimmage." },
    { id: 117, name: "Rebounding Box Out", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Rebounding","Positioning"], desc: "Teach box-out fundamentals and securing the rebound", intensity: "medium", players: "4+", equipment: ["Balls"], instructions: "Pairs at the block.\n1. Coach shoots the ball\n2. Defender makes contact, pivots to box out\n3. Offensive player tries to get the rebound\n4. Rebounder outlets to the wing", coaching: ["Make contact first. Wide base. Chin the ball."], variations: "3-on-3 rebounding. Outlet and fast break." },
    { id: 118, name: "Free Throw Shooting", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Shooting","Mental Focus"], desc: "Practice free throws with a routine and pressure", intensity: "low", players: "1+", equipment: ["Balls"], instructions: "Each player shoots 10 free throws.\n1. Establish a routine: dribble, breathe, shoot\n2. Track makes\n3. Pressure round: must make 2 in a row to finish", coaching: ["Same routine every time. Relax your shoulders. Follow through."], variations: "Team competition: losers run. Game-situation free throws (fatigued)." },
    { id: 119, name: "Pick & Roll Basics", duration: 10, category: "tactical", ages: ["U12","U14"], skills: ["Offense","Screening"], desc: "Teach ball screen fundamentals for ball handler and screener", intensity: "medium", players: "4+", equipment: ["Balls","Cones"], instructions: "Ball handler and screener vs. 2 defenders.\n1. Screener sets a screen on the ball handler's defender\n2. Ball handler uses the screen, reads the defense\n3. Screener rolls to the basket or pops out\n4. Make the right read", coaching: ["Screener: set your feet, be a wall. Handler: set up the screen, turn the corner. Read the defense."], variations: "Pick and pop. Slip screen. Add a third defender." },
    // ── COOL-DOWN ──────────────────────────────────────────────────────
    { id: 120, name: "Free Throw & Stretch", duration: 5, category: "cooldown", ages: ["U6","U8","U10","U12","U14"], skills: ["Shooting","Recovery"], desc: "Relaxed free throws and team stretching to wind down", intensity: "low", players: "1+", equipment: ["Balls"], instructions: "Each player shoots 5 free throws.\n1. Focus on routine and form\n2. Team gathers at center court\n3. Static stretches: quads, hamstrings, calves, shoulders\n4. Coach reviews session highlights", coaching: ["Hold each stretch 15-20 seconds. Positive feedback. Preview next session."], variations: "Shooting game: knock-out or around-the-world." },
    // ── YOUNG PLAYER ENGAGEMENT (U6-U8) ───────────────────────────────
    { id: 121, name: "Dribble Tag", duration: 6, category: "warmup", ages: ["U6","U8","U10"], skills: ["Dribbling","Awareness"], desc: "Tag game where everyone dribbles — taggers and runners", intensity: "medium", players: "6+", equipment: ["Balls","Cones"], instructions: "All players dribble in a defined area.\n1. 2 taggers (different colored ball) try to tag dribblers\n2. Tagged players do 5 ball slaps then rejoin\n3. Switch taggers every 90 seconds", coaching: ["Keep your head up to see taggers. Protect your dribble. Change direction quickly."], variations: "Freeze tag: tagged players freeze until a teammate dribbles through their legs." },
    { id: 122, name: "Musical Basketballs", duration: 5, category: "warmup", ages: ["U6","U8"], skills: ["Dribbling","Fun"], desc: "Musical chairs but with basketballs and dribbling", intensity: "low", players: "6+", equipment: ["Balls","Cones"], instructions: "Place cones in a circle (one fewer than players).\n1. Players dribble around the circle while music plays\n2. When music stops, dribble to a cone and pick up the ball\n3. Player without a cone does a fun challenge (5 ball slaps)", coaching: ["Keep dribbling the whole time. Stay low. Use your fingertips, not your palm."], variations: "Use two balls for advanced players. Add direction changes." },
    { id: 123, name: "Shark Attack", duration: 6, category: "warmup", ages: ["U6","U8","U10"], skills: ["Dribbling","Agility"], desc: "Sharks try to knock balls away while dribblers cross the ocean", intensity: "medium", players: "8+", equipment: ["Balls","Cones"], instructions: "Players line up on one baseline (the 'shore').\n1. 2 sharks stand in the middle (the 'ocean')\n2. On 'GO,' dribblers try to cross to the other shore\n3. Sharks knock balls out — those players become sharks\n4. Last 3 standing win", coaching: ["Keep ball close when near a shark. Speed up in open water. Use your body to shield."], variations: "Sharks must also dribble a ball. Add side boundaries." },
    // ── PASSING & DECISION MAKING ─────────────────────────────────────
    { id: 124, name: "Keep Away (10-Pass Game)", duration: 10, category: "tactical", ages: ["U8","U10","U12","U14"], skills: ["Passing","Decision Making"], desc: "Possession game: complete 10 passes to score a point", intensity: "medium", players: "6+", equipment: ["Balls","Cones","Bibs"], instructions: "3v3 or 4v4 in a confined area.\n1. Team with the ball tries to complete 10 consecutive passes\n2. Defenders try to steal or deflect\n3. Count resets on turnover\n4. First team to 3 points wins", coaching: ["Spacing — spread out. Move after you pass. Use fakes. Crisp passes."], variations: "Require bounce passes only. Add a no-dribble rule. 2-touch limit." },
    { id: 125, name: "3-on-3 No-Dribble", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Passing","Cutting","Spacing"], desc: "Half-court 3v3 where offense cannot dribble at all", intensity: "medium", players: "6+", equipment: ["Balls"], instructions: "3v3 half-court, no dribbling allowed.\n1. Must move the ball only by passing\n2. Score by catching a pass in the paint or making a layup\n3. Forces cutting, screening, and constant movement\n4. Play to 7", coaching: ["Cut to open space. Use v-cuts to get open. Set screens for teammates. Pass fakes are your friend."], variations: "Allow one dribble to finish at the rim. Add a 5-second holding rule." },
    // ── SHOOTING & FINISHING ──────────────────────────────────────────
    { id: 126, name: "Around the World", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Shooting","Accuracy"], desc: "Shoot from spots around the key — make it to advance", intensity: "low", players: "2+", equipment: ["Balls"], instructions: "5-7 spots in an arc around the basket.\n1. Make a shot to advance to the next spot\n2. Miss: stay or 'chance it' (risk going back to start)\n3. First player to complete all spots wins", coaching: ["Set your feet before shooting. Follow through every time. Know your range."], variations: "Add a 3-point line version. Timed rounds." },
    { id: 127, name: "Two-Ball Finishing", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Finishing","Footwork"], desc: "Continuous finishing drill with two balls and two lines", intensity: "high", players: "4+", equipment: ["Balls"], instructions: "Two lines on each side of the basket.\n1. Right side: right-hand layup, rebound, outlet to left line\n2. Left side: left-hand layup, rebound, outlet to right line\n3. Continuous — no breaks\n4. Add floaters, euro-steps, reverse layups", coaching: ["Inside foot plants, outside knee drives. Use the backboard. Game speed."], variations: "Add a trailing defender. Power finish vs. finesse." },
    // ── OFFENSE & SCREENING ──────────────────────────────────────────
    { id: 128, name: "Down Screen & Curl", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Screening","Shooting"], desc: "Teach off-ball screens: screener sets pick, cutter curls for catch-and-shoot", intensity: "medium", players: "4+", equipment: ["Balls","Cones"], instructions: "Screener at the block, cutter at the wing.\n1. Screener sets a down screen\n2. Cutter reads the defense: curl tight, fade, or straight cut\n3. Passer delivers ball at the right time\n4. Catch and shoot", coaching: ["Screener: wide base, hands on chest. Cutter: set up your defender first. Read the defense."], variations: "Add a flare screen option. Live 2-on-2 off the screen." },
    { id: 129, name: "Motion Offense Basics", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Offense","Spacing","Teamwork"], desc: "5-player motion offense: pass-cut-fill principles", intensity: "medium", players: "5+", equipment: ["Balls","Cones"], instructions: "5 spots: 2 wings, 2 corners, 1 top.\n1. Pass and cut to the basket or screen away\n2. Other players fill empty spots\n3. Keep spacing — don't crowd\n4. Progress from air to live defense", coaching: ["Pass, don't stand. Screen away from the ball. Fill from behind. Space the floor."], variations: "Add a dribble-drive trigger. Limit to 3 passes before you must shoot." },
    // ── TRANSITION / FAST BREAK ───────────────────────────────────────
    { id: 130, name: "Outlet & Fill Lanes", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Transition","Passing"], desc: "Practice rebounding and pushing the ball in transition with proper lane filling", intensity: "high", players: "5+", equipment: ["Balls"], instructions: "Coach shoots, rebounder outlets to the wing.\n1. Outlet pass to guard on the sideline\n2. Point guard pushes the ball up the middle\n3. Wings sprint and fill outside lanes\n4. Finish with a layup or kick-out for three", coaching: ["Rebounder: chin the ball, look for the outlet. Wings: sprint wide, don't ball-watch."], variations: "Add 1-2 defenders. Transition into half-court offense if fast break not there." },
    // ── CONDITIONING / FUN GAMES ──────────────────────────────────────
    { id: 131, name: "King of the Court (1v1)", duration: 10, category: "game", ages: ["U8","U10","U12","U14"], skills: ["1v1","Offense","Defense"], desc: "Continuous 1v1: winner stays, loser rotates out", intensity: "high", players: "4+", equipment: ["Balls"], instructions: "One basket, 1v1.\n1. Check ball at the top of the key\n2. 3 dribbles max to score\n3. Winner stays on offense, gets a point\n4. Loser goes to end of the line\n5. First to 5 wins", coaching: ["Attack with purpose. Use fakes. Play defense — don't just stand there."], variations: "2-dribble limit. Must use a move before shooting. Make-it-take-it." },
    { id: 132, name: "Lightning (Knockout)", duration: 8, category: "game", ages: ["U6","U8","U10","U12","U14"], skills: ["Shooting","Pressure"], desc: "Fast-paced shooting game — make it before the player behind you", intensity: "medium", players: "5+", equipment: ["Balls"], instructions: "Players line up at the free throw line with 2 balls.\n1. First player shoots — if they miss, rebound and score before player 2\n2. If player 2 scores first, player 1 is out\n3. Last player standing wins", coaching: ["Make the first shot. If you miss, hustle for the rebound. Stay calm under pressure."], variations: "Start from 3-point line. Left-hand layup required." },
    { id: 133, name: "21 (Hustle Game)", duration: 10, category: "game", ages: ["U8","U10","U12","U14"], skills: ["Shooting","Rebounding","Hustle"], desc: "Classic playground game to 21 with free throws and tip-ins", intensity: "high", players: "3+", equipment: ["Balls"], instructions: "3+ players at one basket.\n1. Coach shoots — everyone fights for the rebound\n2. Score from the field = 2 points, free throw = 1\n3. After scoring, shoot free throws (make = 1 pt each, miss = ball is live)\n4. First to exactly 21 wins (go over = back to 15)", coaching: ["Box out. Hustle for every loose ball. Smart shot selection."], variations: "Must score on a tip-in. No 3-pointers." },
  ],
  Baseball: [
    // ── WARM-UP ─────────────────────────────────────────────────────────
    { id: 203, name: "Throwing Progression", duration: 8, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["Throwing","Arm Care"], desc: "Gradual warm-up from short toss to full throws", intensity: "low", players: "2+", equipment: ["Balls","Gloves"], instructions: "Partners start 30 feet apart.\n1. Wrist flicks (20 throws)\n2. One-knee throws (20 throws)\n3. Standing throws, step back 10 feet each round\n4. Long toss at full distance", coaching: ["Fingers on top of the ball. Follow through to your opposite hip. Arm slot consistent."], variations: "Add crow-hop for outfielders. Quick-release throws." },
    { id: 204, name: "Agility & Baserunning Warm-Up", duration: 6, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["Baserunning","Agility"], desc: "Movement drills on the basepaths to activate legs", intensity: "medium", players: "4+", equipment: ["Bases"], instructions: "Run the bases with different movements:\n1. Sprint home to first\n2. Jog first to second (practice rounding the bag)\n3. Sprint second to third\n4. Jog home\nRepeat with sliding practice at second", coaching: ["Hit the inside of the bag when rounding. Lean into your turn. Slide feet-first."], variations: "Add coach signals for go/stop. Steal practice." },
    // ── HITTING ──────────────────────────────────────────────────────────
    { id: 201, name: "Soft Toss Hitting", duration: 10, category: "technical", ages: ["U8","U10","U12"], skills: ["Batting","Timing"], desc: "Partner tosses from the side for focused swing work", intensity: "low", players: "2+", equipment: ["Balls","Bat","Net"], instructions: "Hitter stands at the plate, tosser kneels to the side.\n1. Tosser flips ball into the hitting zone\n2. Hitter drives through the ball into a net\n3. 10 swings, then switch", coaching: ["Load back, stride forward, stay inside the ball."], variations: "High/low tosses. Inside/outside locations." },
    { id: 205, name: "Tee Work Stations", duration: 10, category: "technical", ages: ["U6","U8","U10","U12"], skills: ["Batting","Swing Mechanics"], desc: "Hit off a tee at different heights and locations", intensity: "low", players: "1+", equipment: ["Balls","Bat","Tee","Net"], instructions: "Set up 3 tees at different heights:\n1. Belt-high (middle)\n2. Low and inside\n3. High and away\nTake 10 swings at each, focus on contact point", coaching: ["Eyes on the ball through contact. Swing level. Drive through, don't chop."], variations: "Front toss progression. Two-strike approach." },
    { id: 206, name: "Front Toss / Flips", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Batting","Timing"], desc: "Coach tosses from behind an L-screen for live reps", intensity: "medium", players: "2+", equipment: ["Balls","Bat","L-Screen"], instructions: "Coach kneels behind L-screen, 15 feet away.\n1. Flip balls into the zone at moderate speed\n2. Hitter focuses on timing and barrel accuracy\n3. 10-15 swings per round", coaching: ["Load early. See the ball out of the hand. Stay through the ball."], variations: "Mix speeds. Call inside/outside before the toss." },
    // ── FIELDING ─────────────────────────────────────────────────────────
    { id: 202, name: "Ground Ball Circuit", duration: 12, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Fielding","Throwing"], desc: "Infielders rotate through ground ball stations", intensity: "medium", players: "4+", equipment: ["Balls","Gloves","Bases"], instructions: "Set up 3 stations at SS, 2B, and 3B.\n1. Coach hits ground balls\n2. Field cleanly, throw to first\n3. Rotate stations every 3 minutes", coaching: ["Get in front of the ball. Field with two hands. Quick transfer."], variations: "Slow rollers. Backhand plays. Double play feeds." },
    { id: 207, name: "Pop Fly Communication", duration: 8, category: "tactical", ages: ["U8","U10","U12","U14"], skills: ["Fielding","Communication"], desc: "Practice calling and catching fly balls with teammates", intensity: "medium", players: "4+", equipment: ["Balls","Gloves"], instructions: "3 fielders in a triangle.\n1. Coach pops a ball up between them\n2. Call 'I GOT IT' twice and wave others off\n3. Catch at eye level, feet set\n4. Throw to cutoff after the catch", coaching: ["Call it LOUD and early. Priority: CF > corners > infielders. Catch above your head."], variations: "Add sun simulation (look up into lights). Running catches." },
    { id: 208, name: "Outfield Relay Throws", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Throwing","Fielding","Teamwork"], desc: "Practice cutoff and relay throw mechanics from the outfield", intensity: "medium", players: "6+", equipment: ["Balls","Gloves","Bases"], instructions: "Outfielder fields a ball in the gap.\n1. Cutoff man lines up between fielder and target base\n2. Outfielder hits the cutoff chest-high\n3. Cutoff man turns and throws to the base\n4. Rotate positions", coaching: ["Cutoff: arms up, be a target. Outfielder: hit the chest. Quick release."], variations: "Add a runner to create urgency. Different base targets." },
    // ── PITCHING ─────────────────────────────────────────────────────────
    { id: 209, name: "Pitching Mechanics Drill", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Pitching","Mechanics"], desc: "Break down the delivery into phases for clean mechanics", intensity: "low", players: "1+", equipment: ["Balls","Gloves"], instructions: "3-step progression:\n1. Balance point: lift knee, hold for 2 seconds\n2. Stride: step toward home, land on a bent front leg\n3. Full delivery: put it all together\nHold finish position for 2 seconds after each pitch", coaching: ["Stay tall and balanced. Lead with your hip. Follow through to your glove side."], variations: "Towel drill for arm path. Flat ground vs. mound work." },
    // ── BASE RUNNING ────────────────────────────────────────────────────
    { id: 210, name: "Steal & React", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Baserunning","Speed"], desc: "Practice lead-offs, reads, and steal technique", intensity: "high", players: "4+", equipment: ["Bases"], instructions: "Runner at first, coach simulates a pitcher.\n1. Take a lead (2 body lengths)\n2. Coach signals: pitch (go!) or pick-off (dive back!)\n3. Sprint to second on pitch signal\n4. Practice feet-first slide", coaching: ["Explosive first step. Crossover step to second. Read the pitcher's front shoulder."], variations: "Delayed steal. Hit-and-run reads." },
    // ── SITUATIONAL / GAME ──────────────────────────────────────────────
    { id: 211, name: "Situational Scrimmage", duration: 15, category: "game", ages: ["U10","U12","U14"], skills: ["Game Awareness","Decision Making"], desc: "Simulated game situations with coaching stoppages", intensity: "high", players: "9+", equipment: ["Balls","Gloves","Bat","Bases"], instructions: "Set up specific scenarios:\n1. Runner on second, 1 out — hit to right side\n2. Runner on third, less than 2 outs — squeeze bunt or sac fly\n3. Bases loaded — what's the play on a ground ball?\nRotate through scenarios", coaching: ["Know the situation before every pitch. Think one play ahead. Communicate."], variations: "Live pitching. Add pressure with outs and innings." },
    { id: 212, name: "Batting Practice Rounds", duration: 15, category: "technical", ages: ["U10","U12","U14"], skills: ["Batting","Approach"], desc: "Structured BP with specific goals each round", intensity: "medium", players: "4+", equipment: ["Balls","Bat","Gloves","Bases"], instructions: "Rotate through batting order:\n1. Round 1: hit to the opposite field (5 swings)\n2. Round 2: hit and run — put the ball in play (5 swings)\n3. Round 3: drive the ball / power swings (5 swings)\nFielders play live positions", coaching: ["Have a plan before you step in. Adjust to the pitch. Compete every swing."], variations: "Add base runners. Simulated counts." },
    // ── COOL-DOWN ──────────────────────────────────────────────────────
    { id: 213, name: "Catch & Stretch Circle", duration: 5, category: "cooldown", ages: ["U6","U8","U10","U12","U14"], skills: ["Throwing","Recovery"], desc: "Easy catch in a circle with static stretching", intensity: "low", players: "4+", equipment: ["Balls","Gloves"], instructions: "Team forms a large circle.\n1. Easy underhand tosses across the circle\n2. After 2 minutes, hold stretches while tossing\n3. Quads, hamstrings, shoulders, triceps\n4. Coach reviews session highlights and previews next practice", coaching: ["Keep it relaxed. Hold stretches 15-20 seconds. Celebrate effort from today."], variations: "Hot potato game. Trivia questions during stretches." },
    // ── BUNTING ──────────────────────────────────────────────────────────
    { id: 214, name: "Sacrifice Bunt Drill", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Bunting","Bat Control"], desc: "Practice sacrifice bunts to move runners into scoring position", intensity: "low", players: "2+", equipment: ["Balls","Bat","Bases"], instructions: "Batter at the plate, coach pitches.\n1. Square early: pivot feet, slide top hand up the barrel\n2. Angle the bat to bunt toward first or third base line\n3. Deaden the ball — don't push, just catch it with the bat\n4. Practice 5 to each side", coaching: ["Bend your knees to bunt low pitches — don't drop the bat head. Top hand is loose. Eyes on the ball."], variations: "Drag bunt for a base hit. Safety squeeze with runner on third." },
    // ── DOUBLE PLAYS ────────────────────────────────────────────────────
    { id: 215, name: "Double Play Pivot", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Fielding","Footwork","Throwing"], desc: "SS and 2B practice feeds and pivot turns to complete double plays", intensity: "medium", players: "4+", equipment: ["Balls","Gloves","Bases"], instructions: "Coach hits ground balls to SS or 3B.\n1. Fielder scoops and feeds to second base\n2. Pivot man catches, touches the bag, throws to first\n3. Practice both: SS feeding 2B and 2B feeding SS\n4. Focus on quick hands and clean footwork", coaching: ["Feed throw should be chest-high. Pivot man: get to the bag early. Quick release — don't double-clutch."], variations: "Add a runner for timing. Slow rollers that require a range play." },
    // ── CATCHER SKILLS ──────────────────────────────────────────────────
    { id: 216, name: "Catcher Blocking Drill", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Catching","Blocking","Defense"], desc: "Practice blocking balls in the dirt to prevent passed balls", intensity: "medium", players: "1+", equipment: ["Balls","Gloves"], instructions: "Catcher in full gear behind the plate.\n1. Coach throws balls in the dirt: center, left, right\n2. Drop to knees, round the shoulders, glove between legs\n3. Keep the ball in front — don't try to catch dirt balls\n4. 5 blocks each direction", coaching: ["Get your body behind the ball. Chin down, round your back. Glove fills the gap between your legs."], variations: "Add a runner who goes on every block. Rapid-fire blocks." },
    { id: 217, name: "Catcher Pop-Up / Throw-Down", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Catching","Throwing","Footwork"], desc: "Practice throwing out base stealers from behind the plate", intensity: "high", players: "3+", equipment: ["Balls","Gloves","Bases"], instructions: "Catcher receives a pitch, pops up, throws to second.\n1. Receive the ball, transfer quickly to throwing hand\n2. Replace feet: right foot slightly in front of left\n3. Short arm action, throw to the bag\n4. Aim for the shortstop's glove-side of the bag", coaching: ["Quick transfer is more important than arm strength. Get rid of it in under 2 seconds. Footwork first."], variations: "Throw to third base. Pick-off at first." },
    // ── INFIELD SKILLS ──────────────────────────────────────────────────
    { id: 218, name: "Around the Horn", duration: 6, category: "tactical", ages: ["U8","U10","U12","U14"], skills: ["Throwing","Fielding","Teamwork"], desc: "Infielders throw the ball around the bases after a strikeout", intensity: "low", players: "5+", equipment: ["Balls","Gloves","Bases"], instructions: "After a strikeout or between innings:\n1. Catcher throws to third base\n2. Third throws to second\n3. Second throws to shortstop (or first)\n4. Back to the pitcher\n5. Crisp throws, quick transfers", coaching: ["Throw to the chest. Quick catch and release. Hit your target."], variations: "Reverse the order. Add a clock — beat your best time." },
    { id: 219, name: "First Base Footwork", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Fielding","Footwork"], desc: "First baseman practices stretches and receiving throws from all angles", intensity: "medium", players: "2+", equipment: ["Balls","Gloves","Bases"], instructions: "First baseman at the bag, infielders throw from different positions.\n1. Stretch to the ball — catch first, then base\n2. Practice short-hop picks from the dirt\n3. Wide throws: decide to stretch or come off the bag\n4. Backhand picks on throws to the right", coaching: ["Catch the ball first — an out at first doesn't matter if you drop it. Flexible hips. Keep your back foot on the bag."], variations: "Add a runner timing the play. Coach throws wild ones to practice judgment." },
    // ── OUTFIELD SKILLS ─────────────────────────────────────────────────
    { id: 220, name: "Drop Step & Go", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Fielding","Speed","Tracking"], desc: "Outfielders practice the drop step and sprint to catch fly balls over their head", intensity: "high", players: "2+", equipment: ["Balls","Gloves"], instructions: "Outfielder faces the coach 40 feet away.\n1. Coach points left or right\n2. Outfielder drop-steps (opens hips) and sprints in that direction\n3. Coach throws a fly ball over the fielder's shoulder\n4. Catch on the run, don't drift", coaching: ["Open your hips — don't backpedal. Sprint to the spot, then find the ball. Two hands on the catch."], variations: "Add a dive attempt. Hit actual fly balls instead of throwing." },
    { id: 221, name: "Crow-Hop Throwing", duration: 6, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Throwing","Arm Strength"], desc: "Practice the crow-hop technique for strong, accurate outfield throws", intensity: "medium", players: "2+", equipment: ["Balls","Gloves"], instructions: "Partners 60+ feet apart.\n1. Field a ground ball, transfer to throwing hand\n2. Crow-hop: right-left (for righties) skip toward target\n3. Throw on a line — one-hop to the target is fine\n4. Aim chest-high to the cutoff man", coaching: ["Momentum toward the target. Long arm action. Hit the cutoff man, not the base directly."], variations: "Throw to different bases. Add a live fly ball before the throw." },
    // ── BASERUNNING ─────────────────────────────────────────────────────
    { id: 222, name: "Sliding Practice", duration: 6, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Baserunning","Safety"], desc: "Practice proper sliding technique on grass or a sliding mat", intensity: "medium", players: "4+", equipment: ["Bases"], instructions: "Start on grass near a loose base.\n1. Jog in, begin slide 6-8 feet before the base\n2. Feet-first: tuck one leg under, reach with the top leg\n3. Hands up — don't put hands down\n4. Progress from walking speed to running speed", coaching: ["Start your slide early enough. Hands up to avoid jammed fingers. Pop-up slide: use momentum to stand up."], variations: "Head-first slide for older players. Hook slide to avoid a tag." },
    { id: 223, name: "Tag-Up Drill", duration: 6, category: "tactical", ages: ["U10","U12","U14"], skills: ["Baserunning","Awareness"], desc: "Runners practice tagging up on fly balls and reading the catch", intensity: "medium", players: "4+", equipment: ["Balls","Gloves","Bases"], instructions: "Runner on third, outfielder at position.\n1. Coach hits a fly ball to the outfield\n2. Runner tags up: foot on the base until the catch\n3. On the catch, sprint home\n4. Outfielder throws home — catcher applies the tag", coaching: ["Watch the ball into the glove before you go. Explosive first step. Run through home plate."], variations: "Tag-up from second to third. Deep vs. shallow fly ball reads." },
    // ── FUN / YOUNG PLAYER GAMES ────────────────────────────────────────
    { id: 224, name: "Pickle (Rundown)", duration: 8, category: "game", ages: ["U6","U8","U10","U12","U14"], skills: ["Baserunning","Throwing","Fun"], desc: "Classic rundown game — runner caught between two bases", intensity: "high", players: "3+", equipment: ["Balls","Gloves","Bases"], instructions: "Two fielders at adjacent bases, one runner in between.\n1. Runner tries to reach either base safely\n2. Fielders throw back and forth, closing the gap\n3. Run the runner back toward the base they came from\n4. Tag the runner out", coaching: ["Fielders: run at the runner, don't just throw. Get the runner going one direction. Quick tags, no fakes near the face."], variations: "Add a trailing runner. Multiple runners in the pickle." },
    { id: 225, name: "Home Run Derby", duration: 10, category: "game", ages: ["U8","U10","U12","U14"], skills: ["Batting","Fun"], desc: "Each player gets swings to hit as many home runs or long balls as possible", intensity: "medium", players: "4+", equipment: ["Balls","Bat","Bases"], instructions: "Mark a 'home run' line with cones.\n1. Each batter gets 10 swings (5 outs = done)\n2. Balls past the line = home run\n3. Fielders shag and return balls\n4. Highest home run total wins", coaching: ["Swing hard but stay balanced. Hit the ball in the air — drive it. Compete and have fun."], variations: "Use a tee for younger players. Opposite-field bonus points." },
  ],
  Football: [
    // ── WARM-UP ─────────────────────────────────────────────────────────
    { id: 303, name: "Agility Ladder & Cones", duration: 6, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["Agility","Footwork"], desc: "Ladder patterns and cone drills for quick feet and balance", intensity: "medium", players: "1+", equipment: ["Cones","Ladder"], instructions: "Set up a ladder and cone course.\n1. Two feet in each box (forward)\n2. In-out pattern (lateral)\n3. Ickey Shuffle\n4. Finish with a 3-cone shuttle", coaching: ["Quick light steps. Stay on the balls of your feet. Pump your arms."], variations: "Add a ball catch at the end. Race a partner." },
    { id: 304, name: "Dynamic Stretch Circuit", duration: 6, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["Conditioning","Flexibility"], desc: "Movement-based warm-up to prepare for practice", intensity: "low", players: "4+", equipment: ["Cones"], instructions: "Two lines on the sideline.\n1. High knees across the field\n2. Butt kicks back\n3. Karaoke/Carioca\n4. Power skips\n5. Build-up sprints (50%, 75%, 100%)", coaching: ["Full range of motion. Gradually build intensity. Stay loose."], variations: "Add position-specific movements (backpedal for DBs, pulling motion for OL)." },
    // ── PASSING & CATCHING ──────────────────────────────────────────────
    { id: 301, name: "Route Running Tree", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Route Running","Catching"], desc: "Receivers run the full route tree against air", intensity: "medium", players: "2+", equipment: ["Balls","Cones"], instructions: "Set up cones at 5, 10, and 15 yards.\n1. Run each route: slant, out, curl, go, post\n2. QB delivers the ball at the break\n3. Focus on sharp cuts and hands", coaching: ["Sell the route with speed. Snap your head around."], variations: "Add a DB in press coverage. Run option routes." },
    { id: 305, name: "Catch & Throw Progression", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Throwing","Catching"], desc: "QB-WR partner throwing at increasing distances", intensity: "low", players: "2+", equipment: ["Balls"], instructions: "Start 5 yards apart.\n1. Short throws — focus on spiral and catching with hands\n2. Back up to 10 yards — add a step-and-throw\n3. Continue to 20+ yards\n4. Mix in out-routes and comebacks", coaching: ["Grip: fingers on laces. Step toward your target. Catch with your hands, not your body."], variations: "Moving catches. Throw on the run." },
    { id: 306, name: "Hot Hands Catching", duration: 8, category: "technical", ages: ["U8","U10","U12"], skills: ["Catching","Focus"], desc: "Rapid-fire catches to build soft hands and concentration", intensity: "medium", players: "2+", equipment: ["Balls"], instructions: "Player faces coach, 5 yards away.\n1. Coach rapid-fires throws: high, low, left, right\n2. Catch and toss back immediately\n3. 10 catches per round, 3 rounds\n4. Progress to one-handed catches", coaching: ["Eyes on the ball into your hands. Give with the catch. Diamond hands for high, pinky-pinky for low."], variations: "Over-the-shoulder catches. Distraction catches (tennis balls thrown simultaneously)." },
    // ── RUNNING & HANDOFFS ──────────────────────────────────────────────
    { id: 307, name: "Handoff Exchange", duration: 6, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Ball Security","Handoffs"], desc: "Practice clean QB-RB handoff mechanics", intensity: "low", players: "2+", equipment: ["Balls","Cones"], instructions: "QB and RB line up.\n1. QB reverses out, extends the ball\n2. RB creates a pocket (top arm up, bottom arm down)\n3. QB places the ball, RB secures it high and tight\n4. RB hits the hole at speed", coaching: ["QB: firm placement, don't pull away. RB: eyes on the hole, secure the ball."], variations: "Add a pulling guard. Misdirection fakes." },
    { id: 308, name: "Ball Security Gauntlet", duration: 6, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Ball Security","Toughness"], desc: "Runners protect the ball through a gauntlet of defenders", intensity: "medium", players: "5+", equipment: ["Balls","Cones"], instructions: "Runner carries the ball through a 10-yard lane.\n1. 3-4 players on each side try to strip or punch the ball out\n2. Runner covers the ball: high and tight, 5 points of contact\n3. Switch ball to the outside arm near the sideline", coaching: ["5 points: fingertips, palm, forearm, bicep, chest. Switch arms at the sideline."], variations: "Add cuts and jukes through the gauntlet. Flag-pull version for younger players." },
    // ── DEFENSE ──────────────────────────────────────────────────────────
    { id: 309, name: "Flag Pull / Tackling Angles", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Defense","Tackling"], desc: "Practice taking proper angles to the ball carrier", intensity: "high", players: "4+", equipment: ["Cones","Flags"], instructions: "Ball carrier runs across the field.\n1. Defender starts at an angle\n2. Sprint to cut off the runner's path\n3. Pull the flag (or make a form tackle for older players)\n4. Rotate roles", coaching: ["Run to where they're going, not where they are. Break down before contact. Stay low."], variations: "Add a blocker. Open-field 1-on-1." },
    { id: 310, name: "Backpedal & Break", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Defense","Coverage"], desc: "DB technique: backpedal, read, and break on the ball", intensity: "high", players: "2+", equipment: ["Balls","Cones"], instructions: "DB starts 7 yards off a receiver.\n1. Backpedal at the snap\n2. Coach points left or right — DB breaks at 45 degrees\n3. QB throws to that side — DB intercepts or deflects\n4. Progress to live routes", coaching: ["Stay low in your backpedal. Don't turn your hips too early. Drive on the ball when you break."], variations: "Zone coverage reads. Man-to-man press technique." },
    { id: 302, name: "Oklahoma Drill", duration: 8, category: "fitness", ages: ["U12","U14"], skills: ["Blocking","Tackling"], desc: "1-on-1 run-blocking and tackling in a confined space", intensity: "high", players: "3+", equipment: ["Cones","Pads"], instructions: "Set up a narrow lane (3 yards wide).\n1. Blocker vs. defender\n2. Runner behind the blocker\n3. Whistle — blocker engages, runner finds the hole", coaching: ["Low pad level wins. Drive your feet on contact."], variations: "Add a second level defender. Vary the gap." },
    // ── TACTICAL / GAME ─────────────────────────────────────────────────
    { id: 311, name: "7-on-7 Passing Scrimmage", duration: 15, category: "game", ages: ["U10","U12","U14"], skills: ["Offense","Defense","Teamwork"], desc: "No-contact passing game to work on concepts", intensity: "high", players: "14+", equipment: ["Balls","Cones","Flags"], instructions: "7v7 — no offensive or defensive line.\n1. QB has 4 seconds to throw\n2. Defense plays man or zone coverage\n3. Play to the end zone from 40 yards\n4. Rotate possessions every 4 plays", coaching: ["QBs: go through your reads. WRs: run crisp routes. DBs: communicate coverage."], variations: "Red zone only. Two-minute drill." },
    { id: 312, name: "Play Install & Walk-Through", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Offense","Playbook"], desc: "Walk through new plays at half-speed before going live", intensity: "low", players: "5+", equipment: ["Balls","Cones"], instructions: "Teach 2-3 plays per session:\n1. Draw on the board / explain assignments\n2. Walk through at half speed — no defense\n3. Add a scout defense at 75% speed\n4. Run live at full speed", coaching: ["Every player knows their assignment. Repeat until it's automatic. Mental reps count."], variations: "Add audibles at the line. Simulate game situations." },
    { id: 313, name: "Red Zone Offense/Defense", duration: 12, category: "tactical", ages: ["U12","U14"], skills: ["Offense","Defense","Scoring"], desc: "Practice inside the 20-yard line — compressed field", intensity: "high", players: "10+", equipment: ["Balls","Cones","Flags"], instructions: "Start at the 20-yard line.\n1. Offense gets 4 plays to score\n2. Defense tries to get a stop or turnover\n3. Points for TDs, field position, turnovers\n4. Rotate groups", coaching: ["Offense: the field is compressed — quick passes and designed runs. Defense: play tight — less space to cover."], variations: "Goal-line package (inside the 5). Two-point conversion drills." },
    // ── COOL-DOWN ──────────────────────────────────────────────────────
    { id: 314, name: "Catch Circle & Stretch", duration: 5, category: "cooldown", ages: ["U8","U10","U12","U14"], skills: ["Catching","Recovery"], desc: "Easy throws in a circle while stretching and reviewing", intensity: "low", players: "4+", equipment: ["Balls"], instructions: "Team in a large circle.\n1. Easy throws across the circle — focus on spirals\n2. Static stretches: quads, hamstrings, hip flexors, shoulders\n3. Coach reviews what went well and previews next practice\n4. Team break on three", coaching: ["Keep it fun and light. Hold stretches 15-20 seconds. Celebrate effort."], variations: "QB accuracy contest. Trivia review of playbook." },
    // ── QB FOOTWORK & MECHANICS ────────────────────────────────────────
    { id: 315, name: "QB Drop-Back Footwork", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Throwing","Footwork"], desc: "Practice 3-step, 5-step, and 7-step drop-backs with proper mechanics", intensity: "medium", players: "1+", equipment: ["Balls","Cones"], instructions: "QB at the line of scrimmage.\n1. 3-step drop: quick hitch, set feet, throw\n2. 5-step drop: deeper drop, hitch step, throw\n3. 7-step drop: full drop, multiple hitches\n4. Focus on consistent depth and balance at the top", coaching: ["Push off the front foot. Get to your spot quickly. Set your feet before you throw. Eyes downfield the whole time."], variations: "Add a rolling pocket. Throw to a moving target after the drop." },
    { id: 316, name: "Scramble Drill", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Throwing","Decision Making"], desc: "QB escapes the pocket and finds open receivers while on the move", intensity: "high", players: "5+", equipment: ["Balls","Cones"], instructions: "Set up a pocket with cones. 3 receivers run routes.\n1. Coach blows whistle — pocket collapses\n2. QB escapes left or right\n3. Receivers break structure, find open space\n4. QB throws on the move or tucks and runs", coaching: ["Eyes downfield even when you're running. Throw off-platform if needed. Receivers: keep working to get open."], variations: "Add a live rusher. Time limit: must throw or run within 4 seconds." },
    // ── OFFENSIVE LINE ─────────────────────────────────────────────────
    { id: 317, name: "OL Pass Protection Steps", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Blocking","Footwork"], desc: "Offensive linemen practice kick steps and hand placement for pass blocking", intensity: "medium", players: "2+", equipment: ["Cones","Pads"], instructions: "OL in stance, coach or DL across.\n1. Kick step: 45-degree step back with outside foot\n2. Mirror the rusher — don't lunge\n3. Hands inside: punch and reset\n4. Anchor: absorb the bull rush with bent knees", coaching: ["Stay balanced — weight on the balls of your feet. Hands inside the shoulders. Don't reach — let them come to you."], variations: "Add stunts and twists. Two-man combinations." },
    { id: 318, name: "Drive Block (Run Blocking)", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Blocking","Power"], desc: "Practice run-blocking fundamentals: engage and drive the defender", intensity: "high", players: "2+", equipment: ["Cones","Pads"], instructions: "OL vs. DL in a 5-yard lane.\n1. Fire off the ball: first step is a 6-inch power step\n2. Hands strike inside the chest plate\n3. Drive legs: choppy steps, wide base\n4. Sustain the block for 3 seconds", coaching: ["Low man wins. Strike and drive — don't stop your feet. Finish through the whistle."], variations: "Add a running back hitting the hole. Double-team combinations." },
    // ── RECEIVER SKILLS ────────────────────────────────────────────────
    { id: 319, name: "Jump Ball / High-Point Catching", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["Catching","Vertical"], desc: "Receivers practice catching contested passes at the highest point", intensity: "medium", players: "2+", equipment: ["Balls"], instructions: "QB throws high, underthrown, and back-shoulder passes.\n1. Receiver tracks the ball and jumps to catch at the peak\n2. Secure with hands — don't body-catch\n3. Land with both feet inbounds (if near sideline)\n4. Add a DB for contested catches", coaching: ["Track the ball over your shoulder. Catch at the highest point. Strong hands through contact."], variations: "Fade routes to the corner. Red zone jump balls." },
    { id: 320, name: "Slant & Quick Game", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Route Running","Catching"], desc: "Rapid-fire slant, hitch, and bubble routes for quick timing", intensity: "medium", players: "3+", equipment: ["Balls","Cones"], instructions: "Receivers line up wide.\n1. Slant: 3 steps, break inside at 45 degrees\n2. Hitch: 5 steps, plant and come back to the QB\n3. Bubble: take a step back and catch the lateral toss\n4. QB delivers on the break — timing is everything", coaching: ["Sharp breaks — no rounding off. Catch and turn upfield immediately. QB: throw it before the break."], variations: "Add a DB in press coverage. Choice routes based on coverage." },
    // ── DEFENSIVE SKILLS ───────────────────────────────────────────────
    { id: 321, name: "Linebacker Read & React", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Defense","Diagnosis"], desc: "LBs read run vs. pass keys and flow to the correct gap", intensity: "high", players: "3+", equipment: ["Cones","Balls"], instructions: "LB in ready position, coach simulates keys.\n1. Run key (QB hands off): LB fills the gap\n2. Pass key (QB drops back): LB drops into zone\n3. Play-action: LB reads through the mesh, doesn't bite\n4. Rotate through all 3 reads", coaching: ["Read your key (guard or tackle). Don't guess — react. Stay in your gap. Keep your shoulders square."], variations: "Add a live RB and QB. Zone vs. man drops." },
    { id: 322, name: "Pursuit Angles", duration: 6, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Defense","Speed"], desc: "Practice taking correct pursuit angles to the ball carrier", intensity: "high", players: "5+", equipment: ["Cones","Balls"], instructions: "Ball carrier runs across the field on a diagonal.\n1. Defenders start at various positions\n2. Sprint to cut off the runner — don't chase from behind\n3. Take the angle that arrives at the runner, not where they were\n4. Break down and make the flag pull/tackle", coaching: ["Run to where they're going, not where they are. Don't overpursue. Break down with choppy steps before contact."], variations: "Add blockers to navigate around. Multiple ball carriers." },
    { id: 323, name: "Zone Coverage Drill", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Defense","Coverage"], desc: "DBs and LBs practice zone drops and pattern reading", intensity: "medium", players: "7+", equipment: ["Balls","Cones"], instructions: "Set up Cover 2 or Cover 3 zones with cones.\n1. Defenders drop to their zone on the snap\n2. Eyes on the QB — read his throwing motion\n3. Break on the ball when it's thrown\n4. Communicate: 'I got deep!' 'Curl to flat!'", coaching: ["Eyes on the QB, not the receiver. Zone defenders play the ball, not the man. Talk to each other — no quiet zones."], variations: "Cover 2 vs. Cover 3 rotations. Add route combinations to read." },
    // ── SPECIAL TEAMS ──────────────────────────────────────────────────
    { id: 324, name: "Punt Return & Fair Catch", duration: 8, category: "tactical", ages: ["U10","U12","U14"], skills: ["Special Teams","Catching"], desc: "Practice fielding punts and making fair catch decisions", intensity: "medium", players: "4+", equipment: ["Balls","Cones"], instructions: "Returner stands at the 20-yard line.\n1. Coach punts or throws high arcing balls\n2. Returner decides: catch and return, or fair catch\n3. Signal fair catch by waving one arm overhead\n4. If returning: catch, tuck, and find the lane", coaching: ["Never let a punt bounce — catch it or let it go over your head. Fair catch when defenders are close. Secure the ball first."], variations: "Add a return wall for blocking. Live punt coverage." },
    // ── FLAG FOOTBALL / YOUNG PLAYERS ──────────────────────────────────
    { id: 325, name: "Capture the Football", duration: 8, category: "game", ages: ["U6","U8","U10"], skills: ["Speed","Fun","Teamwork"], desc: "Capture-the-flag style game with footballs — great for young players", intensity: "high", players: "8+", equipment: ["Balls","Cones","Flags"], instructions: "Two teams, each with a football on their end line.\n1. Try to grab the other team's football and bring it back\n2. If your flag is pulled in enemy territory, you're frozen\n3. A teammate can unfreeze you with a high-five\n4. First team to capture the ball wins", coaching: ["Use teamwork — create distractions. Speed and misdirection win. Have fun!"], variations: "Add a passing element — must complete a pass to unfreeze." },
    { id: 326, name: "Cone Knockdown (QB Accuracy)", duration: 6, category: "game", ages: ["U6","U8","U10","U12"], skills: ["Throwing","Accuracy","Fun"], desc: "QBs throw to knock down cones or targets at different distances", intensity: "low", players: "2+", equipment: ["Balls","Cones"], instructions: "Set up cones at 5, 10, 15, 20 yards.\n1. Each player gets 3 throws at each distance\n2. Knock a cone down = points (farther = more points)\n3. Highest score wins\n4. Must use proper throwing form", coaching: ["Step toward your target. Follow through. Accuracy beats arm strength."], variations: "Moving targets. Throw on the run. Left-handed round." },
    { id: 327, name: "Four-Corner Agility", duration: 6, category: "warmup", ages: ["U6","U8","U10","U12","U14"], skills: ["Agility","Speed"], desc: "Sprint, shuffle, backpedal, and sprint through a four-cone square", intensity: "high", players: "1+", equipment: ["Cones"], instructions: "Set up a 10x10 yard square with cones.\n1. Sprint forward to cone 2\n2. Shuffle right to cone 3\n3. Backpedal to cone 4\n4. Sprint diagonally back to cone 1\nTime each run, beat your best", coaching: ["Stay low on the shuffle. Quick feet on the backpedal. Explode on the sprint."], variations: "Add a ball catch at each corner. Race a partner." },
    // ── TWO-MINUTE DRILL ───────────────────────────────────────────────
    { id: 328, name: "Two-Minute Drill", duration: 10, category: "game", ages: ["U10","U12","U14"], skills: ["Offense","Clock Management"], desc: "Simulated end-of-half/game situation with a running clock", intensity: "high", players: "10+", equipment: ["Balls","Cones","Flags"], instructions: "Offense starts at the 40-yard line, 2 minutes on the clock.\n1. No huddle — QB calls plays at the line\n2. Manage timeouts (3 total)\n3. Spike the ball to stop the clock if needed\n4. Score before time runs out", coaching: ["Know when to go out of bounds. Communicate quickly. Stay calm under pressure. Clock awareness."], variations: "Vary starting field position. Down by different scores." },
  ],
};

// Default data (used for first-time initialization)
const defaultPracticePlans = [
  { id: 1, title: "U10 Passing & Movement Session", duration: 60, age: "U10", date: "4/10/2026", status: "complete", drills: 5, focus: ["Passing","Possession"] },
  { id: 2, title: "U12 Defensive Shape Training", duration: 75, age: "U12", date: "4/8/2026", status: "complete", drills: 6, focus: ["Defending","Positioning"] },
  { id: 3, title: "U8 Fun & Fundamentals", duration: 45, age: "U8", date: "4/6/2026", status: "draft", drills: 5, focus: ["Dribbling","Fun"] },
  { id: 4, title: "U14 Tactical Transitions", duration: 90, age: "U14", date: "4/5/2026", status: "draft", drills: 5, focus: ["Transition","Decision Making"] },
];

const defaultTeamsData = [
  { id: "t1", name: "Lightning U10", age: "U10", season: "Spring 2026", players: [
    { name: "Aiden Martinez", number: 7, position: "CM" },
    { name: "Liam Johnson", number: 10, position: "ST" },
    { name: "Emma Wilson", number: 3, position: "CB" },
    { name: "Sophia Brown", number: 1, position: "GK" },
    { name: "Noah Davis", number: 8, position: "RW" },
    { name: "Olivia Garcia", number: 5, position: "LB" },
  ]},
];

const defaultHistoryData = [
  { id: "h1", date: "4/10/2026", team: "Lightning U10", plan: "Passing & Movement", duration: 58, attendance: 11, total: 12, rating: 4, notes: "Great energy. Players really clicked with the rondo warm-up." },
  { id: "h2", date: "4/8/2026", team: "Lightning U10", plan: "Defensive Shape", duration: 72, attendance: 10, total: 12, rating: 3, notes: "Good session overall, some younger players struggled with shape concept." },
  { id: "h3", date: "4/5/2026", team: "Lightning U10", plan: "Dribbling Fundamentals", duration: 55, attendance: 12, total: 12, rating: 5, notes: "Best session of the season. 1v1 moves drill was a huge hit." },
];

// ═══════════════════════════════════════════════════════════════════════════
// PLAN GENERATION ENGINE (sport-agnostic)
// ═══════════════════════════════════════════════════════════════════════════

// Normalize a drill from any sport into a common format for the engine
function normalizeDrill(d) {
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

function generatePlan(config, sport = "Soccer") {
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

  const usedIds = new Set();
  const pick = (phase, preferred) => {
    let pool = available.filter(d => d.phase === phase && !usedIds.has(d.id));
    if (pool.length === 0) pool = available.filter(d => !usedIds.has(d.id)); // fallback: any unused drill
    if (pool.length === 0) pool = available.filter(d => d.phase === phase); // last resort: allow repeats
    if (preferred.length > 0) {
      const scored = pool.map(d => ({
        ...d, score: d.focus.filter(f => preferred.includes(f)).length,
      }));
      scored.sort((a, b) => b.score - a.score);
      pool = scored;
    }
    const top = pool.slice(0, Math.max(3, pool.length));
    const selected = top[Math.floor(Math.random() * top.length)] || pool[0];
    if (selected) usedIds.add(selected.id);
    return selected;
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
function getDrillPool(sport) {
  if (sport === "Soccer") return soccerDrillsFull.map(normalizeDrill);
  return (drillsBySport[sport] || []).map(normalizeDrill);
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED STYLES & COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════
const cardStyle = {
  background: c.white, borderRadius: 16, border: `1px solid ${c.slate200}`,
  overflow: "hidden", transition: "box-shadow 0.2s, transform 0.15s", cursor: "pointer",
};
const badgeBase = {
  display: "inline-flex", alignItems: "center", padding: "3px 10px",
  borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 0.2,
};
const categoryColors = {
  technical: { bg: "#dbeafe", color: "#1d4ed8" },
  tactical: { bg: "#fef3c7", color: "#b45309" },
  warmup: { bg: "#d1fae5", color: "#047857" },
  fitness: { bg: "#fce7f3", color: "#be185d" },
};

function MiniField({ seed, sport }) {
  const fieldColor = sportConfig[sport]?.fieldColor || c.green600;
  const isBasketball = sport === "Basketball";
  const isBaseball = sport === "Baseball";
  const dots = Array.from({ length: 6 }, (_, i) => ({
    cx: 20 + (((typeof seed === 'string' ? seed.charCodeAt(0) * 37 : seed * 37) + i * 53) % 100),
    cy: 15 + (((typeof seed === 'string' ? seed.charCodeAt(0) * 23 : seed * 23) + i * 41) % 60),
    team: i < 3 ? (isBasketball ? "#1d4ed8" : c.green600) : c.rose500,
  }));
  return (
    <svg viewBox="0 0 140 90" style={{ width: "100%", height: 100, borderRadius: 12, background: fieldColor }}>
      {isBasketball ? (<>
        <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <line x1="70" y1="2" x2="70" y2="88" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <circle cx="70" cy="45" r="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      </>) : isBaseball ? (<>
        <polygon points="70,75 30,40 70,5 110,40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <circle cx="70" cy="45" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </>) : (<>
        <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="70" y1="2" x2="70" y2="88" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="70" cy="45" r="14" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
      </>)}
      {dots.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r="5" fill={d.team} stroke="white" strokeWidth="1.5" />)}
    </svg>
  );
}

function PageHero({ title, subtitle, actions, gradient }) {
  return (
    <div style={{ background: gradient || `linear-gradient(135deg, ${c.green800} 0%, ${c.green600} 100%)`, borderRadius: 20, padding: "36px 40px", color: c.white, position: "relative", overflow: "hidden", marginBottom: 28 }}>
      <div style={{ position: "absolute", top: -40, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, position: "relative" }}>{title}</h1>
      <p style={{ fontSize: 15, opacity: 0.85, marginBottom: actions ? 20 : 0, maxWidth: 520, lineHeight: 1.5, position: "relative" }}>{subtitle}</p>
      {actions && <div style={{ display: "flex", gap: 10, position: "relative" }}>{actions}</div>}
    </div>
  );
}

function HeroBtn({ label, primary, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "10px 20px", borderRadius: 10, border: primary ? "none" : "1.5px solid rgba(255,255,255,0.4)",
      background: primary ? c.white : "rgba(255,255,255,0.1)", color: primary ? c.green700 : c.white,
      fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
    }}>{Icon && <Icon size={16} />}{label}</button>
  );
}

function HoverCard({ children, style, onClick }) {
  return (
    <div onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } } : undefined} style={{ ...cardStyle, ...style }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >{children}</div>
  );
}

function Stars({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map(i => <Star key={i} size={size} fill={i <= rating ? c.amber400 : "none"} color={i <= rating ? c.amber400 : c.slate300} />)}
    </div>
  );
}

function Breadcrumb({ items }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 13, color: c.slate500 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i > 0 && <span>/</span>}
          {item.onClick ? <span onClick={item.onClick} style={{ color: c.green600, cursor: "pointer", fontWeight: 500 }}>{item.label}</span>
            : <span style={{ color: c.slate600, fontWeight: 500 }}>{item.label}</span>}
        </span>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════
function Sidebar({ page, setPage, sport, setSport, sportOpen, setSportOpen, isMobile, sidebarOpen, setSidebarOpen }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "generate", label: "Generate Plan", icon: Sparkles },
    { key: "plans", label: "Plans", icon: ClipboardList },
    { key: "drills", label: "Drills", icon: Zap },
    { key: "teams", label: "Teams", icon: Users },
    { key: "history", label: "History", icon: Clock },
    { key: "pricing", label: "Pricing", icon: Star },
  ];

  const sidebarWidth = isMobile && !sidebarOpen ? 0 : 240;

  return (
    <aside style={{
      width: isMobile ? (sidebarOpen ? 240 : 0) : 240,
      minHeight: "100vh",
      background: c.white,
      borderRight: `1px solid ${c.slate200}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 1000,
      transition: isMobile ? "width 0.3s ease, box-shadow 0.3s ease" : "none",
      boxShadow: isMobile && sidebarOpen ? "2px 0 12px rgba(0,0,0,0.15)" : "none",
      overflow: "hidden"
    }}>
      <div style={{ padding: "0 20px", marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16 }}>W</div>
        <span style={{ fontSize: 20, fontWeight: 700, color: c.slate800, letterSpacing: -0.5 }}>Whistle</span>
      </div>

      <div style={{ padding: "0 16px", marginBottom: 24, position: "relative" }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, display: "block", paddingLeft: 4 }}>Sport</label>
        <button onClick={e => { e.stopPropagation(); setSportOpen(!sportOpen); }}
          aria-expanded={sportOpen} aria-haspopup="listbox" aria-label={`Select sport, current: ${sport}`}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.slate50, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: c.slate700 }}>
          <span style={{ fontSize: 18 }}>{sportConfig[sport].emoji}</span>{sport}
          <ChevronDown size={14} style={{ marginLeft: "auto", color: c.slate400, transition: "transform 0.2s", transform: sportOpen ? "rotate(180deg)" : "none" }} />
        </button>
        {sportOpen && (
          <div role="listbox" aria-label="Sport selection" style={{ position: "absolute", top: "100%", left: 16, right: 16, marginTop: 4, background: c.white, borderRadius: 12, border: `1px solid ${c.slate200}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden" }}>
            {Object.keys(sportConfig).map(s => (
              <button key={s} role="option" aria-selected={s === sport} onClick={e => { e.stopPropagation(); setSport(s); setSportOpen(false); }}
                style={{ width: "100%", padding: "10px 14px", border: "none", background: s === sport ? c.green50 : "transparent", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: s === sport ? 600 : 400, color: s === sport ? c.green700 : c.slate600 }}>
                <span style={{ fontSize: 16 }}>{sportConfig[s].emoji}</span>{s}
                {s === sport && <CheckCircle2 size={14} style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav aria-label="Main navigation" style={{ flex: 1, padding: "0 10px" }}>
        {navItems.map(item => {
          const active = page === item.key || (page === "drill-detail" && item.key === "drills") || (page === "team-detail" && item.key === "teams") || (page === "plan-result" && item.key === "generate");
          const Icon = item.icon;
          const isGenerate = item.key === "generate";
          return (
            <button key={item.key} onClick={() => setPage(item.key)}
              aria-current={active ? "page" : undefined}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                border: isGenerate && !active ? `1.5px solid ${c.green500}` : "none",
                background: active ? c.green600 : isGenerate ? c.green50 : "transparent",
                color: active ? c.white : isGenerate ? c.green700 : c.slate500,
                display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                fontSize: 14, fontWeight: isGenerate || active ? 600 : 500, marginBottom: 2, transition: "all 0.15s",
              }}>
              <Icon size={18} />{item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: `1px solid ${c.slate100}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.green100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.green700 }}>DC</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.slate700 }}>Daniel</div>
          <div style={{ fontSize: 11, color: c.slate500 }}>Pro Plan</div>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════════

// ─── Dashboard ──────────────────────────────────────────────────────────
function DashboardPage({ sport, setPage }) {
  const isMobile = useIsMobile();
  const cfg = sportConfig[sport];
  const drills = drillsBySport[sport] || [];
  const [teamsData] = useLocalStorage("teams", defaultTeamsData);
  const [practicePlans] = useLocalStorage("practicePlans", defaultPracticePlans);
  const statCards = [
    { label: "Generate Plan", value: "New", icon: Sparkles, gradient: `linear-gradient(135deg, ${c.green600}, ${c.emerald600})`, onClick: () => setPage("generate") },
    { label: "Drill Library", value: String(drills.length), icon: Zap, gradient: `linear-gradient(135deg, ${c.blue500}, #6366f1)`, onClick: () => setPage("drills") },
    { label: "My Teams", value: String(teamsData.length), icon: Users, gradient: `linear-gradient(135deg, ${c.purple500}, #a855f7)`, onClick: () => setPage("teams") },
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
            <div key={i} onClick={card.onClick} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.onClick?.(); } }} style={{ ...cardStyle, background: card.gradient, color: c.white, padding: "22px 20px", border: "none" }}
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
            <div key={plan.id} onClick={() => setPage("plans")} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPage("plans"); } }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, background: c.slate50, transition: "background 0.15s", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = c.green50}
              onMouseLeave={e => e.currentTarget.style.background = c.slate50}>
              {plan.status === "complete" ? <CheckCircle2 size={20} color={c.green500} /> : <Circle size={20} color={c.slate300} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.slate700 }}>{plan.title}</div>
                <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{plan.date} \u00b7 {plan.drills} drills</div>
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

// ─── GENERATE PLAN PAGE (CoachPlan wizard integrated into Whistle shell) ─
function GeneratePlanPage({ sport, setPage, onPlanGenerated }) {
  const [step, setStep] = useState(0);
  const [teamsData] = useLocalStorage("teams", defaultTeamsData);
  const [config, setConfig] = useState({
    ageGroup: "", playerCount: 12, duration: 60,
    equipment: (EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).slice(0, 2), focusAreas: [],
  });

  // Reset equipment & focus when sport changes
  const prevSport = useRef(sport);
  useEffect(() => {
    if (prevSport.current !== sport) {
      prevSport.current = sport;
      setConfig(prev => ({
        ...prev,
        equipment: (EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).slice(0, 2),
        focusAreas: [],
      }));
      setStep(0);
    }
  }, [sport]);

  const canProceed = () => {
    if (step === 0) return config.ageGroup && config.playerCount;
    if (step === 1) return config.duration && config.equipment.length > 0;
    if (step === 2) return config.focusAreas.length > 0;
    return true;
  };

  const handleGenerate = () => {
    const plan = generatePlan(config, sport);
    onPlanGenerated(plan, config);
  };

  const stepLabels = ["Team Info", "Session Setup", "Focus Areas"];
  const cfg = sportConfig[sport];

  const selectCard = (selected) => ({
    padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s ease",
    border: `2px solid ${selected ? c.green500 : c.slate200}`,
    background: selected ? c.green50 : c.white,
  });

  return (
    <div>
      <PageHero gradient={cfg.heroGradient}
        title={`${cfg.emoji} Generate Training Plan`}
        subtitle="Create an age-appropriate, phase-structured practice plan in seconds"
      />

      {/* Sport drill count indicator */}
      {sport !== "Soccer" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16 }}>
          <Info size={18} color="#16a34a" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5, margin: 0 }}>
            <strong>{sport}</strong> plan generation is live with {(drillsBySport[sport] || []).length} drills across all phases.
          </p>
        </div>
      )}

      {/* Step Indicator */}
      <div style={{ ...cardStyle, padding: "20px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 600, transition: "all 0.3s",
                  background: i <= step ? c.green500 : "transparent",
                  color: i <= step ? c.white : c.slate400,
                  border: `2px solid ${i <= step ? c.green500 : c.slate300}`,
                }}>{i < step ? "\u2713" : i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: i === step ? 600 : 400, color: i <= step ? c.slate800 : c.slate400 }}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div style={{ width: 40, height: 2, background: i < step ? c.green500 : c.slate200, transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: "32px 36px", cursor: "default" }}>
        {/* Step 0: Team Info */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Team Info</h2>
            <p style={{ color: c.slate500, marginBottom: 24, fontSize: 14 }}>Tell us about your team</p>

            {/* Quick-pick from existing teams */}
            {teamsData.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Quick Select a Team</label>
                <div style={{ display: "flex", gap: 10, margin: "10px 0 0 0" }}>
                  {teamsData.map(team => {
                    const teamAge = AGE_GROUPS.find(ag => ag.value === team.age);
                    const isSelected = config.ageGroup === team.age && config.playerCount === team.players.length;
                    return (
                      <div key={team.id} onClick={() => setConfig(prev => ({ ...prev, ageGroup: team.age, playerCount: team.players.length }))} {...clickableProps(() => setConfig(prev => ({ ...prev, ageGroup: team.age, playerCount: team.players.length })))}
                        style={{
                          ...selectCard(isSelected), flex: 1, padding: "16px 20px",
                          background: isSelected ? `linear-gradient(135deg, ${c.green50}, ${c.green100})` : c.white,
                          border: isSelected ? `2px solid ${c.green500}` : `2px solid ${c.slate200}`,
                        }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: isSelected ? c.green500 : c.green100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: isSelected ? c.white : c.green700, transition: "all 0.2s" }}>{team.age}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: c.slate800, fontSize: 15 }}>{team.name}</div>
                            <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{team.players.length} players \u00b7 {team.season}</div>
                          </div>
                          {isSelected && <CheckCircle2 size={18} color={c.green500} style={{ marginLeft: "auto" }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: c.slate200 }} />
              <span style={{ fontSize: 12, color: c.slate500, fontWeight: 500 }}>or configure manually</span>
              <div style={{ flex: 1, height: 1, background: c.slate200 }} />
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Age Group</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "10px 0 24px 0" }}>
              {AGE_GROUPS.map(ag => (
                <div key={ag.value} onClick={() => setConfig(prev => ({ ...prev, ageGroup: ag.value }))} {...clickableProps(() => setConfig(prev => ({ ...prev, ageGroup: ag.value })))} style={selectCard(config.ageGroup === ag.value)}>
                  <div style={{ fontWeight: 600, color: c.slate800, fontSize: 15 }}>{ag.label}</div>
                  <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{ag.philosophy}</div>
                </div>
              ))}
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Number of Players</label>
            <div style={{ display: "flex", gap: 8, margin: "10px 0 0 0", flexWrap: "wrap" }}>
              {[8, 10, 12, 14, 16, 18, 20, 22].map(n => (
                <div key={n} onClick={() => setConfig(prev => ({ ...prev, playerCount: n }))} {...clickableProps(() => setConfig(prev => ({ ...prev, playerCount: n })))}
                  style={{ ...selectCard(config.playerCount === n), minWidth: 56, textAlign: "center" }}>
                  <span style={{ fontWeight: 700, color: c.slate800, fontSize: 16 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Session Setup */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Session Setup</h2>
            <p style={{ color: c.slate500, marginBottom: 24, fontSize: 14 }}>Configure your training session</p>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Duration (minutes)</label>
            <div style={{ display: "flex", gap: 10, margin: "10px 0 24px 0" }}>
              {DURATION_OPTIONS.map(d => (
                <div key={d} onClick={() => setConfig(prev => ({ ...prev, duration: d }))} {...clickableProps(() => setConfig(prev => ({ ...prev, duration: d })))}
                  style={{ ...selectCard(config.duration === d), flex: 1, textAlign: "center", padding: "18px 16px" }}>
                  <span style={{ fontWeight: 700, fontSize: 24, color: c.slate800 }}>{d}</span>
                  <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>min</div>
                </div>
              ))}
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 1 }}>Available Equipment</label>
            <div style={{ display: "flex", gap: 8, margin: "10px 0 0 0", flexWrap: "wrap" }}>
              {(EQUIPMENT_BY_SPORT[sport] || EQUIPMENT_BY_SPORT.Soccer).map(e => {
                const selected = config.equipment.includes(e);
                return (
                  <div key={e} onClick={() => setConfig(prev => ({ ...prev, equipment: selected ? prev.equipment.filter(x => x !== e) : [...prev.equipment, e] }))} {...clickableProps(() => setConfig(prev => ({ ...prev, equipment: selected ? prev.equipment.filter(x => x !== e) : [...prev.equipment, e] })))}
                    style={{ ...selectCard(selected), textTransform: "capitalize", textAlign: "center", minWidth: 80, padding: "12px 18px" }}>
                    <span style={{ fontWeight: 600, color: c.slate800 }}>{e}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Focus Areas */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Session Focus</h2>
            <p style={{ color: c.slate500, marginBottom: 24, fontSize: 14 }}>Pick 1-3 areas to focus on</p>
            <p style={{ fontSize: 12, color: c.slate500, marginBottom: 16 }}>{config.focusAreas.length}/3 selected</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 10 }}>
              {(FOCUS_OPTIONS_BY_SPORT[sport] || FOCUS_OPTIONS_BY_SPORT.Soccer).map(f => {
                const selected = config.focusAreas.includes(f.value);
                const atMax = config.focusAreas.length >= 3 && !selected;
                return (
                  <div key={f.value} onClick={() => {
                    if (atMax) return;
                    setConfig(prev => ({ ...prev, focusAreas: selected ? prev.focusAreas.filter(x => x !== f.value) : [...prev.focusAreas, f.value] }));
                  }} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!atMax) setConfig(prev => ({ ...prev, focusAreas: selected ? prev.focusAreas.filter(x => x !== f.value) : [...prev.focusAreas, f.value] })); } }}
                    style={{ ...selectCard(selected), opacity: atMax ? 0.4 : 1, textAlign: "center", padding: "18px 10px" }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{f.icon}</div>
                    <div style={{ fontWeight: 600, color: c.slate800, fontSize: 13 }}>{f.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 32, justifyContent: "flex-end" }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              padding: "12px 24px", borderRadius: 12, border: `1px solid ${c.slate200}`,
              background: c.white, color: c.slate600, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}><ChevronLeft size={16} /> Back</button>
          )}
          <button onClick={() => step === 2 ? handleGenerate() : setStep(s => s + 1)}
            disabled={!canProceed()}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              background: canProceed() ? `linear-gradient(135deg, ${c.green500}, ${c.emerald600})` : c.slate200,
              color: canProceed() ? c.white : c.slate400,
              fontWeight: 600, fontSize: 14, cursor: canProceed() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}>
            {step === 2 ? <><Sparkles size={16} /> Generate Plan</> : <>Continue <ChevronRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── KEYBOARD A11Y HELPER (makes clickable divs keyboard-accessible)
function clickableProps(onClick) {
  if (!onClick) return {};
  return { role: "button", tabIndex: 0, onKeyDown: e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); } } };
}

// ─── HTML ESCAPE UTILITY (XSS prevention for document.write contexts)
function escapeHTML(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ─── EXPORT & PRINT HANDLERS
function generatePlanTextSummary(plan, config, sport, ageInfo) {
  let summary = `${sport} Training Plan\n${ageInfo?.label || config.ageGroup} • ${config.playerCount} players • ${plan.reduce((sum, p) => sum + p.phaseDuration, 0)} minutes\n`;
  if (config.focusAreas.length > 0) summary += `Focus: ${config.focusAreas.join(", ")}\n`;
  summary += `\n${"─".repeat(60)}\n\n`;
  plan.forEach((drill, idx) => {
    let runningTime = 0;
    for (let j = 0; j < idx; j++) runningTime += plan[j].phaseDuration;
    summary += `${drill.phaseLabel.toUpperCase()} (${runningTime}'–${runningTime + drill.phaseDuration}')\nDrill: ${drill.name}\nDuration: ${drill.phaseDuration} min\n\nDescription:\n${drill.description}\n`;
    if (drill.coaching?.length > 0) summary += `\nCoaching Points:\n${drill.coaching.map(p => `• ${p}`).join("\n")}\n`;
    if (drill.equipment?.length > 0) summary += `Equipment: ${drill.equipment.join(", ")}\n`;
    if (drill.players) summary += `Players: ${drill.players[0]}–${drill.players[1]}\n`;
    summary += `\n${"─".repeat(60)}\n\n`;
  });
  return summary;
}
function generatePrintHTML(plan, config, sport, ageInfo) {
  const totalTime = plan.reduce((sum, p) => sum + p.phaseDuration, 0);
  const phaseLabels = { "Warm-Up": "warmup", "Technical": "technical", "Tactical": "tactical", "Game": "game", "Cool-Down": "cooldown" };
  const phaseColorMap = { warmup: "#f59e0b", technical: "#3b82f6", tactical: "#8b5cf6", game: "#22c55e", cooldown: "#06b6d4" };
  const safeSport = escapeHTML(sport);
  const safeAge = escapeHTML(ageInfo?.label || config.ageGroup);
  const safePlayerCount = escapeHTML(config.playerCount);
  const safeFocus = config.focusAreas.map(f => escapeHTML(f)).join(", ");
  const safePhilosophy = escapeHTML(ageInfo?.philosophy);
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${safeSport} Training Plan</title><style>body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 20px; background: white; } .plan-container { max-width: 850px; margin: 0 auto; } .plan-header { margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; } .plan-header h1 { font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a; } .plan-header p { margin: 4px 0; font-size: 14px; color: #475569; } .phase-bar { display: flex; border-radius: 6px; overflow: hidden; height: 12px; margin: 16px 0; background: #f1f5f9; } .drill-card { margin-bottom: 24px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; page-break-inside: avoid; } .drill-header { display: flex; align-items: center; margin-bottom: 14px; gap: 12px; } .drill-time-badge { width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; } .drill-title { flex: 1; } .drill-phase { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; } .drill-name { font-size: 18px; font-weight: 600; color: #1e293b; margin: 0; } .drill-description { color: #475569; font-size: 14px; line-height: 1.6; margin: 12px 0; } .coaching-points { margin: 12px 0; } .coaching-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; } .coaching-list { list-style: none; padding: 0; margin: 0; } .coaching-list li { font-size: 13px; color: #334155; margin-bottom: 6px; padding-left: 16px; position: relative; } .coaching-list li:before { content: "•"; position: absolute; left: 0; } .drill-details { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; font-size: 12px; } .detail-badge { padding: 6px 12px; background: #f1f5f9; border-radius: 6px; color: #475569; } @media print { body { margin: 0; padding: 0; } .drill-card { page-break-inside: avoid; break-inside: avoid; } @page { margin: 0.5in; } }</style></head><body><div class="plan-container"><div class="plan-header"><h1>${safeSport} Training Plan</h1><p><strong>${safeAge}</strong> • ${safePlayerCount} players • ${totalTime} minutes</p>${config.focusAreas.length > 0 ? `<p><strong>Focus:</strong> ${safeFocus}</p>` : ""}${ageInfo?.philosophy ? `<p style="font-style: italic; color: #16a34a; margin-top: 8px;">${safePhilosophy}</p>` : ""}<div class="phase-bar">${plan.map(p => { const phaseKey = phaseLabels[p.phaseLabel]; const color = phaseColorMap[phaseKey] || "#22c55e"; return `<div style="flex: ${p.phaseDuration}; background: ${color};"></div>`; }).join("")}</div></div>${plan.map((drill, idx) => { const phaseKey = phaseLabels[drill.phaseLabel]; const color = phaseColorMap[phaseKey] || "#22c55e"; let runningTime = 0; for (let j = 0; j < idx; j++) runningTime += plan[j].phaseDuration; return `<div class="drill-card"><div class="drill-header"><div class="drill-time-badge" style="background: ${color}20; color: ${color};">${drill.phaseDuration}'</div><div class="drill-title"><div class="drill-phase" style="color: ${color};">${escapeHTML(drill.phaseLabel)} • ${runningTime}'–${runningTime + drill.phaseDuration}'</div><h3 class="drill-name">${escapeHTML(drill.name)}</h3></div></div>${drill.description ? `<p class="drill-description">${escapeHTML(drill.description)}</p>` : ""}${drill.coaching?.length > 0 ? `<div class="coaching-points"><div class="coaching-label" style="color: ${color};">Coaching Points</div><ul class="coaching-list">${drill.coaching.map(point => `<li>${escapeHTML(point)}</li>`).join("")}</ul></div>` : ""}<div class="drill-details">${drill.equipment?.length > 0 ? drill.equipment.map(e => `<span class="detail-badge">${escapeHTML(e)}</span>`).join("") : ""}${drill.players ? `<span class="detail-badge">${drill.players[0]}–${drill.players[1]} players</span>` : ""}</div></div>`; }).join("")}</div></body></html>`;
  return html;
}
function handlePrintOrExport(plan, config, sport, ageInfo) {
  const printWindow = window.open("", "", "height=600,width=800");
  const htmlContent = generatePrintHTML(plan, config, sport, ageInfo);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 250);
}
function handleShare(plan, config, sport, ageInfo) {
  const summary = generatePlanTextSummary(plan, config, sport, ageInfo);
  navigator.clipboard.writeText(summary).then(() => alert("Training plan copied to clipboard!")).catch(() => alert("Unable to copy."));
}

// ─── PLAN RESULT PAGE (CoachPlan's plan view in Whistle's design language)
function PlanResultPage({ plan: initialPlan, config, sport = "Soccer", setPage, onRegenerate, onSavePlan, onLogPractice }) {
  const [plan, setPlan] = useState(initialPlan);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [swappingIdx, setSwappingIdx] = useState(null);
  const [planTitle, setPlanTitle] = useState("");
  const [saved, setSaved] = useState(false);
  const ageInfo = AGE_GROUPS.find(a => a.value === config.ageGroup);
  const totalTime = plan.reduce((sum, p) => sum + p.phaseDuration, 0);
  const phaseLabels = { "Warm-Up": "warmup", "Technical": "technical", "Tactical": "tactical", "Game": "game", "Cool-Down": "cooldown" };

  const getAlternatives = (drill) => {
    const ages = ageInfo?.ages || [];
    const pool = getDrillPool(sport); // already normalized
    return pool
      .filter(d => d.phase === drill.phase && d.id !== drill.id && d.ages.some(a => ages.includes(a)))
      .slice(0, 3);
  };

  const swapDrill = (idx, newDrill) => {
    const updated = [...plan];
    updated[idx] = { ...newDrill, phaseDuration: plan[idx].phaseDuration, phaseLabel: plan[idx].phaseLabel };
    setPlan(updated);
    setSwappingIdx(null);
  };

  return (
    <div>
      <Breadcrumb items={[
        { label: "Generate Plan", onClick: () => setPage("generate") },
        { label: "Your Training Plan" },
      ]} />

      {/* Plan Header */}
      <div style={{ ...cardStyle, padding: "28px 32px", marginBottom: 24, cursor: "default" }}>
        <div style={{ display: "flex", flexDirection: useIsMobile() ? "column" : "row", justifyContent: "space-between", alignItems: useIsMobile() ? "stretch" : "flex-start", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Your Training Plan</h1>
            <p style={{ fontSize: 14, color: c.slate500, marginBottom: 4 }}>{ageInfo?.label} \u00b7 {config.playerCount} players \u00b7 {totalTime} min \u00b7 Focus: {config.focusAreas.join(", ")}</p>
            {ageInfo?.philosophy && <p style={{ fontSize: 12, color: c.green600, fontStyle: "italic" }}>{ageInfo.philosophy}</p>}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button onClick={() => { if (onSavePlan) onSavePlan(planTitle); setSaved(true); }} aria-label={saved ? "Plan saved" : "Save plan"} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: saved ? c.green700 : `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, color: c.white, fontWeight: 600, fontSize: 13, cursor: saved ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: saved ? "none" : "0 2px 8px rgba(22,163,74,0.3)", transition: "all 0.3s ease" }}>
              <CheckCircle2 size={15} /> {saved ? "Plan Saved!" : "Save Plan"}
            </button>
            <button onClick={() => handlePrintOrExport(plan, config, sport, ageInfo)} aria-label="Export as PDF" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={15} /> Export PDF
            </button>
            <button onClick={() => handlePrintOrExport(plan, config, sport, ageInfo)} aria-label="Print plan" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Printer size={15} /> Print
            </button>
            <button onClick={() => handleShare(plan, config, sport, ageInfo)} aria-label="Share plan" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Share2 size={15} /> Share
            </button>
            <button onClick={onRegenerate} aria-label="Regenerate plan" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <RotateCcw size={15} /> Regenerate
            </button>
            <button onClick={() => setPage("generate")} aria-label="Edit settings" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <ChevronLeft size={15} /> Edit Settings
            </button>
          </div>
        </div>

        {/* Phase Timeline Bar */}
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 10, marginTop: 20, background: c.slate100 }}>
          {plan.map((p, i) => (
            <div key={i} style={{ flex: p.phaseDuration, background: phaseColorMap[phaseLabels[p.phaseLabel]] || c.green500, transition: "all 0.3s" }} />
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 8, gap: 16 }}>
          {plan.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: c.slate500 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: phaseColorMap[phaseLabels[p.phaseLabel]] || c.green500 }} />
              {p.phaseLabel} ({p.phaseDuration}')
            </div>
          ))}
        </div>
      </div>

      {/* Drill Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {plan.map((drill, i) => {
          const phaseKey = phaseLabels[drill.phaseLabel];
          const color = phaseColorMap[phaseKey] || c.green500;
          const expanded = expandedIdx === i;
          let runningTime = 0;
          for (let j = 0; j < i; j++) runningTime += plan[j].phaseDuration;

          return (
            <div key={i} onClick={() => setExpandedIdx(expanded ? null : i)} {...clickableProps(() => setExpandedIdx(expanded ? null : i))} style={{
              ...cardStyle, border: expanded ? `2px solid ${color}` : `1px solid ${c.slate200}`,
            }}>
              <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${color}18`, color: color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, flexShrink: 0,
                }}>{drill.phaseDuration}'</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {drill.phaseLabel} \u00b7 {runningTime}'\u2013{runningTime + drill.phaseDuration}'
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: c.slate800, marginTop: 2 }}>{drill.name}</div>
                </div>
                <div style={{ color: c.slate400, fontSize: 20, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>\u25be</div>
              </div>

              {expanded && (
                <div style={{ padding: "0 24px 24px 24px", borderTop: `1px solid ${c.slate200}` }}>
                  <p style={{ color: c.slate500, fontSize: 14, lineHeight: 1.7, margin: "16px 0" }}>{drill.description}</p>

                  <div style={{ fontSize: 12, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Coaching Points</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {drill.coaching?.map((point, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: color, fontSize: 8, marginTop: 6 }}>\u25cf</span>
                        <span style={{ color: c.slate700, fontSize: 14, lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {drill.equipment?.map(e => (
                        <span key={e} style={{ ...badgeBase, background: `${color}12`, color: color, textTransform: "capitalize" }}>{e}</span>
                      ))}
                      <span style={{ ...badgeBase, background: `${color}12`, color: color }}>{drill.players?.[0]}\u2013{drill.players?.[1]} players</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setSwappingIdx(swappingIdx === i ? null : i); }}
                      style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${color}`, background: swappingIdx === i ? color : "transparent", color: swappingIdx === i ? c.white : color, fontWeight: 600, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                      <RotateCcw size={12} /> Swap Drill
                    </button>
                  </div>

                  {/* Swap alternatives panel */}
                  {swappingIdx === i && (
                    <div style={{ marginTop: 16, padding: "16px", background: c.slate50, borderRadius: 12, border: `1px dashed ${color}` }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Alternative Drills for {drill.phaseLabel}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {getAlternatives(drill).map(alt => (
                          <div key={alt.id} onClick={(e) => { e.stopPropagation(); swapDrill(i, alt); }} role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); swapDrill(i, alt); } }}
                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: c.white, borderRadius: 10, border: `1px solid ${c.slate200}`, cursor: "pointer", transition: "all 0.15s" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = c.slate200; e.currentTarget.style.background = c.white; }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: color, flexShrink: 0 }}>{alt.duration}'</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: c.slate800 }}>{alt.name}</div>
                              <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{alt.description.slice(0, 80)}...</div>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: color }}>Select</div>
                          </div>
                        ))}
                        {getAlternatives(drill).length === 0 && (
                          <div style={{ fontSize: 13, color: c.slate500, textAlign: "center", padding: "12px 0" }}>No alternatives available for this phase and age group</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Drills Page ────────────────────────────────────────────────────────
function DrillsPage({ sport, setPage, setSelectedDrill }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useLocalStorage("favoriteDrills", []);
  const drills = drillsBySport[sport] || [];
  const filtered = drills.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && d.category !== catFilter) return false;
    if (ageFilter !== "all" && !d.ages.includes(ageFilter)) return false;
    if (showFavoritesOnly && !favorites.includes(d.id)) return false;
    return true;
  });

  const toggleFavorite = (drillId) => {
    if (favorites.includes(drillId)) {
      setFavorites(favorites.filter(id => id !== drillId));
    } else {
      setFavorites([...favorites, drillId]);
    }
  };

  const sel = { padding: "10px 14px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, fontSize: 14, color: c.slate600, cursor: "pointer", minWidth: 140 };

  return (
    <div>
      <PageHero gradient={`linear-gradient(135deg, ${c.slate900} 0%, ${c.slate700} 100%)`}
        title={`${sportConfig[sport].emoji} Drill Library`}
        subtitle={`Browse ${drills.length} ${sport.toLowerCase()} drills with coaching points and diagrams`}
        actions={<><HeroBtn label="Create Drill" primary icon={Plus} onClick={() => alert("Custom drill creation coming soon!")} /><HeroBtn label={showFavoritesOnly ? "All Drills" : "Favorites"} icon={Heart} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} /></>}
      />
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: c.slate400 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drills..."
            style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 10, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none" }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={sel}>
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="tactical">Tactical</option>
          <option value="warmup">Warmup</option>
          <option value="fitness">Fitness</option>
        </select>
        <select value={ageFilter} onChange={e => setAgeFilter(e.target.value)} style={sel}>
          <option value="all">All Ages</option>
          {["U6","U8","U10","U12","U14"].map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? (
        <div style={{ ...cardStyle, padding: "60px 40px", textAlign: "center" }}>
          <Search size={48} color={c.slate300} style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: c.slate700, marginBottom: 6 }}>No drills found</h3>
          <p style={{ fontSize: 14, color: c.slate500 }}>Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
          {filtered.map(drill => {
            const cat = categoryColors[drill.category] || categoryColors.technical;
            const isFavorite = favorites.includes(drill.id);
            return (
              <HoverCard key={drill.id}>
                <div style={{ padding: 14, cursor: "pointer" }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }} {...clickableProps(() => { setSelectedDrill(drill); setPage("drill-detail"); })}><MiniField seed={drill.id} sport={sport} /></div>
                <div style={{ padding: "4px 18px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: c.slate800, cursor: "pointer", flex: 1 }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }} {...clickableProps(() => { setSelectedDrill(drill); setPage("drill-detail"); })}>{drill.name}</h3>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(drill.id); }} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                      <Heart size={16} color={isFavorite ? c.rose500 : c.slate300} fill={isFavorite ? c.rose500 : "none"} />
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: c.slate500, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><Timer size={13} />{drill.duration} min</span>
                  </div>
                  <div style={{ cursor: "pointer" }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }} {...clickableProps(() => { setSelectedDrill(drill); setPage("drill-detail"); })}>
                    <p style={{ fontSize: 13, color: c.slate500, lineHeight: 1.4, marginBottom: 12 }}>{drill.desc || drill.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ ...badgeBase, background: cat.bg, color: cat.color }}>{drill.category}</span>
                      {(drill.ages || []).slice(0, 3).map(a => <span key={a} style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{a}</span>)}
                      {(drill.ages || []).length > 3 && <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>+{drill.ages.length - 3}</span>}
                    </div>
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

// ─── Drill Detail ───────────────────────────────────────────────────────
function DrillDetailPage({ drill, sport, setPage }) {
  if (!drill) return null;
  const cat = categoryColors[drill.category] || categoryColors.technical;
  return (
    <div>
      <Breadcrumb items={[{ label: "Drills", onClick: () => setPage("drills") }, { label: drill.name }]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 6 }}>{drill.name}</h1>
          <p style={{ fontSize: 15, color: c.slate500, marginBottom: 12 }}>{drill.desc || drill.description}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ ...badgeBase, background: cat.bg, color: cat.color }}>{drill.category}</span>
            <span style={{ ...badgeBase, background: "#fef3c7", color: "#b45309" }}>{drill.intensity} intensity</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate600 }}>{drill.duration} min</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate600 }}>{typeof drill.players === 'string' ? drill.players : `${drill.players[0]}-${drill.players[1]}`} players</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Plus size={15} /> Add to Plan</button>
          <button style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Heart size={15} /> Favorite</button>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24, marginTop: 20, marginBottom: 20 }}>
        <svg viewBox="0 0 500 300" style={{ width: "100%", height: 280, borderRadius: 12, background: sportConfig[sport]?.fieldColor || c.green600 }}>
          <rect x="5" y="5" width="490" height="290" rx="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          <line x1="250" y1="5" x2="250" y2="295" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <circle cx="250" cy="150" r="40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          {Array.from({ length: 8 }, (_, i) => ({
            cx: 60 + (((typeof drill.id === 'string' ? drill.id.charCodeAt(0) * 47 : drill.id * 47) + i * 67) % 380),
            cy: 40 + (((typeof drill.id === 'string' ? drill.id.charCodeAt(0) * 31 : drill.id * 31) + i * 53) % 220),
            team: i < 4,
          })).map((d, i) => (
            <g key={i}>
              <circle cx={d.cx} cy={d.cy} r="12" fill={d.team ? c.blue500 : c.rose500} stroke="white" strokeWidth="2" />
              <text x={d.cx} y={d.cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{d.team ? "O" : "X"}</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: typeof window !== 'undefined' && window.matchMedia("(max-width: 768px)").matches ? "1fr" : "1fr 320px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...cardStyle, padding: "22px 24px", cursor: "default" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 12 }}>Instructions</h3>
            {(drill.instructions || drill.description || "").split("\n").map((line, i) => (
              <p key={i} style={{ fontSize: 14, color: c.slate600, lineHeight: 1.6, marginBottom: 4 }}>{line}</p>
            ))}
            {drill.coaching && (
              <div style={{ marginTop: 12, padding: "12px 14px", background: c.green50, borderRadius: 8, borderLeft: `3px solid ${c.green400}` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: c.green700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Coaching Points</div>
                {(Array.isArray(drill.coaching) ? drill.coaching : [drill.coaching]).map((cp, i) => (
                  <p key={i} style={{ fontSize: 14, color: c.slate600, lineHeight: 1.6, marginBottom: 2 }}>{typeof cp === 'string' ? cp : ''}</p>
                ))}
              </div>
            )}
          </div>
          {drill.variations && (
            <div style={{ ...cardStyle, padding: "22px 24px", cursor: "default" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 8 }}>Variations</h3>
              <p style={{ fontSize: 14, color: c.slate600, lineHeight: 1.6 }}>{drill.variations}</p>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ ...cardStyle, padding: "22px 24px", cursor: "default" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 10 }}>Age Groups</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(drill.ages || []).map(a => <span key={a} style={{ ...badgeBase, background: c.green100, color: c.green700, fontSize: 13, padding: "5px 14px" }}>{a}</span>)}
            </div>
          </div>
          <div style={{ ...cardStyle, padding: "22px 24px", cursor: "default" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 10 }}>Skill Focus</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(drill.skills || []).map(s => <span key={s} style={{ ...badgeBase, background: c.slate100, color: c.slate600, fontSize: 13, padding: "5px 14px" }}>{s}</span>)}
            </div>
          </div>
          <div style={{ ...cardStyle, padding: "22px 24px", cursor: "default" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 10 }}>Equipment Needed</h3>
            {(drill.equipment || []).map(eq => (
              <div key={eq} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", fontSize: 14, color: c.slate600 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.green500 }} />{eq}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Plans Page ─────────────────────────────────────────────────────────
function PlansPage({ sport, setPage }) {
  const [plans] = useLocalStorage("practicePlans", defaultPracticePlans);
  return (
    <div>
      <PageHero gradient={sportConfig[sport].heroGradient} title={`${sportConfig[sport].emoji} Practice Plans`}
        subtitle="All your saved practice plans"
        actions={<HeroBtn label="Generate New Plan" primary icon={Sparkles} onClick={() => setPage("generate")} />}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
        {plans.map(plan => (
          <HoverCard key={plan.id}>
            <div style={{ padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                {plan.status === "complete" ? <CheckCircle2 size={22} color={c.green500} style={{ flexShrink: 0, marginTop: 2 }} /> : <Circle size={22} color={c.slate300} style={{ flexShrink: 0, marginTop: 2 }} />}
                <h3 style={{ fontSize: 15, fontWeight: 600, color: c.slate800, lineHeight: 1.4 }}>{plan.title}</h3>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{plan.age}</span>
                <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{plan.duration} min</span>
                <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{plan.drills} drills</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {(plan.focus || []).map(f => <span key={f} style={{ ...badgeBase, background: "#dbeafe", color: "#1d4ed8", fontSize: 11 }}>{f}</span>)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: c.slate500 }}>{plan.date}</span>
                <span style={{ ...badgeBase, background: plan.status === "complete" ? c.green100 : c.slate100, color: plan.status === "complete" ? c.green700 : c.slate500, fontSize: 11 }}>
                  {plan.status === "complete" ? "Complete" : "Draft"}
                </span>
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

// ─── Teams Page ─────────────────────────────────────────────────────────
function TeamsPage({ sport, setPage, setSelectedTeam }) {
  const [teams] = useLocalStorage("teams", defaultTeamsData);
  return (
    <div>
      <PageHero gradient={sportConfig[sport].heroGradient} title={`${sportConfig[sport].emoji} My Teams`}
        subtitle="Manage your teams and rosters"
        actions={<HeroBtn label="Create Team" primary icon={Plus} onClick={() => alert("Team creation coming soon!")} />}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {teams.map(team => (
          <HoverCard key={team.id} onClick={() => { setSelectedTeam(team); setPage("team-detail"); }}>
            <div style={{ padding: "24px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: c.green100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.green700 }}>{team.age}</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: c.slate800 }}>{team.name}</h3>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{team.age}</span>
                    <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{team.season}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", background: c.slate50, borderRadius: 10 }}>
                <Users size={16} color={c.slate400} />
                <span style={{ fontSize: 14, color: c.slate600 }}>{team.players.length} players</span>
                <ArrowRight size={14} color={c.slate300} style={{ marginLeft: "auto" }} />
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

// ─── Team Detail ────────────────────────────────────────────────────────
function TeamDetailPage({ team, sport, setPage }) {
  if (!team) return null;
  return (
    <div>
      <Breadcrumb items={[{ label: "Teams", onClick: () => setPage("teams") }, { label: team.name }]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 6 }}>{team.name}</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>{team.age}</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{team.season}</span>
            <span style={{ ...badgeBase, background: c.slate100, color: c.slate500 }}>{team.players.length} players</span>
          </div>
        </div>
        <button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${c.rose500}`, background: "transparent", color: c.rose500, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Trash2 size={14} /> Delete Team</button>
      </div>
      <div style={{ ...cardStyle, padding: "24px 28px", cursor: "default" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, marginBottom: 2 }}>Roster</h2>
            <p style={{ fontSize: 13, color: c.slate500 }}>Manage your players</p>
          </div>
          <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: c.green600, color: c.white, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><UserPlus size={14} /> Add Player</button>
        </div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 80px", gap: 12, padding: "8px 14px", borderBottom: `1px solid ${c.slate200}` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}>#</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}>Name</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}>Position</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: c.slate500, textTransform: "uppercase" }}></span>
          </div>
          {team.players.map((player, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "50px 1fr 100px 80px", gap: 12, padding: "12px 14px", borderBottom: `1px solid ${c.slate100}`, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = c.slate50}
              onMouseLeave={e => e.currentTarget.style.background = ""}>
              <span style={{ fontSize: 14, fontWeight: 700, color: c.green600 }}>{player.number}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.slate700 }}>{player.name}</span>
              <span style={{ ...badgeBase, background: c.slate100, color: c.slate600 }}>{player.position}</span>
              <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${c.slate200}`, background: "transparent", color: c.slate400, fontSize: 12, cursor: "pointer" }}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── History Page ───────────────────────────────────────────────────────
function HistoryPage() {
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
                    <span style={{ fontSize: 13, color: c.slate500 }}>\u00b7</span>
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

// ─── Pricing Page ───────────────────────────────────────────────────────
function PricingPage({ sport }) {
  const tiers = [
    { name: "Free", price: "$0", period: "/month", features: ["3 practice plans per month","Full drill library","Animated drill diagrams","1 team"], active: false, popular: false },
    { name: "Pro", price: "$49.99", period: "/year", sub: "$4.17/month \u00b7 Save $21.89/yr", features: ["Unlimited practice plans","Full drill library","Animated drill diagrams","Unlimited teams","PDF export","Shareable plan links","Priority support"], active: true, popular: true },
  ];
  return (
    <div>
      <PageHero gradient={sportConfig[sport].heroGradient} title="Pricing" subtitle="Choose the plan that works for your coaching needs" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 800, margin: "0 auto" }}>
        {tiers.map(plan => (
          <div key={plan.name} style={{ ...cardStyle, padding: "32px 28px", position: "relative", border: plan.popular ? `2px solid ${c.green500}` : `1px solid ${c.slate200}` }}>
            {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", ...badgeBase, background: c.green600, color: c.white, fontSize: 11 }}>Most Popular</div>}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, textAlign: "center", marginBottom: 4 }}>{plan.name}</h3>
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: c.slate900 }}>{plan.price}</span>
              <span style={{ fontSize: 14, color: c.slate500 }}>{plan.period}</span>
            </div>
            {plan.sub && <p style={{ textAlign: "center", fontSize: 13, color: c.green600, fontWeight: 500, marginBottom: 4 }}>{plan.sub}</p>}
            {plan.active && <div style={{ textAlign: "center", marginBottom: 12 }}><span style={{ ...badgeBase, background: c.green100, color: c.green700 }}>Active (Promo)</span></div>}
            <div style={{ marginTop: 16 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14, color: c.slate600 }}><CheckCircle2 size={16} color={c.green500} />{f}</div>
              ))}
            </div>
            {!plan.active && <button style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 10, border: "none", background: c.slate100, color: c.slate600, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Current Plan</button>}
            {plan.active && <p style={{ textAlign: "center", fontSize: 13, color: c.slate500, marginTop: 16 }}>Enjoying free Pro access</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY
// ═══════════════════════════════════════════════════════════════════════════
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return React.createElement("div", { style: { padding: 40, textAlign: "center" } },
        React.createElement("h2", { style: { fontSize: 20, fontWeight: 600, color: "#334155", marginBottom: 8 } }, "Something went wrong"),
        React.createElement("p", { style: { color: "#64748b", marginBottom: 16 } }, "An error occurred while loading this page."),
        React.createElement("button", { onClick: () => this.setState({ hasError: false, error: null }), style: { padding: "10px 20px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 600, cursor: "pointer" } }, "Try Again")
      );
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function WhistleApp() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState("dashboard");
  const [sport, setSport] = useLocalStorage("selectedSport", "Soccer");
  const [sportOpen, setSportOpen] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planConfig, setPlanConfig] = useState(null);
  const [planKey, setPlanKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  // Focus management: scroll to top and focus main content on page change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
      mainRef.current.focus({ preventScroll: true });
    }
  }, [page]);
  const [plans, setPlans] = useLocalStorage("practicePlans", defaultPracticePlans);
  const [history, setHistory] = useLocalStorage("practiceHistory", defaultHistoryData);

  const handlePlanGenerated = (plan, config) => {
    setGeneratedPlan(plan);
    setPlanConfig(config);
    setPage("plan-result");
  };

  const handleSavePlan = (planTitle) => {
    if (!generatedPlan || !planConfig) return;
    const newPlan = {
      id: Math.max(...plans.map(p => p.id), 0) + 1,
      title: planTitle || `${planConfig.ageGroup} Practice Plan`,
      duration: planConfig.duration,
      age: planConfig.ageGroup,
      date: new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" }).replace(/\//g, "/"),
      status: "draft",
      drills: generatedPlan.length,
      focus: planConfig.focusAreas,
      planData: generatedPlan,
    };
    setPlans([...plans, newPlan]);
  };

  const handleLogPractice = (practiceData) => {
    setHistory([...history, practiceData]);
  };

  const handleRegenerate = () => {
    if (planConfig) {
      const plan = generatePlan(planConfig, sport);
      setGeneratedPlan(plan);
      setPlanKey(k => k + 1);
    }
  };

  const pages = {
    dashboard: <DashboardPage sport={sport} setPage={setPage} />,
    generate: <GeneratePlanPage sport={sport} setPage={setPage} onPlanGenerated={handlePlanGenerated} />,
    "plan-result": generatedPlan && planConfig ? <PlanResultPage key={planKey} plan={generatedPlan} config={planConfig} sport={sport} setPage={setPage} onRegenerate={handleRegenerate} onSavePlan={handleSavePlan} onLogPractice={handleLogPractice} /> : null,
    plans: <PlansPage sport={sport} setPage={setPage} />,
    drills: <DrillsPage sport={sport} setPage={setPage} setSelectedDrill={setSelectedDrill} />,
    "drill-detail": <DrillDetailPage drill={selectedDrill} sport={sport} setPage={setPage} />,
    teams: <TeamsPage sport={sport} setPage={setPage} setSelectedTeam={setSelectedTeam} />,
    "team-detail": <TeamDetailPage team={selectedTeam} sport={sport} setPage={setPage} />,
    history: <HistoryPage sport={sport} />,
    pricing: <PricingPage sport={sport} />,
  };

  return (
    <>
      <style>{`
        button:focus-visible, [role="button"]:focus-visible, a:focus-visible, select:focus-visible, input:focus-visible {
          outline: 2px solid #22c55e;
          outline-offset: 2px;
          border-radius: 4px;
        }
        div[tabindex]:focus-visible {
          outline: 2px solid #22c55e;
          outline-offset: 2px;
        }
        *:focus { outline: none; }
        @media (max-width: 768px) {
          body { margin: 0; padding: 0; }
        }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: c.slate50, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
        onClick={() => {
          if (sportOpen) setSportOpen(false);
          if (isMobile && sidebarOpen) setSidebarOpen(false);
        }}>
        <Sidebar page={page} setPage={setPage} sport={sport} setSport={setSport} sportOpen={sportOpen} setSportOpen={setSportOpen} isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {isMobile && sidebarOpen && <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 999, display: sidebarOpen ? "block" : "none" }} />}
        <main ref={mainRef} tabIndex={-1} role="main" aria-label="Page content" style={{
          marginLeft: isMobile ? 0 : 240,
          flex: 1,
          padding: isMobile ? "12px 16px" : "28px 36px",
          maxWidth: isMobile ? "100%" : 1200,
          outline: "none",
          position: "relative",
          width: "100%",
          overflow: "hidden"
        }}>
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingTop: 4 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Close menu" : "Open menu"} aria-expanded={sidebarOpen} style={{ padding: "8px", borderRadius: 8, border: `1px solid ${c.slate200}`, background: c.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}>
                {sidebarOpen ? <X size={20} color={c.slate800} /> : <Menu size={20} color={c.slate800} />}
              </button>
              <div style={{ fontSize: 16, fontWeight: 600, color: c.slate800 }}>Whistle</div>
            </div>
          )}
          <ErrorBoundary key={page}>{pages[page]}</ErrorBoundary>
        </main>
      </div>
    </>
  );
}