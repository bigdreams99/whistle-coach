import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Home, ClipboardList, Zap, Users, Clock, Star, ChevronDown, ChevronLeft,
  Plus, Search, Heart, ArrowRight, Calendar, Timer, Target, Trophy,
  Filter, CheckCircle2, Circle, Sparkles,
  UserPlus, Trash2, BarChart3, Activity, Award, Play, RotateCcw, ChevronRight, Info,
  Download, Printer, Menu, X,
  Pause, Square, Maximize2, Minimize2, SkipForward, Volume2, VolumeX,
  Wifi, WifiOff, Smartphone, Copy,
  GripVertical, CalendarDays, Repeat,
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
// PWA & OFFLINE HOOKS
// ═══════════════════════════════════════════════════════════════════════════
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => { window.removeEventListener("online", goOnline); window.removeEventListener("offline", goOffline); };
  }, []);
  return isOnline;
}

function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) { setIsInstalled(true); return; }
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { setIsInstalled(true); setDeferredPrompt(null); });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };
  return { deferredPrompt, isInstalled, promptInstall };
}

function OfflineIndicator({ isOnline }) {
  if (isOnline) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
      background: `linear-gradient(135deg, ${c.amber500}, ${c.amber600})`, color: c.white,
      padding: "8px 16px", textAlign: "center", fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>
      <WifiOff size={14} /> You're offline — cached data is available
    </div>
  );
}

function InstallBanner({ deferredPrompt, promptInstall, onDismiss }) {
  if (!deferredPrompt) return null;
  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 9998,
      background: c.white, borderRadius: 16, padding: "16px 24px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: `1px solid ${c.slate200}`,
      display: "flex", alignItems: "center", gap: 16, maxWidth: 440, width: "calc(100% - 32px)",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Smartphone size={20} color={c.white} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: c.slate800 }}>Install Whistle</div>
        <div style={{ fontSize: 12, color: c.slate500 }}>Use offline on the field</div>
      </div>
      <button onClick={promptInstall} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, color: c.white, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Install</button>
      <button onClick={onDismiss} style={{ padding: "4px", border: "none", background: "transparent", cursor: "pointer", color: c.slate400 }}><X size={16} /></button>
    </div>
  );
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
  amber600: "#d97706",
  blue100: "#dbeafe", blue700: "#1d4ed8",
  amber100: "#fef3c7", amber700: "#b45309",
  green100b: "#d1fae5",
  pink100: "#fce7f3", pink700: "#be185d",
  blue50: "#eff6ff",
  indigo500: "#6366f1",
  purple400: "#a855f7",
  red50: "#fef2f2", red500: "#ef4444", red700: "#b91c1c",
  amber200: "#fde68a", amber300: "#fcd34d",
  blue200: "#bfdbfe",
  emerald100: "#d1fae5",
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
    fieldColor: c.green500, heroGradient: `linear-gradient(135deg, ${c.green800} 0%, ${c.green700} 50%, ${c.emerald600} 100%)`,
    positions: ["GK","CB","LB","RB","CDM","CM","CAM","LW","RW","ST"],
  },
  Basketball: {
    emoji: "\ud83c\udfc0", tip: "Focus on fundamentals \u2014 dribbling, footwork, and shooting form. Build competitive drills to keep energy high.",
    fieldColor: "#c2855a", heroGradient: `linear-gradient(135deg, #7c2d12 0%, #c2855a 50%, ${c.amber500} 100%)`,
    positions: ["PG","SG","SF","PF","C"],
  },
  Baseball: {
    emoji: "\u26be", tip: "Balance repetition with game-like situations. Keep batting practice engaging with live pitching when possible.",
    fieldColor: "#65a30d", heroGradient: `linear-gradient(135deg, #365314 0%, #65a30d 50%, #84cc16 100%)`,
    positions: ["P","C","1B","2B","3B","SS","LF","CF","RF"],
  },
  Football: {
    emoji: "\ud83c\udfc8", tip: "Structure practice around position groups, then bring the team together for full-speed reps. Film review is key.",
    fieldColor: c.green600, heroGradient: `linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, ${c.blue500} 100%)`,
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
  Baseball: ["balls", "gloves", "bat", "bases", "tee", "cones", "helmets"],
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
    instructions: d.description,
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
    // ── WARMUP (NEW) ────────────────────────────────────────────────────
    { id: 134, name: "Ball on the Move Warmup", duration: 6, category: "warmup", ages: ["U6","U8","U10","U12"], skills: ["dribbling","fun","conditioning"], desc: "Players dribble freely to music, following coach movement cues — stop, spin, change hands, freeze", intensity: "low", players: "4+", equipment: ["balls","cones"], instructions: "Each player has a ball.\n1. Dribble freely in the gym while music plays\n2. Coach calls commands: 'Freeze!' (stop dribble), 'Spin!' (spin move), 'Switch!' (change hands)\n3. Add movement: jog, skip, slide step while dribbling\n4. 2 minutes free, 2 minutes following the leader", coaching: ["Keep your head up — no staring at the ball.", "Respond instantly to commands to build reaction speed.", "Encourage creativity during free dribble time."], variations: "Coach leads as the ball — everyone mimics. No-look dribble round." },
    { id: 135, name: "Partner Mirror Warmup", duration: 5, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["footwork","conditioning","fun"], desc: "Partners face each other and mirror lateral movements — builds footwork, reaction, and defensive stance habits", intensity: "medium", players: "2+", equipment: [], instructions: "Pairs face each other 3 feet apart.\n1. Leader moves laterally — partner mirrors\n2. Switch leader every 30 seconds\n3. Progress: add jab steps, drop steps, pump fakes\n4. Final round: add a ball — leader is the offensive player, partner must mirror on defense", coaching: ["Stay low in an athletic stance the whole time.", "Quick feet — don't cross your feet on the slides.", "Eyes on the partner's hips, not their feet."], variations: "3-on-3 mirror game for larger groups. Add a reaction command: 'Ball!' — both players sprint to a ball on the floor." },
    { id: 136, name: "Four Corners Passing Warmup", duration: 7, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["passing","conditioning","teamwork"], desc: "Players rotate through four cones passing and moving — builds passing, communication, and light cardio before practice", intensity: "medium", players: "8+", equipment: ["balls","cones"], instructions: "Set 4 cones in a square, 10-12 feet apart. 2 players per cone, 1 ball.\n1. Pass to the adjacent cone and sprint to the back of that line\n2. After 90 seconds, reverse direction\n3. Add a second ball for advanced groups\n4. Introduce bounce passes, then overhead passes each round", coaching: ["Call the name of the person you're passing to.", "Sprint — don't jog — to the next cone.", "Non-ball players stay ready with hands up as targets."], variations: "Cross-pattern passing for longer passes. Add a ball fake before each pass." },
    // ── TECHNICAL (NEW) ─────────────────────────────────────────────────
    { id: 137, name: "One-Dribble Pull-Up", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["shooting","dribbling","footwork"], desc: "Players catch a pass, take exactly one dribble, and pull up for a mid-range jump shot — builds quick release and footwork", intensity: "medium", players: "2+", equipment: ["balls","cones"], instructions: "Shooter starts at the wing, passer at the elbow.\n1. Catch the pass, take one hard dribble toward the basket\n2. Gather, jump stop or 1-2 step, pull up for the shot\n3. Rebounder returns the ball to the passer\n4. 5 reps from each wing and the top of the key", coaching: ["Catch with feet ready — load before the dribble.", "Don't rush: one dribble means one deliberate, powerful dribble.", "Elbow in on the shot — same form every time."], variations: "Off-the-crossover pull-up. Defender closes out — player reads to shoot or drive." },
    { id: 138, name: "Weak Hand Challenge", duration: 8, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["dribbling","footwork","conditioning"], desc: "Entire drill sequence done with the non-dominant hand only — dribbling, layups, and passing", intensity: "medium", players: "1+", equipment: ["balls","cones"], instructions: "Every player uses their weak hand only.\n1. Stationary dribble: pound, crossover (switch hands for just a beat), figure-8 — 1 min\n2. Cone dribble course (weak hand only) — 2 reps\n3. Full-court dribble: weak hand there, both hands back\n4. Finish with 5 weak-hand layups", coaching: ["Don't cheat — dominant hand behind your back if needed.", "Low, controlled dribble: fingertip control matters more than speed.", "Celebrate improvement over perfection — this is hard."], variations: "Weak-hand passing with a partner. Weak-hand free throws." },
    { id: 139, name: "Shot Fake + Drive", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["shooting","footwork","dribbling"], desc: "Teaches players to use a convincing shot fake to get the defender in the air, then attack off the dribble", intensity: "medium", players: "2+", equipment: ["balls","cones"], instructions: "Player catches at the wing with a live defender.\n1. Catch in triple-threat position\n2. Sell the shot fake: bring the ball up, knees dip, head rises\n3. If defender jumps — attack the dribble left or right\n4. Finish at the rim or pull up at the elbow\n5. 5 reps per player", coaching: ["The fake must look exactly like your real shot — sell it.", "Explode off the pivot foot immediately after the fake.", "Keep your eyes on the rim during the fake, not on the defender."], variations: "Shot fake + pass to cutter. Add two defenders: fake one, pass to the open player." },
    { id: 140, name: "Bank Shot Circuit", duration: 7, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["shooting","footwork","fun"], desc: "Players shoot from specific angles designed to use the backboard — builds accuracy and court awareness", intensity: "low", players: "1+", equipment: ["balls"], instructions: "Three spots: 45-degree angle on each side, and the block.\n1. 5 shots from each spot using the backboard\n2. Aim for the top corner of the square on the board\n3. Mix in off-the-dribble bank shots\n4. Track makes per spot", coaching: ["Use the square on the glass — it's there for a reason.", "Softer touch from closer angles.", "The 45-degree angle is the sweet spot for bank shots."], variations: "Bank shot contest: first to 10 makes wins. Add a pump fake before shooting." },
    { id: 141, name: "Elbow Shooting", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["shooting","footwork","conditioning"], desc: "Players catch and shoot from the two elbow spots — the most important mid-range locations on the court", intensity: "medium", players: "2+", equipment: ["balls"], instructions: "Two players alternate. Rebounder passes to the elbow.\n1. Catch with feet set — square up\n2. Shot: balance, elbow under, hold follow-through\n3. Rebounder moves to the other elbow\n4. Go back and forth for 3 minutes each", coaching: ["Feet are set before the catch — not after.", "Hold your follow-through until the ball hits the net.", "Short backswing: this is a quick catch-and-shoot spot."], variations: "Off-the-dribble: drive from the top, pull up at the elbow. Add a time pressure: shoot in 3 seconds." },
    { id: 142, name: "Passing Under Pressure", duration: 8, category: "technical", ages: ["U10","U12","U14"], skills: ["passing","teamwork","defense"], desc: "3v1 keep-away in a small grid — passer must make quick decisions against an active defender", intensity: "medium", players: "4+", equipment: ["balls","cones"], instructions: "3 offensive players form a triangle, 1 defender in the middle.\n1. Offense passes quickly — no holding the ball more than 2 seconds\n2. Defender tries to tip or intercept a pass\n3. If defender gets a touch, switch with the passer who threw it\n4. Count consecutive passes — beat the record each round", coaching: ["Move after you pass — don't stand still.", "Give the passer two targets, not one.", "Fake one way, pass the other."], variations: "3v2 for more challenge. Add a no-bounce-pass rule, then bounce-pass-only." },
    // ── TACTICAL (NEW) ──────────────────────────────────────────────────
    { id: 143, name: "Pick and Roll Live", duration: 12, category: "tactical", ages: ["U12","U14"], skills: ["teamwork","passing","shooting"], desc: "2v2 live pick-and-roll reads: ball handler reads the defense and chooses to attack, pull up, or pass to the roller", intensity: "high", players: "4+", equipment: ["balls","cones"], instructions: "Ball handler at the top, screener at the wing.\n1. Screener sets the ball screen\n2. Ball handler reads: if the defender goes under = pull up. Over = turn the corner. Hedge = pocket pass to roller.\n3. Play live until a score or stop\n4. Rotate: offense becomes defense", coaching: ["Screener: set wide, be a wall — roll hard to the basket.", "Ball handler: wait for the screen, then attack off it.", "Read the defense — make the right play, not the flashy one."], variations: "Add a third defender (help-side). Pick-and-pop: screener pops to the 3-point line instead of rolling." },
    { id: 144, name: "Zone Offense Attack", duration: 12, category: "tactical", ages: ["U12","U14"], skills: ["teamwork","passing","shooting"], desc: "Teaches players how to attack a 2-3 zone: skip passes, high-low, and weak-side cuts", intensity: "medium", players: "8+", equipment: ["balls","cones"], instructions: "Defense plays a 2-3 zone.\n1. Offense learns zone principles: skip pass (ball side to weak side), high-low (top passes to elbow, elbow dumps to block), weak-side flash cut\n2. Walk through each principle, then run live\n3. Defense plays semi-live (no hard closing)", coaching: ["Move the zone — make it shift left, then hit the opposite side.", "The skip pass is the deadliest weapon vs. a 2-3.", "Find the gaps: the short corner and the high post are zone killers."], variations: "Full live 5v5 zone offense. Restrict to 4 passes before shooting to force decision-making." },
    { id: 145, name: "Transition Offense Drill", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["conditioning","teamwork","passing"], desc: "Continuous transition drill: defense rebounds, becomes offense, attacks the other end — builds conditioning and transition habits", intensity: "high", players: "6+", equipment: ["balls"], instructions: "3v3 on a full court.\n1. Offense attacks; defense tries to stop them\n2. After the play, the rebounding team (defense) immediately becomes the offense going the other way\n3. Old offense transitions to defense\n4. Play continuously for 3-4 minutes", coaching: ["Sprint in transition — every possession.", "Outlet the ball wide, not into traffic.", "Stop when defense is set — don't force a bad shot in transition."], variations: "4v3 disadvantage for defense to encourage attacking. Full 5v5 transition." },
    { id: 146, name: "Help Defense Rotations", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["defense","teamwork","footwork"], desc: "Teaches help-and-recover principles — players learn to provide help on dribble penetration and rotate back to their man", intensity: "medium", players: "6+", equipment: ["balls","cones"], instructions: "4 offense on the perimeter, 4 defense.\n1. Ball handler attacks the basket off the dribble\n2. Nearest help defender steps up to stop the ball\n3. Original ball defender and two others rotate to cover the vacated spots\n4. Offense reads and swings ball to open shooter", coaching: ["Help-side defender: one step toward the lane — always be ready to help.", "When you help, someone else must cover your man — communicate.", "Recover to your player after helping — sprint back."], variations: "5v5 live with coaching stoppages to highlight rotation errors. Tag-team drill: tap your partner to rotate in." },
    // ── GAME/SCRIMMAGE (NEW) ────────────────────────────────────────────
    { id: 147, name: "Speedball (Half-Court)", duration: 10, category: "game", ages: ["U8","U10","U12","U14"], skills: ["shooting","fun","conditioning"], desc: "Half-court game where the shot clock is 8 seconds — every possession must be played with urgency and quick decision-making", intensity: "high", players: "4+", equipment: ["balls","cones"], instructions: "3v3 or 4v4 half-court.\n1. Coach counts an 8-second shot clock out loud\n2. Must shoot before 8 seconds or it's a turnover\n3. Regular scoring, make-it-take-it\n4. Play to 7 points", coaching: ["Play faster — less thinking, more reacting.", "The first open shot is the right shot.", "Quick, accurate passes open up the shot clock."], variations: "6-second shot clock for advanced groups. Must pass 3 times before shooting." },
    { id: 148, name: "Survivor Shooting", duration: 8, category: "game", ages: ["U10","U12","U14"], skills: ["shooting","fun","conditioning"], desc: "Teams shoot from assigned spots — miss and you're eliminated. Last team standing wins.", intensity: "medium", players: "6+", equipment: ["balls"], instructions: "Teams of 2-3 take a spot around the key.\n1. Each team shoots simultaneously — each player shoots once per round\n2. A team is eliminated when their last player misses two shots in a row\n3. Continue until one team remains\n4. Winners stay on court vs. new challengers", coaching: ["Slow down and focus under pressure — this is game-speed shooting.", "Encourage and support your teammate after a miss.", "Pick your spot: shoot from where you practice."], variations: "All players shoot from the free throw line only. Beat-the-clock version: make 3 before time runs out." },
    { id: 149, name: "Defensive Stops Challenge", duration: 10, category: "game", ages: ["U10","U12","U14"], skills: ["defense","teamwork","conditioning"], desc: "Defense scores points for stops — turns the traditional scrimmage around and rewards defensive effort", intensity: "high", players: "6+", equipment: ["balls"], instructions: "3v3 half-court.\n1. Defense earns 2 points for a stop (forced miss, steal, or charge)\n2. Offense earns 1 point for a basket\n3. Switch offense/defense after every 4 possessions\n4. Team with the most points at the end wins", coaching: ["Talk on defense — communication is your best tool.", "A stop is worth more than a basket today — commit.", "Stay in front of your man: no reaching, stay low."], variations: "Add a bonus point for a charge taken. Offense-only scoring if defense is struggling." },
    { id: 150, name: "3-Point Contest", duration: 8, category: "game", ages: ["U10","U12","U14"], skills: ["shooting","fun","conditioning"], desc: "Players race around 5 spots shooting 3-pointers — builds range, stamina, and competitive spirit", intensity: "medium", players: "2+", equipment: ["balls"], instructions: "5 spots beyond the arc (corners, wings, top). 2 balls at each spot.\n1. Each player shoots 2 from each spot — move continuously\n2. Score 1 for each make, bonus ball (money ball) at the last spot is worth 2\n3. Track total over 5 spots\n4. Play 3 rounds, highest total wins", coaching: ["Don't rush the shot — get your feet set even while moving.", "Keep your follow-through — fatigue kills form.", "Know your spots: shoot from where you're comfortable."], variations: "Elimination format: lowest score each round is out. Team version: combine individual scores." },
    // ── COOLDOWN (NEW) ──────────────────────────────────────────────────
    { id: 151, name: "Make-It or Run Cooldown", duration: 6, category: "cooldown", ages: ["U8","U10","U12","U14"], skills: ["shooting","fun","conditioning"], desc: "Players shoot 3 free throws — miss any and the group does a short fun activity. Ends practice with laughs and accountability", intensity: "low", players: "4+", equipment: ["balls"], instructions: "Players take turns shooting 3 free throws.\n1. Make all 3: no penalty — take a seat\n2. Miss any: choose a fun penalty (5 ball slaps, 5 jumping jacks, or spin around twice)\n3. After everyone has shot, team stretches together while seated\n4. Coach delivers two positives and one focus for next practice", coaching: ["Keep your routine the same as in game — breathe, bounce, shoot.", "Laugh at the penalties — this should be fun.", "Quiet the team before each player shoots: practice pressure."], variations: "Team version: if anyone misses, everyone does the penalty together. Reverse: miss = you choose someone else's penalty." },
    { id: 152, name: "Circle Stretch & Share", duration: 5, category: "cooldown", ages: ["U6","U8","U10","U12","U14"], skills: ["fun","teamwork","conditioning"], desc: "Team sits in a circle, stretches together, and each player shares one thing they learned or did well — builds team culture and reflection", intensity: "low", players: "4+", equipment: [], instructions: "Team sits in a big circle on the court.\n1. Static stretch sequence led by a player: quads, hamstrings, groin, back, shoulders — 15-20 sec each\n2. Neck rolls and wrist circles for guards and bigs\n3. Go around the circle: each player says one thing they learned or did well today\n4. Coach closes with an affirmation and previews next practice", coaching: ["No pressure on responses — one word or one sentence is fine.", "Celebrate specific wins: 'Great box out, Marcus!'", "Stretch slowly — hold each pose, don't bounce."], variations: "Themed share: 'Best pass you threw today.' Add a team chant or huddle to close." },
    // ── FITNESS (NEW) ───────────────────────────────────────────────────
    { id: 153, name: "Suicide Sprint Challenge", duration: 8, category: "fitness", ages: ["U10","U12","U14"], skills: ["conditioning","footwork","fun"], desc: "Classic court sprints from baseline to free throw line, half court, far free throw line, and full court — with a competitive twist", intensity: "high", players: "4+", equipment: ["cones"], instructions: "Players start on the baseline.\n1. Sprint to the near free throw line and back\n2. Sprint to half court and back\n3. Sprint to far free throw line and back\n4. Sprint full court and back\n5. Rest 60 seconds — repeat 2-3 times\n6. Track times and try to beat your personal best", coaching: ["Touch the line with your hand — no shortcuts.", "Push your final sprint: the race is won at the end.", "Breathe out on the run, breathe in on the turn."], variations: "Team relay version: first team to complete all four sprints wins. Add a ball dribble for a harder challenge." },
    { id: 154, name: "Ball Handling Fitness Circuit", duration: 10, category: "fitness", ages: ["U8","U10","U12","U14"], skills: ["dribbling","conditioning","footwork"], desc: "Timed stations combining ball handling and movement — builds stamina while reinforcing dribbling skills", intensity: "high", players: "1+", equipment: ["balls","cones"], instructions: "Set 4 stations, 90 seconds each, 15-second transition:\n1. Cone weave dribble — full speed, down and back\n2. Two-ball stationary dribble — alternate high-low\n3. Full-court dribble and back — two trips\n4. Crossover + 5-yard sprint at each cone (6 cones in a line)", coaching: ["Ball stays below the knee at all times.", "Explode on the sprint sections — don't coast.", "Weak hand on every second rep of stationary drills."], variations: "Reduce station time to 60 seconds for a more intense circuit. Partner version: one dribbles, one times and counts." },
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
    // ── NEW BASEBALL DRILLS ──────────────────────────────────────────────
    { id: 226, name: "Sharks & Minnows Baserunning", duration: 8, category: "warmup", ages: ["U6","U8","U10"], skills: ["Baserunning","Agility","Reaction"], desc: "Fun tag-based warmup where runners dodge fielders between bases", intensity: "medium", players: "6+", equipment: ["Bases"], instructions: "Set up two bases 60 feet apart. 1-2 sharks stand in the middle. Minnows sprint across on whistle. Tagged minnows become sharks. Last minnow standing wins.", coaching: ["Change speed and direction","Proper tag technique","Keep energy high"], variations: "Sliding to be safe at base. Add a second middle zone." },
    { id: 227, name: "Four Corners Throwing Warmup", duration: 10, category: "warmup", ages: ["U8","U10","U12","U14"], skills: ["Throwing","Catching","Footwork"], desc: "Dynamic group warmup combining throwing, catching, and movement patterns", intensity: "medium", players: "8+", equipment: ["Balls","Gloves"], instructions: "Four cones in a square 40 feet apart. Player throws to next cone then jogs there. After 3 min reverse direction. Then cross pattern for longer throws.", coaching: ["Proper crow-hop footwork","Clear glove target","Increase distance gradually"], variations: "Ground ball rollers instead of throws. Time the group for 20 circuits." },
    { id: 228, name: "Opposite Field Hitting", duration: 12, category: "technical", ages: ["U10","U12","U14"], skills: ["Hitting","Bat Control"], desc: "Teaches hitters to drive the ball to the opposite field", intensity: "medium", players: "2+", equipment: ["Balls","Bat","Tee"], instructions: "Tee on outside of plate. 10 reps off tee, then soft toss from outside angle. Coach calls inside/outside on front toss — pull inside, go oppo on outside.", coaching: ["Hands inside the ball","Front shoulder stays closed longer","Let ball travel deep in zone","Don't reach — let it come to you"], variations: "Cone target in opposite field gap. Live pitching with oppo-only rule." },
    { id: 229, name: "Drag Bunt for a Hit", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Bunting","Bat Control","Speed"], desc: "Push/drag bunt technique for getting on base", intensity: "medium", players: "2+", equipment: ["Balls","Bat","Cones"], instructions: "Cones mark target zones along each baseline. Coach soft tosses, hitter bunts to zone then sprints to first. 5 reps each side.", coaching: ["Top hand cushions the ball","Start running as bat makes contact","Bunt strikes only","Barrel above hands to avoid pop-ups"], variations: "Add a fielder for pressure. Time bunt-to-first." },
    { id: 230, name: "Live Batting Practice", duration: 20, category: "technical", ages: ["U10","U12","U14"], skills: ["Hitting","Pitch Recognition","Timing"], desc: "Full-speed BP with coach pitching live, simulating real at-bats", intensity: "high", players: "4+", equipment: ["Balls","Bat","Bases","Helmets"], instructions: "Coach pitches from L-screen. 3 rounds of 5 pitches: Round 1 all fields, Round 2 situational hitting, Round 3 two-strike approach.", coaching: ["Have a plan before each pitch","Line drives over hard swings","Fielders stay engaged","Rotate quickly for max reps"], variations: "Add live catcher. Put runners on base for situations." },
    { id: 231, name: "Short-Hop Picks", duration: 10, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Fielding","Glove Work"], desc: "Develops ability to field short-hop throws and difficult bounces", intensity: "medium", players: "2+", equipment: ["Balls","Gloves"], instructions: "Pairs 30-40 feet apart. Thrower bounces short hops. Start on knees 2 min, stand 3 min, then add lateral movement. Finish with rapid-fire round.", coaching: ["Glove works through the ball","Read the bounce early","Soft hands — give with the catch","Stay low from the knees"], variations: "First basemen at a base from 60 feet. Tennis balls for younger players." },
    { id: 232, name: "Bare-Hand Fielding", duration: 8, category: "technical", ages: ["U6","U8","U10","U12"], skills: ["Fielding","Soft Hands"], desc: "Removes the glove to teach proper fielding fundamentals", intensity: "low", players: "2+", equipment: [], instructions: "No gloves. Coach rolls tennis balls. Field with two-hand alligator technique. 5 reps straight, 5 forehand, 5 backhand. Progress to light one-hoppers.", coaching: ["Get low — butt down, hands out front","Use two hands, funnel to belly","Attack the ball aggressively","Teaches feel the glove can't"], variations: "Roll two balls in quick succession. Regular baseballs with slow rollers for older players." },
    { id: 233, name: "Infield-Outfield Communication", duration: 12, category: "tactical", ages: ["U10","U12","U14"], skills: ["Communication","Fielding"], desc: "Trains proper call-off communication on fly balls between infielders and outfielders", intensity: "medium", players: "8+", equipment: ["Balls","Gloves"], instructions: "Full infield and outfield. Coach hits fungos into tweener zones. Players must call 'Ball! Ball! Ball!' Outfielder always has priority. Run 15-20 fly balls.", coaching: ["Outfielder ALWAYS has priority","Call early and loud — three times","No call = communication error","Infielder: listen for outfielder's call"], variations: "Add runners on base. Put a runner tagging up." },
    { id: 234, name: "Bullpen Session", duration: 15, category: "technical", ages: ["U10","U12","U14"], skills: ["Pitching","Mechanics","Location"], desc: "Structured bullpen for mechanics, location, and pitch sequencing", intensity: "medium", players: "2+", equipment: ["Balls","Gloves"], instructions: "30-40 pitches total. First 10: fastballs middle for mechanics. Next 10: inside/outside corners. Next 10: changeup or secondary. Final 5-10: simulated at-bats.", coaching: ["Every pitch has a purpose","Consistent release point","Stop and reset if mechanics break down","Track strikes vs balls"], variations: "Batter standing in without swinging. Chart every pitch on strike zone grid." },
    { id: 235, name: "Changeup Development", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Pitching","Arm Speed"], desc: "Teaches changeup grip, arm speed, and release", intensity: "low", players: "2+", equipment: ["Balls","Gloves"], instructions: "Circle change or three-finger grip instruction. Phase 1: 10 throws at 30 feet into net. Phase 2: 10 at 45 feet. Phase 3: alternate fastball-changeup from mound.", coaching: ["Arm speed must match fastball — grip creates the change","Ball deep in the palm, not fingertips","Slight pronation on release","Aim for 8-12 mph slower than fastball"], variations: "Hitter stands in for feedback. Use radar gun for speed differential." },
    { id: 236, name: "Lead-Off Reads", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Baserunning","Reaction","Game IQ"], desc: "Teaches runners proper leads and pitcher reads", intensity: "medium", players: "4+", equipment: ["Bases","Gloves","Balls"], instructions: "Runner at first. Coach acts as pitcher from stretch. Primary lead (shuffle steps), secondary lead as pitcher delivers. Mix in pickoff attempts. Add steal reads based on front heel.", coaching: ["Shuffle steps only — never cross feet","Eyes on pitcher's front hip and heel","Dive back on pickoff — hand on back corner","Secondary lead as pitcher commits home"], variations: "Add live first baseman. Advance to second base leads." },
    { id: 237, name: "First-to-Third Baserunning", duration: 10, category: "tactical", ages: ["U10","U12","U14"], skills: ["Baserunning","Reads","Speed"], desc: "Read hits from first base to advance to third", intensity: "high", players: "4+", equipment: ["Bases","Balls","Gloves"], instructions: "Runner on first. Coach hits singles to LF, CF, RF. Read ball off bat, round second aggressively, decide advance or hold. Third base coach gives signals.", coaching: ["Touch inside of bag with left foot rounding","Line drive to RF is automatic go","Trust the third base coach","Bobbled ball = take the extra base"], variations: "Add cutoff man with live throw. Score: +1 safe at third, -1 thrown out." },
    { id: 238, name: "Cutoff & Relay Situations", duration: 15, category: "tactical", ages: ["U10","U12","U14"], skills: ["Throwing","Communication","Positioning"], desc: "Full-team cutoff and relay positioning on extra-base hits", intensity: "medium", players: "9+", equipment: ["Balls","Gloves","Bases"], instructions: "Full defense. Coach hits to outfield gaps and over heads. Relay man lines up between fielder and target. Three situations: L-C gap to third, R-C gap to third, over head double relay to home.", coaching: ["Relay man: direct line between fielder and target","Arms up so outfielder can find you","Catch relay, turn glove-side, quick throw","Everyone not catching/throwing is backing up"], variations: "Add baserunners for live play. Time from bat contact to base." },
    { id: 239, name: "Defending the Bunt", duration: 12, category: "tactical", ages: ["U10","U12","U14"], skills: ["Fielding","Communication","Game IQ"], desc: "Team bunt defense positioning and responsibilities", intensity: "medium", players: "9+", equipment: ["Balls","Gloves","Bat","Bases"], instructions: "Full infield with runner on first. Two coverages: rotation play and wheel play. Walk through each, then run live reps with bunter. 5 reps each coverage.", coaching: ["Pitcher is the quarterback — calls who fields","3B and 1B charge aggressively on bunt show","Catcher yells the base number","Field bunt like a short-hop pick — stay low"], variations: "Mix in fake bunts. Add drag bunt scenario." },
    { id: 240, name: "Hit-and-Run", duration: 12, category: "tactical", ages: ["U12","U14"], skills: ["Hitting","Baserunning","Game IQ"], desc: "Execute the hit-and-run with live runners and defense", intensity: "high", players: "6+", equipment: ["Balls","Bat","Bases","Helmets"], instructions: "Runner on first gets sign. On pitch, runner breaks for second. Hitter must make contact, aim right side. 8-10 reps per hitter with live defense.", coaching: ["Hitter MUST make contact — shorten up","Aim right side to protect runner","Runner: peek at home as you approach second","Foul it off if pitch is way out of zone"], variations: "Different counts. Add outfield for full results. Score successful vs failed." },
    { id: 241, name: "Base Race Relay", duration: 10, category: "game", ages: ["U6","U8","U10"], skills: ["Baserunning","Speed","Fun"], desc: "Relay race around the bases teaching proper base-touching technique", intensity: "high", players: "6+", equipment: ["Bases","Cones"], instructions: "Teams at home plate. Sprint around bases relay-style. Round 1: normal. Round 2: bases backward. Round 3: stop at second for 3 jumping jacks. First team done wins.", coaching: ["Touch inside corner with left foot","Lean into turns","Missing a base = go back","Cheer for teammates"], variations: "Cones to weave between bases. Sliding relay at second." },
    { id: 242, name: "Wiffle Ball Scrimmage", duration: 15, category: "game", ages: ["U6","U8","U10"], skills: ["Hitting","Fielding","Fun"], desc: "Low-pressure scrimmage with wiffle balls for young players", intensity: "medium", players: "6+", equipment: ["Balls","Bat","Cones"], instructions: "Small diamond with cones 30-40 feet apart. Coach pitches wiffle balls. No strikeouts for U6, no stealing. Every player bats each inning. 3 innings.", coaching: ["Celebrate effort over results","Pause to teach rules naturally","Encourage throwing to bases","Close calls = runner is safe"], variations: "Bonus points for sportsmanship. Older players pitch to younger ones." },
    { id: 243, name: "Baseball Yoga Cooldown", duration: 8, category: "cooldown", ages: ["U6","U8","U10","U12","U14"], skills: ["Flexibility","Recovery"], desc: "Baseball-themed yoga poses for flexibility and calm", intensity: "low", players: "1+", equipment: [], instructions: "Spread out. 'The Windup' — one leg balance. 'Stretch Single' — wide lunge. 'Dugout Seat' — squat hold. 'Sliding Stretch' — seated straddle. 'Victory Pose' — arms wide, deep breathing. End lying on backs for 1 min.", coaching: ["Breathe in 4 counts, out 4 counts","Name poses and tell a story for young players","Never force a stretch","Use this time for positive feedback"], variations: "Different player leads each practice. Add arm circles for pitchers." },
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
    // ── NEW FOOTBALL DRILLS ──────────────────────────────────────────────
    { id: 329, name: "Sharks & Minnows", duration: 8, category: "warmup", ages: ["U6","U8","U10"], skills: ["Agility","Evasion","Ball Security"], desc: "Tag-based warmup where ball carriers dodge defenders to cross the field", intensity: "medium", players: "6+", equipment: ["Balls","Cones"], instructions: "30x20 grid. Sharks in middle, minnows with footballs on end line. Sprint across without getting tagged. Tagged players become sharks. Last minnow wins.", coaching: ["Ball tucked in arm furthest from defender","Sharks stay low and move feet","Use change of direction over straight sprints","Short rest between rounds"], variations: "Flags instead of tags. Shrink grid as fewer minnows remain." },
    { id: 330, name: "Animal Movement Warmup", duration: 6, category: "warmup", ages: ["U6","U8"], skills: ["Coordination","Flexibility","Balance"], desc: "Players mimic animal movements across the field to warm up", intensity: "low", players: "2+", equipment: ["Cones"], instructions: "Two cone lines 15 yards apart. Bear Crawl, Crab Walk, Frog Jumps, Gorilla Shuffle, Cheetah Sprint. Each animal once, then repeat favorites. End with two light jog laps.", coaching: ["Fun voices when calling animals","Watch for proper form","Frog jumps land softly with bent knees","Assess mobility during movement"], variations: "Add a football to carry. Let players suggest animals. Race format." },
    { id: 331, name: "RAC Attack Drill", duration: 12, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Catching","Run After Catch","Evasion"], desc: "Receivers catch short passes then navigate through obstacles for yards after catch", intensity: "high", players: "4+", equipment: ["Balls","Cones"], instructions: "5-yard catch zone, then 3 staggered cones at 5/10/15 yards. QB throws hitch or slant. Receiver catches, tucks, jukes cone 1, absorbs contact at cone 2, accelerates past cone 3.", coaching: ["Secure ball before looking upfield","Tuck to outside arm","Quick catch-to-run transition","Lean into contact, keep feet churning"], variations: "Live defender at 50%. Different route types. Remove bag for U8." },
    { id: 332, name: "Contested Catch Circuit", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Catching","Body Positioning","Concentration"], desc: "Receivers practice catching with a defender draped on them", intensity: "medium", players: "4+", equipment: ["Balls","Cones"], instructions: "3 stations, 2 min each. Station 1: Back shoulder fade catches. Station 2: Crossing route with bump from bag holder. Station 3: 50/50 jump ball vs DB.", coaching: ["Big hands — spread fingers, attack at highest point","Body positioning over height","Eyes on ball through hands — don't flinch","Tuck and protect immediately after catch"], variations: "Point system: 2 for clean catch, 1 for tipped recovery. Full speed on 50/50 balls." },
    { id: 333, name: "Cutback Read Drill", duration: 10, category: "technical", ages: ["U8","U10","U12","U14"], skills: ["Vision","Cutting","Patience","Ball Security"], desc: "RBs read a moving defender to decide stay on path or cut back", intensity: "high", players: "3+", equipment: ["Balls","Cones"], instructions: "4 cones as gaps, defender 5 yards deep who shifts left/right after snap. RB takes handoff and reads: if defender flows hard, plant and cut back. If stays home, hit designed hole. 5 reps each direction.", coaching: ["Patience — don't commit until defender's hips turn","Plant hard on inside foot","Stay low through the cut","Switch ball to outside arm after cut"], variations: "Add lead blocker. Two second-level defenders. Walk through for U8 first." },
    { id: 334, name: "RB Pass Protection", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Pass Protection","Footwork","Recognition"], desc: "Running backs identify and pick up blitzing defenders", intensity: "medium", players: "3+", equipment: ["Cones"], instructions: "QB in pocket, RB in backfield. Coach sends 1 of 3 rushers from different angles. Phase 1: coach points to rusher. Phase 2: RB reads on their own. Rushers at 75%.", coaching: ["Eyes on line first, then scan for blitzers","Get feet set before contact","Hands inside, punch to chest","Cut block at knees if can't square up"], variations: "Add hot route — RB releases as safety valve. Send two rushers." },
    { id: 335, name: "Pass Rush Moves Workshop", duration: 12, category: "technical", ages: ["U10","U12","U14"], skills: ["Pass Rush","Hand Technique","Explosiveness"], desc: "DL practice three core pass rush moves against a blocker", intensity: "high", players: "4+", equipment: ["Cones","Pads"], instructions: "3 stations, 3 min each. Station 1 Speed Rush: dip inside shoulder, rip arm through. Station 2 Bull Rush: punch both hands, drive feet. Station 3 Spin Move: attack outside, plant, spin inside tight.", coaching: ["First step is everything — explode low and fast","Keep hands active — dead hands get stonewalled","Dip-and-rip happens simultaneously","Spin move: stay tight to blocker"], variations: "Add counter-move concept. Time each rep — beat 3-second clock to QB spot." },
    { id: 336, name: "DB Press Coverage", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Press Technique","Footwork","Jamming"], desc: "DBs practice jamming receivers at the line and transitioning into coverage", intensity: "medium", players: "4+", equipment: ["Cones"], instructions: "DB 1 yard off line. Phase 1: Punch & mirror release for 5 yards. Phase 2: Press to cover on assigned routes. Phase 3: Live 1v1 competition.", coaching: ["Inside foot forward — take away inside release","Jam with force but don't lunge","Read receiver's hips, not head","Half-turn hip flip so you can break back"], variations: "Press against trips formation. Add off-coverage rep for comparison." },
    { id: 337, name: "Kickoff Coverage Lanes", duration: 12, category: "tactical", ages: ["U10","U12","U14"], skills: ["Speed","Lane Discipline","Special Teams"], desc: "Players maintain coverage lanes and converge on ball carrier during kickoff", intensity: "high", players: "10+", equipment: ["Balls","Cones"], instructions: "Full-width kickoff with cones marking 5 lanes. 2 players per lane plus kicker. 4 blockers and a returner. Phase 1: walk-through. Phase 2: 75% with blockers. Phase 3: full speed.", coaching: ["Stay in your lane — freelancing creates gaps","Sprint to 30 then break down","Keep head on swivel for blockers","Contain players never let runner get outside"], variations: "Squib kick adjustments. Onside kick recovery." },
    { id: 338, name: "Field Goal & PAT Unit", duration: 10, category: "technical", ages: ["U10","U12","U14"], skills: ["Snapping","Holding","Kicking"], desc: "Full FG/PAT unit practices snap-hold-kick timing and protection", intensity: "low", players: "5+", equipment: ["Balls","Cones"], instructions: "Center, holder, kicker, 2 wing blockers. Phase 1: snap & hold only (target 0.8s). Phase 2: full operation (target 1.3s snap-to-kick). Phase 3: add edge rushers.", coaching: ["Center: firm spiral snap","Holder: laces out immediately","Kicker: head down through the ball","Same approach every time"], variations: "Move back to 20-yard line for FG distance. Fake FG play." },
    { id: 339, name: "Screen Pass Install", duration: 12, category: "tactical", ages: ["U10","U12","U14"], skills: ["Timing","Blocking","Deception"], desc: "Install three types of screen passes: RB screen, bubble screen, tunnel screen", intensity: "medium", players: "7+", equipment: ["Balls","Cones"], instructions: "Phase 1: RB screen — OL pass sets 2 counts, releases to flat. Phase 2: Bubble screen — WR pivots back, slot/others crack block. Phase 3: Tunnel screen — inside receiver crosses behind LOS, OL leaks out to lead block.", coaching: ["QB must sell the fake before delivering","Blockers sustain — don't bump and fall off","Ball carrier gets behind blockers","OL release should look natural"], variations: "Add defensive look for right-call reads. Screen off play-action fake." },
    { id: 340, name: "Play-Action Bootleg Series", duration: 12, category: "tactical", ages: ["U10","U12","U14"], skills: ["Play Fake","Decision Making"], desc: "QB and skill players sell run fake and execute bootleg pass concepts", intensity: "medium", players: "6+", equipment: ["Balls","Cones"], instructions: "Phase 1: Run fake fundamentals — mesh point drill. Phase 2: Add 3 receivers (drag, deep crosser, clear-out). QB fakes, boots, reads drag then crosser. Phase 3: Add DE and LB for live reads.", coaching: ["Fake must be convincing — extend ball fully","Get depth on the boot","First read is the drag — highest percentage","If nothing open, tuck and run upfield"], variations: "Run real handoff 2 times first, then play-action off same look." },
    { id: 341, name: "Goal-Line Offense vs Defense", duration: 15, category: "game", ages: ["U10","U12","U14"], skills: ["Goal Line","Physicality","Play Calling"], desc: "Team scrimmage from the 5-yard line", intensity: "high", players: "10+", equipment: ["Balls","Cones"], instructions: "Ball on 5-yard line. Offense gets 4 plays to score. 4 plays: QB sneak, power run, fade, sprint-out pass. Defense runs goal-line base. Walk through then go live. Keep score.", coaching: ["Offense: get low and drive legs","Defense: gap discipline is critical","QB reads pre-snap — stacked box means fade is open","Celebrate stops and scores equally"], variations: "Move to 1-yard line. Add 2-point conversion. Only 3 plays for urgency." },
    { id: 342, name: "Blitz Pickup & Hot Route", duration: 12, category: "tactical", ages: ["U10","U12","U14"], skills: ["Blitz Recognition","Communication","Pass Protection"], desc: "Offense identifies blitzes pre-snap and adjusts protection and routes", intensity: "medium", players: "8+", equipment: ["Balls","Cones"], instructions: "4-man front, 3 LBs. Phase 1: identify 4 blitz looks. Phase 2: execute at 75% with hot route conversion. Phase 3: random — offense reads and reacts in real time.", coaching: ["QB: count box defenders, identify who's blitzing","Center is the QB of the OL","RB: if free, check-release to flat","Hot route WR: shorten route when you see blitz"], variations: "No-huddle with 10-second clock. Max-protect scheme practice." },
    { id: 343, name: "Football Relay Races", duration: 10, category: "game", ages: ["U6","U8","U10"], skills: ["Ball Security","Speed","Fun"], desc: "Relay race variations building football fundamentals", intensity: "high", players: "6+", equipment: ["Balls","Cones"], instructions: "Teams of 3-4. Race 1: Tuck & Run. Race 2: Obstacle zigzag. Race 3: Over-Under (set down/pick up). Race 4: QB Relay (throw back to next player). Best of 4 wins.", coaching: ["Ball security during sprints","Clean handoffs — hands ready","Encourage cheering","Shuffle players between races for balance"], variations: "Add crab-walk leg. Backward-run segment. Shorten to 10 yards for U6." },
    { id: 344, name: "QB Challenge Course", duration: 10, category: "game", ages: ["U6","U8","U10","U12"], skills: ["Throwing Accuracy","Fun"], desc: "Target-throwing competition at different distances", intensity: "low", players: "2+", equipment: ["Balls","Cones"], instructions: "5 target stations at 5/10/15/20/25 yards (adjust for age). Targets: hoops, cans, cones on buckets. 2 throws per station. Hit = 2 pts, close = 1 pt, both hits = bonus. Crown QB of the Day.", coaching: ["Feet pointed at target","Follow through — reach for the target","Step with opposite foot","Celebrate improvement on round 2"], variations: "Moving target. Trick shot station (one knee, off hand). Team score competition." },
    { id: 345, name: "Victory Lap & Breathing Reset", duration: 8, category: "cooldown", ages: ["U6","U8","U10","U12","U14"], skills: ["Recovery","Flexibility"], desc: "Gentle cool-down jog, guided stretching, and breathing", intensity: "low", players: "2+", equipment: ["Cones"], instructions: "Phase 1: slow team jog around field with shout-outs. Phase 2: static stretch circle — each player leads one stretch, 20 seconds. Phase 3: lying on backs, box breathing 4 cycles.", coaching: ["Hold stretches, don't bounce","Different player leads each practice","Keep mood light and positive","For young players: big breath in, slow breath out"], variations: "Statue game for U6-U8 instead of breathing. Foam rolling for older groups." },
    { id: 346, name: "Iron Man Tournament", duration: 15, category: "game", ages: ["U10","U12","U14"], skills: ["All-Around Skills","Competition"], desc: "Multi-round tournament rotating through QB, WR, RB, and DB skills", intensity: "high", players: "4+", equipment: ["Balls","Cones"], instructions: "Head-to-head bracket. Round 1: QB accuracy (5 throws at target). Round 2: 1v1 routes (3 as WR, 3 as DB). Round 3: Gauntlet run through cones with strip attempts. Round 4: Shuttle run endurance. Tally wins for Iron Man champion.", coaching: ["Compete hard but congratulate opponent","Praise versatility over one-skill dominance","Keep rounds moving quickly","Adjust difficulty by age"], variations: "Add punt distance round. Team version combining scores. End-of-season bracket event." },
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

function generatePlan(config, sport = "Soccer", recentDrillIds = []) {
  const { ageGroup, playerCount, duration, focusAreas, equipment } = config;
  const ages = AGE_GROUPS.find(a => a.value === ageGroup)?.ages || [];
  const rawDrills = sport === "Soccer" ? soccerDrillsFull : (drillsBySport[sport] || []);
  const allDrills = rawDrills.map(normalizeDrill);

  const available = allDrills.filter(d =>
    d.ages.some(a => ages.includes(a)) &&
    d.equipment.every(e => equipment.includes(e)) &&
    (Array.isArray(d.players) ? d.players[0] <= playerCount : true)
  );

  const isVeryYoung = ageGroup === "U6";
  const isYoung = ["U6", "U8"].includes(ageGroup);
  const isOlder = ["U14"].includes(ageGroup);
  const phaseIntensity = { warmup: "low", technical: "medium", tactical: "medium", game: "high", cooldown: "low" };
  const intensityOrder = { low: 0, medium: 1, high: 2 };
  const coveredFocuses = new Set();
  const usedIds = new Set();

  const scoreDrill = (drill, phase, preferredFocuses) => {
    let score = 0;
    const drillFocuses = drill.focus || [];
    if (preferredFocuses.length > 0) {
      for (const f of drillFocuses) {
        if (preferredFocuses.includes(f)) {
          score += 10;
          if (!coveredFocuses.has(f)) score += 15;
        }
      }
    }
    const expected = phaseIntensity[phase] || "medium";
    const drillInt = (drill.intensity || "medium").toLowerCase();
    const diff = Math.abs((intensityOrder[drillInt] ?? 1) - (intensityOrder[expected] ?? 1));
    score += Math.max(0, 10 - diff * 5);
    if (recentDrillIds.includes(drill.id)) score -= 20;
    if (isYoung && drillFocuses.includes("fun")) score += 12;
    if (isOlder && (drillFocuses.includes("tactical") || drillFocuses.includes("decision making"))) score += 8;
    if (usedIds.has(drill.id)) score -= 40;
    return score;
  };

  const pick = (phase, preferredFocuses) => {
    let pool = available.filter(d => d.phase === phase && !usedIds.has(d.id));
    if (pool.length === 0) pool = available.filter(d => !usedIds.has(d.id));
    if (pool.length === 0) pool = available.filter(d => d.phase === phase);
    if (pool.length === 0) return null;
    const scored = pool.map(d => ({ ...d, _score: scoreDrill(d, phase, preferredFocuses) }));
    scored.sort((a, b) => b._score - a._score);
    const topN = Math.min(3, scored.length);
    const top = scored.slice(0, topN);
    const minScore = Math.min(...top.map(d => d._score));
    const weights = top.map(d => Math.max(1, d._score - minScore + 1));
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    let rand = Math.random() * totalWeight;
    let selected = top[0];
    for (let i = 0; i < top.length; i++) {
      rand -= weights[i];
      if (rand <= 0) { selected = top[i]; break; }
    }
    if (selected) {
      usedIds.add(selected.id);
      for (const f of (selected.focus || [])) {
        if (preferredFocuses.includes(f)) coveredFocuses.add(f);
      }
      const { _score, ...clean } = selected;
      return clean;
    }
    return null;
  };

  let phases;
  if (duration <= 50) phases = { warmup: 8, technical: 12, tactical: 10, game: 12, cooldown: 5 };
  else if (duration <= 65) phases = { warmup: 8, technical: 15, tactical: 12, game: 15, cooldown: 5 };
  else if (duration <= 80) phases = { warmup: 10, technical: 18, tactical: 15, game: 18, cooldown: 5 };
  else phases = { warmup: 10, technical: 20, tactical: 20, game: 25, cooldown: 5 };

  if (isYoung) { phases.tactical = Math.max(8, phases.tactical - 5); phases.game += 5; }

  const skipTactical = isVeryYoung;
  if (skipTactical) { phases.game += phases.tactical; phases.tactical = 0; }

  const drillCounts = {
    warmup: 1, technical: 1,
    tactical: skipTactical ? 0 : 1,
    game: skipTactical ? 2 : 1,
    cooldown: 1,
  };
  if (duration >= 75) drillCounts.technical = 2;
  if (duration >= 90 && !skipTactical) drillCounts.tactical = 2;

  const plan = [];
  const phaseOrder = ["warmup", "technical", "tactical", "game", "cooldown"];
  const phaseLabels = { warmup: "Warm-Up", technical: "Technical", tactical: "Tactical", game: "Game", cooldown: "Cool-Down" };

  for (const phase of phaseOrder) {
    const count = drillCounts[phase];
    if (count === 0 || phases[phase] === 0) continue;
    const totalTime = phases[phase];
    const drills = [];
    for (let i = 0; i < count; i++) {
      const preferred = phase === "cooldown" ? [] : focusAreas;
      const drill = pick(phase, preferred);
      if (drill) drills.push(drill);
    }
    if (drills.length === 0) continue;
    const perDrill = Math.floor(totalTime / drills.length);
    const remainder = totalTime - perDrill * drills.length;
    drills.forEach((drill, idx) => {
      plan.push({ ...drill, phaseDuration: perDrill + (idx === 0 ? remainder : 0), phaseLabel: phaseLabels[phase] });
    });
  }
  return plan.filter(Boolean);
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
  technical: { bg: c.blue100, color: c.blue700 },
  tactical: { bg: c.amber100, color: c.amber700 },
  warmup: { bg: c.green100b, color: c.emerald600 },
  fitness: { bg: c.pink100, color: c.pink700 },
};

// ── Drill Diagram Component (replaces old MiniField) ──────────────────
function _ddRng(id) {
  let h = 0; const s = String(id);
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  let st = Math.abs(h) || 1;
  return () => { st = (st * 1664525 + 1013904223) & 0x7fffffff; return st / 0x7fffffff; };
}
function _ddCount(players) {
  if (Array.isArray(players)) return Math.min(players[0] || 4, 10);
  if (typeof players === "string") { const n = parseInt(players, 10); return Math.min(isNaN(n) ? 4 : n, 10); }
  return 4;
}
function _ddHas(arr, kw) { return (arr || []).some(s => s.toLowerCase().includes(kw.toLowerCase())); }
const _dd = { tA: c.blue500, tB: c.rose500, cone: c.orange500, ball: c.amber400, goal: "rgba(255,255,255,0.8)", arr: "rgba(255,255,255,0.5)", ln: "rgba(255,255,255,0.4)" };
function _Dot({ x, y, team = "A" }) { return <circle cx={x} cy={y} r={3.5} fill={team === "A" ? _dd.tA : _dd.tB} stroke="white" strokeWidth="0.8" />; }
function _Cone({ x, y }) { return <polygon points={`${x},${y-2.5} ${x-2},${y+1.5} ${x+2},${y+1.5}`} fill={_dd.cone} stroke="white" strokeWidth="0.4" opacity="0.9" />; }
function _Goal({ x, y, facing = "up" }) { return <rect x={x-5} y={facing==="up"?y-5:y} width={10} height={5} rx="1" fill="none" stroke={_dd.goal} strokeWidth="1" />; }
function _Ball({ x, y }) { return <circle cx={x} cy={y} r={2} fill={_dd.ball} stroke="white" strokeWidth="0.5" />; }
function _Arrow({ x1, y1, x2, y2 }) {
  const dx = x2-x1, dy = y2-y1, len = Math.sqrt(dx*dx+dy*dy);
  if (len < 1) return null;
  const ux = dx/len, uy = dy/len, ax = x2-ux*2.5, ay = y2-uy*2.5, px = -uy*1.5, py = ux*1.5;
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={_dd.arr} strokeWidth="0.8" strokeDasharray="2 1" /><polygon points={`${x2},${y2} ${ax+px},${ay+py} ${ax-px},${ay-py}`} fill={_dd.arr} /></g>;
}
function _CArrow({ x1, y1, x2, y2, bend = 8 }) {
  const mx = (x1+x2)/2, my = (y1+y2)/2, dx = x2-x1, dy = y2-y1, len = Math.sqrt(dx*dx+dy*dy);
  if (len < 1) return null;
  const nx = -dy/len, ny = dx/len, cx2 = mx+nx*bend, cy2 = my+ny*bend;
  const ul = Math.sqrt((x2-cx2)**2+(y2-cy2)**2), ux = (x2-cx2)/ul, uy = (y2-cy2)/ul;
  const ax = x2-ux*2.5, ay = y2-uy*2.5, px = -uy*1.5, py = ux*1.5;
  return <g><path d={`M ${x1} ${y1} Q ${cx2} ${cy2} ${x2} ${y2}`} fill="none" stroke={_dd.arr} strokeWidth="0.8" strokeDasharray="2 1" /><polygon points={`${x2},${y2} ${ax+px},${ay+py} ${ax-px},${ay-py}`} fill={_dd.arr} /></g>;
}

function _ddLayout(drill, rng) {
  const catMap = { fitness: "warmup", game: "game", cooldown: "cooldown", scrimmage: "game" };
  const rawPhase = drill.phase || catMap[drill.category] || drill.category || "technical";
  const phase = rawPhase;
  const rawFocus = drill.focus || (drill.skills || []).map(s => s.toLowerCase());
  const focus = rawFocus;
  const eq = drill.equipment || [];
  const players = drill.players;
  const n = _ddCount(players);
  const f = focus, e = eq;
  if (phase === "cooldown") {
    const nn = Math.min(n, 8), r = 25, ps = [];
    for (let i = 0; i < nn; i++) { const a = (Math.PI*2*i)/nn - Math.PI/2; ps.push({ x: 70+Math.cos(a)*r, y: 45+Math.sin(a)*r, t: "A" }); }
    return { ps, cn: [], gl: [], ar: [], bl: [{ x: 70, y: 45 }], zz: null };
  }
  if (phase === "game") {
    const ps = [], half = Math.floor(Math.min(n,10)/2);
    for (let i = 0; i < half; i++) ps.push({ x: 15+rng()*50, y: 15+rng()*60, t: "A" });
    for (let i = 0; i < Math.min(n,10)-half; i++) ps.push({ x: 75+rng()*50, y: 15+rng()*60, t: "B" });
    return { ps, cn: [], gl: [{ x: 8, y: 38, side: true }, { x: 132, y: 38, side: true }], ar: [], bl: [{ x: 70, y: 45 }], zz: null };
  }
  if (phase === "warmup") {
    if (_ddHas(f,"agility") && !_ddHas(f,"passing")) {
      const ps = [], cn = [];
      for (let i = 0; i < Math.min(n,5); i++) ps.push({ x: 15+i*12, y: 70, t: "A" });
      for (let i = 0; i < 5; i++) cn.push({ x: 30+(i%2===0?8:-8), y: 15+i*11 });
      return { ps, cn, gl: [], ar: [], bl: [], zz: { x: 30, y: 15, seg: 5, w: 8, h: 55 } };
    }
    if (_ddHas(f,"passing") || _ddHas(f,"possession")) {
      const nn = Math.min(n,6), ps = [], ar = [];
      for (let i = 0; i < nn; i++) { const a = (Math.PI*2*i)/nn - Math.PI/2; ps.push({ x: 70+Math.cos(a)*28, y: 45+Math.sin(a)*28, t: "A" }); }
      if (nn >= 4) { ar.push({ x1: ps[0].x, y1: ps[0].y, x2: ps[2].x, y2: ps[2].y, c: true }); ar.push({ x1: ps[1].x, y1: ps[1].y, x2: ps[3].x, y2: ps[3].y, c: true }); }
      return { ps, cn: [], gl: [], ar, bl: [{ x: 70, y: 45 }], zz: null };
    }
    const ps = [];
    for (let i = 0; i < Math.min(n,6); i++) ps.push({ x: 30+rng()*80, y: 20+rng()*50, t: "A" });
    return { ps, cn: [{ x: 20, y: 15 },{ x: 120, y: 15 },{ x: 20, y: 75 },{ x: 120, y: 75 }], gl: [], ar: [], bl: [{ x: ps[0]?.x+3||50, y: ps[0]?.y||40 }], zz: null };
  }
  if (phase === "technical") {
    if (_ddHas(f,"goalkeeping")) {
      const ps = [{ x: 70, y: 12, t: "A" },{ x: 40, y: 55, t: "B" },{ x: 70, y: 65, t: "B" },{ x: 100, y: 55, t: "B" }];
      const ar = [{ x1: 40, y1: 55, x2: 70, y2: 15, c: true },{ x1: 70, y1: 65, x2: 70, y2: 15, c: true },{ x1: 100, y1: 55, x2: 70, y2: 15, c: true }];
      return { ps, cn: [], gl: [{ x: 70, y: 6 }], ar, bl: [{ x: 70, y: 60 }], zz: null };
    }
    if (_ddHas(f,"shooting")) {
      const ps = []; for (let i = 0; i < Math.min(n,5); i++) ps.push({ x: 25+i*10, y: 65, t: "A" });
      return { ps, cn: [], gl: [{ x: 70, y: 8 }], ar: [{ x1: 60, y1: 62, x2: 70, y2: 18, c: true }], bl: [{ x: 62, y: 60 }], zz: null };
    }
    if (_ddHas(f,"dribbling") || _ddHas(f,"first touch") || _ddHas(f,"agility")) {
      const cn = []; for (let i = 0; i < 6; i++) cn.push({ x: 35+i*15, y: 45 });
      return { ps: [{ x: 20, y: 45, t: "A" }], cn, gl: [], ar: [], bl: [{ x: 23, y: 43 }], zz: null, weave: cn };
    }
    if (_ddHas(f,"passing")) {
      const ps = [], ar = [], pairs = Math.min(Math.floor(n/2), 3);
      for (let i = 0; i < pairs; i++) { const y = 22+i*22; ps.push({ x: 35, y, t: "A" },{ x: 105, y, t: "A" }); ar.push({ x1: 39, y1: y, x2: 101, y2: y }); }
      return { ps, cn: [], gl: [], ar, bl: [{ x: 70, y: 22 }], zz: null };
    }
    const ps = [], ar = [], pairs = Math.min(Math.floor(n/2), 3);
    for (let i = 0; i < pairs; i++) { const y = 22+i*22; ps.push({ x: 35, y, t: "A" },{ x: 105, y, t: "A" }); ar.push({ x1: 39, y1: y, x2: 101, y2: y }); }
    return { ps, cn: [], gl: [], ar, bl: [{ x: 70, y: 22 }], zz: null };
  }
  if (phase === "tactical") {
    if (_ddHas(f,"possession")) {
      const nn = Math.min(n,6), ps = [], ar = [];
      for (let i = 0; i < nn; i++) { const a = (Math.PI*2*i)/nn - Math.PI/2; ps.push({ x: 70+Math.cos(a)*26, y: 45+Math.sin(a)*26, t: "A" }); }
      ps.push({ x: 73, y: 42, t: "B" }); if (n >= 6) ps.push({ x: 66, y: 49, t: "B" });
      if (nn >= 3) { ar.push({ x1: ps[0].x, y1: ps[0].y, x2: ps[1].x, y2: ps[1].y }); ar.push({ x1: ps[1].x, y1: ps[1].y, x2: ps[2].x, y2: ps[2].y }); }
      return { ps, cn: [{ x: 44, y: 19 },{ x: 96, y: 19 },{ x: 44, y: 71 },{ x: 96, y: 71 }], gl: [], ar, bl: [{ x: (ps[0]?.x||70)+3, y: ps[0]?.y||45 }], zz: null };
    }
    if (_ddHas(f,"defending")) {
      const ps = [], ar = [], nn = Math.min(Math.floor(n/2), 4);
      for (let i = 0; i < nn; i++) { const x = 30+i*25; ps.push({ x, y: 30, t: "A" },{ x, y: 60, t: "B" }); ar.push({ x1: x, y1: 57, x2: x, y2: 33 }); }
      return { ps, cn: [], gl: [], ar, bl: [{ x: 30, y: 28 }], zz: null };
    }
    if (_ddHas(f,"transition")) {
      const ps = [], half = Math.floor(Math.min(n,8)/2);
      for (let i = 0; i < half; i++) ps.push({ x: 30+rng()*30, y: 30+rng()*30, t: "A" });
      for (let i = 0; i < Math.min(n,8)-half; i++) ps.push({ x: 80+rng()*30, y: 30+rng()*30, t: "B" });
      return { ps, cn: [], gl: [{ x: 8, y: 38, side: true },{ x: 132, y: 38, side: true }], ar: [{ x1: 50, y1: 45, x2: 15, y2: 45, c: true },{ x1: 90, y1: 45, x2: 125, y2: 45, c: true }], bl: [{ x: 70, y: 45 }], zz: null };
    }
    // attacking / 1v1 / default tactical
    const ps = [{ x: 40, y: 50, t: "A" },{ x: 70, y: 60, t: "A" },{ x: 100, y: 50, t: "A" },{ x: 55, y: 35, t: "B" },{ x: 85, y: 35, t: "B" },{ x: 70, y: 12, t: "B" }];
    return { ps, cn: [], gl: [{ x: 70, y: 6 }], ar: [{ x1: 70, y1: 57, x2: 70, y2: 18 },{ x1: 42, y1: 48, x2: 65, y2: 20, c: true },{ x1: 98, y1: 48, x2: 75, y2: 20, c: true }], bl: [{ x: 70, y: 55 }], zz: null };
  }
  // fallback
  const ps = []; for (let i = 0; i < Math.min(n,6); i++) ps.push({ x: 30+rng()*80, y: 20+rng()*50, t: "A" });
  return { ps, cn: [{ x: 20, y: 15 },{ x: 120, y: 15 },{ x: 20, y: 75 },{ x: 120, y: 75 }], gl: [], ar: [], bl: [], zz: null };
}

function DrillDiagram({ drill, sport }) {
  const fieldColor = sportConfig[sport]?.fieldColor || c.green600;
  const rng = _ddRng(drill?.id || "default");
  const lay = _ddLayout(drill || {}, rng);
  const isB = sport === "Basketball", isBB = sport === "Baseball", isFB = sport === "Football";
  return (
    <svg viewBox="0 0 140 90" style={{ width: "100%", height: 100, borderRadius: 12, background: fieldColor }}>
      {isB ? (<><rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke={_dd.ln} strokeWidth="1.5" /><line x1="70" y1="2" x2="70" y2="88" stroke={_dd.ln} strokeWidth="1" /><circle cx="70" cy="45" r="14" fill="none" stroke={_dd.ln} strokeWidth="1" /></>)
      : isBB ? (<><polygon points="70,75 30,40 70,5 110,40" fill="none" stroke={_dd.ln} strokeWidth="1.5" /><circle cx="70" cy="45" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" /></>)
      : isFB ? (<><rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" />{[28,47,70,93,112].map(x => <line key={x} x1={x} y1="2" x2={x} y2="88" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />)}</>)
      : (<><rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" /><line x1="70" y1="2" x2="70" y2="88" stroke="white" strokeWidth="1" strokeDasharray="4 2" /><circle cx="70" cy="45" r="14" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" /></>)}
      {lay.gl.map((g, i) => g.side ? <rect key={`g${i}`} x={g.x-3} y={g.y} width={6} height={14} rx="1" fill="none" stroke={_dd.goal} strokeWidth="1" /> : <_Goal key={`g${i}`} x={g.x} y={g.y} />)}
      {lay.zz && <path d={(() => { let d = `M ${lay.zz.x} ${lay.zz.y}`; for (let i = 0; i < lay.zz.seg; i++) d += ` L ${lay.zz.x + (i%2===0?lay.zz.w:-lay.zz.w)} ${lay.zz.y + (lay.zz.h/lay.zz.seg)*(i+1)}`; return d; })()} fill="none" stroke={_dd.arr} strokeWidth="0.8" strokeDasharray="2 1" />}
      {lay.weave && <path d={(() => { const pts = [...lay.weave].sort((a,b)=>a.x-b.x); if (pts.length < 2) return ""; let d = `M ${pts[0].x-8} ${pts[0].y}`; pts.forEach((p,i) => { d += ` Q ${p.x} ${p.y+(i%2===0?-8:8)} ${p.x+7} ${p.y}`; }); return d; })()} fill="none" stroke={_dd.arr} strokeWidth="0.8" strokeDasharray="2 1" />}
      {lay.ar.map((a, i) => a.c ? <_CArrow key={`a${i}`} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} /> : <_Arrow key={`a${i}`} x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} />)}
      {lay.cn.map((cc, i) => <_Cone key={`c${i}`} x={cc.x} y={cc.y} />)}
      {lay.ps.map((p, i) => <_Dot key={`p${i}`} x={p.x} y={p.y} team={p.t} />)}
      {lay.bl.map((b, i) => <_Ball key={`b${i}`} x={b.x} y={b.y} />)}
    </svg>
  );
}

function AnimatedDrillDiagram({ drill, sport, animated = true, isPro = false }) {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [currentStep, setCurrentStep] = React.useState(0);
  const svgRef = React.useRef(null);

  // Non-Pro users always see static diagram
  if (!isPro || !animated) {
    return <DrillDiagram drill={drill} sport={sport} />;
  }

  const fieldColor = sportConfig[sport]?.fieldColor || c.green600;
  const rng = _ddRng(drill?.id || "default");
  const lay = _ddLayout(drill || {}, rng);
  const isB = sport === "Basketball";
  const isBB = sport === "Baseball";
  const isFB = sport === "Football";

  const totalArrows = lay.ar.length;
  const totalSteps = Math.max(totalArrows, 1);

  // Step-by-step auto-advance
  React.useEffect(() => {
    if (!isPlaying || totalArrows === 0) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % (totalSteps + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, totalArrows]);

  // Animation durations
  const drawDuration = 0.8; // seconds per arrow draw
  const staggerDelay = 0.15; // seconds between arrows in same step

  // Build unique animation ID prefix from drill
  const animId = `anim-${(drill?.id || "x").toString().replace(/[^a-zA-Z0-9]/g, "")}`;

  // Generate CSS keyframes
  const styleContent = `
    @keyframes ${animId}-draw {
      from { stroke-dashoffset: 200; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes ${animId}-fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes ${animId}-pulse {
      0%, 100% { r: 3.5; }
      50%      { r: 5; }
    }
    @keyframes ${animId}-moveDot {
      from { offset-distance: 0%; }
      to   { offset-distance: 100%; }
    }
    .${animId}-arrow {
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
    }
    .${animId}-arrow.visible {
      animation: ${animId}-draw ${drawDuration}s ease-out forwards;
    }
    .${animId}-dot-active {
      animation: ${animId}-pulse 1s ease-in-out infinite;
    }
    .${animId}-paused .${animId}-arrow.visible,
    .${animId}-paused .${animId}-dot-active {
      animation-play-state: paused;
    }
  `;

  // Determine which arrows are visible based on currentStep
  // Step 0 = no arrows, step 1 = first arrow, step N = all arrows up to N
  const visibleArrows = currentStep;

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 140 90"
        className={isPlaying ? "" : `${animId}-paused`}
        style={{ width: "100%", height: 100, borderRadius: 12, background: fieldColor }}
      >
        <style>{styleContent}</style>

        {/* Field markings - same as DrillDiagram */}
        {isB ? (
          <>
            <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke={_dd.ln} strokeWidth="1.5" />
            <line x1="70" y1="2" x2="70" y2="88" stroke={_dd.ln} strokeWidth="1" />
            <circle cx="70" cy="45" r="14" fill="none" stroke={_dd.ln} strokeWidth="1" />
          </>
        ) : isBB ? (
          <>
            <polygon points="70,75 30,40 70,5 110,40" fill="none" stroke={_dd.ln} strokeWidth="1.5" />
            <circle cx="70" cy="45" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </>
        ) : isFB ? (
          <>
            <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" />
            {[28, 47, 70, 93, 112].map((x) => (
              <line key={x} x1={x} y1="2" x2={x} y2="88" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />
            ))}
          </>
        ) : (
          <>
            <rect x="2" y="2" width="136" height="86" rx="4" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
            <line x1="70" y1="2" x2="70" y2="88" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="70" cy="45" r="14" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
          </>
        )}

        {/* Goals */}
        {lay.gl.map((g, i) =>
          g.side ? (
            <rect key={`g${i}`} x={g.x - 3} y={g.y} width={6} height={14} rx="1" fill="none" stroke={_dd.goal} strokeWidth="1" />
          ) : (
            <_Goal key={`g${i}`} x={g.x} y={g.y} />
          )
        )}

        {/* Zigzag path */}
        {lay.zz && (
          <path
            d={(() => {
              let d = `M ${lay.zz.x} ${lay.zz.y}`;
              for (let i = 0; i < lay.zz.seg; i++)
                d += ` L ${lay.zz.x + (i % 2 === 0 ? lay.zz.w : -lay.zz.w)} ${lay.zz.y + (lay.zz.h / lay.zz.seg) * (i + 1)}`;
              return d;
            })()}
            fill="none"
            stroke={_dd.arr}
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
        )}

        {/* Weave path */}
        {lay.weave && (
          <path
            d={(() => {
              const pts = [...lay.weave].sort((a, b) => a.x - b.x);
              if (pts.length < 2) return "";
              let d = `M ${pts[0].x - 8} ${pts[0].y}`;
              pts.forEach((p, i) => {
                d += ` Q ${p.x} ${p.y + (i % 2 === 0 ? -8 : 8)} ${p.x + 7} ${p.y}`;
              });
              return d;
            })()}
            fill="none"
            stroke={_dd.arr}
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />
        )}

        {/* Animated arrows - appear step by step */}
        {lay.ar.map((a, i) => {
          const isVisible = i < visibleArrows;
          const delay = i * staggerDelay;

          if (a.c) {
            // Curved arrow
            const mx = (a.x1 + a.x2) / 2;
            const my = (a.y1 + a.y2) / 2;
            const dx = a.x2 - a.x1;
            const dy = a.y2 - a.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 1) return null;
            const bend = 8;
            const nx = -dy / len;
            const ny = dx / len;
            const cx2 = mx + nx * bend;
            const cy2 = my + ny * bend;
            const ux = (a.x2 - cx2) / Math.sqrt((a.x2 - cx2) ** 2 + (a.y2 - cy2) ** 2);
            const uy = (a.y2 - cy2) / Math.sqrt((a.x2 - cx2) ** 2 + (a.y2 - cy2) ** 2);
            const ax = a.x2 - ux * 2.5;
            const ay = a.y2 - uy * 2.5;
            const px = -uy * 1.5;
            const py = ux * 1.5;

            return (
              <g key={`a${i}`}>
                <path
                  d={`M${a.x1},${a.y1} Q${cx2},${cy2} ${a.x2},${a.y2}`}
                  fill="none"
                  stroke={_dd.arr}
                  strokeWidth="0.8"
                  className={`${animId}-arrow ${isVisible ? "visible" : ""}`}
                  style={{ animationDelay: `${delay}s` }}
                />
                {isVisible && (
                  <polygon
                    points={`${a.x2},${a.y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`}
                    fill={_dd.arr}
                    style={{ animation: `${animId}-fadeIn 0.3s ease-out ${delay + drawDuration * 0.7}s both` }}
                  />
                )}
              </g>
            );
          } else {
            // Straight arrow
            const dx = a.x2 - a.x1;
            const dy = a.y2 - a.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 1) return null;
            const ux = dx / len;
            const uy = dy / len;
            const ax = a.x2 - ux * 2.5;
            const ay = a.y2 - uy * 2.5;
            const px = -uy * 1.5;
            const py = ux * 1.5;

            return (
              <g key={`a${i}`}>
                <line
                  x1={a.x1}
                  y1={a.y1}
                  x2={a.x2}
                  y2={a.y2}
                  stroke={_dd.arr}
                  strokeWidth="0.8"
                  className={`${animId}-arrow ${isVisible ? "visible" : ""}`}
                  style={{ animationDelay: `${delay}s` }}
                />
                {isVisible && (
                  <polygon
                    points={`${a.x2},${a.y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`}
                    fill={_dd.arr}
                    style={{ animation: `${animId}-fadeIn 0.3s ease-out ${delay + drawDuration * 0.7}s both` }}
                  />
                )}
              </g>
            );
          }
        })}

        {/* Cones */}
        {lay.cn.map((cc, i) => (
          <_Cone key={`c${i}`} x={cc.x} y={cc.y} />
        ))}

        {/* Player dots - active ones pulse */}
        {lay.ps.map((p, i) => {
          // Find if this player is the "start" of a currently-visible arrow
          const isActive = lay.ar.some(
            (a, ai) =>
              ai < visibleArrows &&
              Math.abs(a.x1 - p.x) < 6 &&
              Math.abs(a.y1 - p.y) < 6
          );
          return (
            <circle
              key={`p${i}`}
              cx={p.x}
              cy={p.y}
              r={3.5}
              fill={p.t === "A" ? _dd.tA : _dd.tB}
              stroke="white"
              strokeWidth="0.8"
              className={isActive && isPlaying ? `${animId}-dot-active` : ""}
            />
          );
        })}

        {/* Balls */}
        {lay.bl.map((b, i) => (
          <_Ball key={`b${i}`} x={b.x} y={b.y} />
        ))}
      </svg>

      {/* Play/Pause toggle */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        style={{
          position: "absolute",
          bottom: 6,
          right: 6,
          width: 24,
          height: 24,
          borderRadius: 12,
          border: "none",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          lineHeight: 1,
          padding: 0,
        }}
        title={isPlaying ? "Pause animation" : "Play animation"}
      >
        {isPlaying ? "\u275A\u275A" : "\u25B6"}
      </button>

      {/* Step indicator dots */}
      {totalArrows > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 3,
          }}
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                background: i < currentStep ? "white" : "rgba(255,255,255,0.3)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


// ============================================================================

// Keep backward-compatible alias
function MiniField({ seed, sport }) {
  // Legacy fallback: create a minimal drill object from the seed
  const fakeDrill = { id: seed, phase: "game", focus: [], equipment: [], players: [6, 22] };
  return <DrillDiagram drill={fakeDrill} sport={sport} />;
}

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
      const ps = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        ps.push({ x: 100 + Math.cos(angle) * 70, y: 100 + Math.sin(angle) * 70 });
      }
      const result = [];
      for (let i = 0; i < count; i++) {
        const next = (i + 2) % count;
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
          { x: 30, y: 70 }, { x: 120, y: 70 }, { x: 30, y: 70 },
          { x: 210, y: 70 }, { x: 30, y: 70 },
        ],
        delay: 0,
        type: "player",
      },
      {
        waypoints: [
          { x: 30, y: 90 }, { x: 120, y: 90 }, { x: 30, y: 90 },
          { x: 210, y: 90 }, { x: 30, y: 90 },
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
          { x: 100, y: 200 }, { x: 70, y: 160 },
          { x: 90, y: 120 }, { x: 100, y: 40 },
        ],
        delay: 0,
        type: "player",
      },
      {
        waypoints: [
          { x: 100, y: 160 }, { x: 80, y: 140 },
          { x: 95, y: 100 }, { x: 100, y: 50 },
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
      { x: 130, y: 40 }, { x: 130, y: 70 },
      { x: 130, y: 100 }, { x: 130, y: 130 },
      { x: 240, y: 40 }, { x: 240, y: 100 },
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
  const DURATION = 4000;

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
      const t = (elapsed % DURATION) / DURATION;
      setProgress(t);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      startRef.current = null;
    };
  }, [playing]);

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

        {/* Movement paths */}
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

function mapDrillToAnimation(drill) {
  const focus = drill?.focus || drill?.skills?.map((s) => s.toLowerCase()) || [];
  const phase = drill?.phase || drill?.category || "";

  if (focus.some((f) => f.includes("passing")) && phase === "warmup") return "passingCircle";
  if (focus.some((f) => f.includes("1v1"))) return "oneVone";
  if (focus.some((f) => f.includes("agility") || f.includes("speed"))) return "shuttleRun";
  if (phase === "game" || focus.some((f) => f.includes("match"))) return "smallSided";
  if (focus.some((f) => f.includes("fun") || f.includes("relay"))) return "relayRace";
  if (focus.some((f) => f.includes("passing"))) return "passingCircle";
  return "passingCircle";
}

function PageHero({ title, subtitle, actions, gradient }) {
  return (
    <div className="whistle-hero" style={{ background: gradient || `linear-gradient(135deg, ${c.green800} 0%, ${c.green600} 100%)`, borderRadius: 20, padding: "36px 40px", color: c.white, position: "relative", overflow: "hidden", marginBottom: 28 }}>
      <div style={{ position: "absolute", top: -40, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, position: "relative" }}>{title}</h1>
      <p style={{ fontSize: 15, opacity: 0.85, marginBottom: actions ? 20 : 0, maxWidth: 520, lineHeight: 1.5, position: "relative" }}>{subtitle}</p>
      {actions && <div style={{ display: "flex", gap: 10, position: "relative", flexWrap: "wrap" }}>{actions}</div>}
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
function Sidebar({ page, setPage, sport, setSport, sportOpen, setSportOpen, isMobile, sidebarOpen, setSidebarOpen, isPro }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "generate", label: "Generate Plan", icon: Sparkles },
    { key: "plans", label: "Plans", icon: ClipboardList },
    { key: "drills", label: "Drills", icon: Zap },
    { key: "teams", label: "Teams", icon: Users },
    { key: "history", label: "History", icon: Clock },
    { key: "schedule", label: "Schedule", icon: Calendar },
    { key: "messages", label: "Messages", icon: Volume2 },
    { key: "season", label: "Season Plan", icon: CalendarDays },
    { key: "pricing", label: "Pricing", icon: Star },
  ];

  const sidebarWidth = isMobile && !sidebarOpen ? 0 : 240;

  return (
    <aside className="whistle-sidebar" style={{
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
              {item.key === "season" && !isPro && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: c.amber100, color: c.amber700 }}>PRO</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: `1px solid ${c.slate100}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.green100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: c.green700 }}>DC</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: c.slate700 }}>Daniel</div>
          <div style={{ fontSize: 11, color: isPro ? c.green600 : c.slate500, fontWeight: isPro ? 600 : 400 }}>{isPro ? "Pro Plan" : "Free Plan"}</div>
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
    { label: "Drill Library", value: String(drills.length), icon: Zap, gradient: `linear-gradient(135deg, ${c.blue500}, ${c.indigo500})`, onClick: () => setPage("drills") },
    { label: "My Teams", value: String(teamsData.length), icon: Users, gradient: `linear-gradient(135deg, ${c.purple500}, ${c.purple400})`, onClick: () => setPage("teams") },
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
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.blue50, display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart3 size={18} color={c.blue600} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.slate600 }}>Avg Attendance</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.slate800 }}>92%</div>
          <div style={{ fontSize: 12, color: c.green600, fontWeight: 500 }}>+5% from last week</div>
        </div>
        <div style={{ ...cardStyle, padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.amber100, display: "flex", alignItems: "center", justifyContent: "center" }}><Award size={18} color={c.amber500} /></div>
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
function GeneratePlanPage({ sport, setPage, onPlanGenerated, isPro = false, usage }) {
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

  const canGenerate = isPro || (usage && usage.canGeneratePlan);

  const handleGenerate = () => {
    if (!canGenerate) return;
    const plan = generatePlan(config, sport);
    if (usage && !isPro) usage.trackPlanGenerated();
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

      {/* Usage limit banner for free users */}
      {!isPro && usage && (
        <UsageLimitBanner plansRemaining={usage.plansRemaining} plansGenerated={usage.plansGenerated} setPage={setPage} />
      )}

      {/* Sport drill count indicator */}
      {sport !== "Soccer" && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRadius: 12, background: c.green50, border: `1px solid ${c.green200}`, marginBottom: 16 }}>
          <Info size={18} color={c.green600} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: c.green800, lineHeight: 1.5, margin: 0 }}>
            <strong>{sport}</strong> plan generation is live with {(drillsBySport[sport] || []).length} drills across all phases.
          </p>
        </div>
      )}

      {/* Step Indicator */}
      <div style={{ ...cardStyle, padding: "20px 28px", marginBottom: 24 }}>
        <div className="whistle-step-indicator" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 600, transition: "all 0.3s",
                  background: i <= step ? c.green500 : "transparent",
                  color: i <= step ? c.white : c.slate400,
                  border: `2px solid ${i <= step ? c.green500 : c.slate300}`,
                }}>{i < step ? "✓" : i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: i === step ? 600 : 400, color: i <= step ? c.slate800 : c.slate400 }}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div className="whistle-step-connector" style={{ width: 40, height: 2, background: i < step ? c.green500 : c.slate200, transition: "all 0.3s" }} />}
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
                            <div style={{ fontSize: 12, color: c.slate500, marginTop: 2 }}>{team.players.length} players · {team.season}</div>
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
            <div className="whistle-focus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: 10 }}>
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
          <button onClick={() => {
              if (step === 2 && !canGenerate) {
                setPage("pricing");
                return;
              }
              step === 2 ? handleGenerate() : setStep(s => s + 1);
            }}
            disabled={!canProceed()}
            style={{
              padding: "12px 28px", borderRadius: 12, border: "none",
              background: canProceed()
                ? (step === 2 && !canGenerate)
                  ? c.amber500
                  : `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`
                : c.slate200,
              color: canProceed() ? c.white : c.slate400,
              fontWeight: 600, fontSize: 14, cursor: canProceed() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}>
            {step === 2
              ? (canGenerate ? <><Sparkles size={16} /> Generate Plan</> : <><Sparkles size={16} /> Upgrade to Generate</>)
              : <>Continue <ChevronRight size={16} /></>}
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
  let summary = `${sport} Training Plan\n${ageInfo?.label || config.ageGroup} · ${config.playerCount} players · ${plan.reduce((sum, p) => sum + p.phaseDuration, 0)} minutes\n`;
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
  const phaseColorMap = { warmup: c.amber500, technical: c.blue500, tactical: c.purple500, game: c.green500, cooldown: c.cyan500 };
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

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE TIMER
// ═══════════════════════════════════════════════════════════════════════════
function useAudioBeep() {
  const ctxRef = useRef(null);
  const play = useCallback((freq = 880, dur = 0.2, type = "sine") => {
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur);
    } catch (e) { /* ignore audio errors */ }
  }, []);
  const playTransition = useCallback(() => { play(660, 0.15); setTimeout(() => play(880, 0.15), 180); setTimeout(() => play(1100, 0.25), 360); }, [play]);
  const playWarning = useCallback(() => { play(440, 0.1); }, [play]);
  const playFinish = useCallback(() => { play(523, 0.2); setTimeout(() => play(659, 0.2), 220); setTimeout(() => play(784, 0.2), 440); setTimeout(() => play(1047, 0.4), 660); }, [play]);
  return { playTransition, playWarning, playFinish };
}

function PracticeTimer({ plan, config, sport = "Soccer", onExit }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(plan[0]?.phaseDuration * 60 || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);
  const { playTransition, playWarning, playFinish } = useAudioBeep();
  const ageInfo = AGE_GROUPS.find(a => a.value === config.ageGroup);
  const phaseLabels = { "Warm-Up": "warmup", "Technical": "technical", "Tactical": "tactical", "Game": "game", "Cool-Down": "cooldown" };

  const currentDrill = plan[currentIdx];
  const nextDrill = currentIdx < plan.length - 1 ? plan[currentIdx + 1] : null;
  const totalDuration = currentDrill?.phaseDuration * 60 || 1;
  const progress = 1 - (secondsLeft / totalDuration);
  const overallElapsed = plan.slice(0, currentIdx).reduce((s, d) => s + d.phaseDuration * 60, 0) + (totalDuration - secondsLeft);
  const overallTotal = plan.reduce((s, d) => s + d.phaseDuration * 60, 0);
  const overallProgress = overallElapsed / overallTotal;

  useEffect(() => {
    if (!isRunning || isComplete) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Move to next drill
          if (currentIdx < plan.length - 1) {
            if (!isMuted) playTransition();
            setCurrentIdx(i => i + 1);
            return plan[currentIdx + 1].phaseDuration * 60;
          } else {
            // Practice complete
            if (!isMuted) playFinish();
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
        }
        // Warning beep at 30 seconds and 10 seconds
        if (!isMuted && (prev === 31 || prev === 11)) playWarning();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isComplete, currentIdx, isMuted, plan, playTransition, playWarning, playFinish]);

  const skipDrill = () => {
    if (currentIdx < plan.length - 1) {
      if (!isMuted) playTransition();
      setCurrentIdx(i => i + 1);
      setSecondsLeft(plan[currentIdx + 1].phaseDuration * 60);
    } else {
      if (!isMuted) playFinish();
      setIsComplete(true);
      setIsRunning(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const phaseKey = phaseLabels[currentDrill?.phaseLabel] || "technical";
  const color = phaseColorMap[phaseKey] || c.green500;

  if (isComplete) {
    return (
      <div ref={containerRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${c.green800}, ${c.emerald600})`, borderRadius: isFullscreen ? 0 : 20, padding: 40, textAlign: "center", color: c.white }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Practice Complete!</h1>
        <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 8 }}>{ageInfo?.label} · {plan.length} drills · {Math.round(overallTotal / 60)} minutes</p>
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 32 }}>Great work, Coach!</p>
        <button onClick={onExit} style={{ padding: "14px 32px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.15)", color: c.white, fontWeight: 600, fontSize: 16, cursor: "pointer", backdropFilter: "blur(8px)" }}>
          Back to Plan
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{
      minHeight: isFullscreen ? "100vh" : "calc(100vh - 120px)",
      display: "flex", flexDirection: "column",
      background: isFullscreen ? c.slate900 : "transparent",
      borderRadius: isFullscreen ? 0 : 0,
      position: isFullscreen ? "fixed" : "relative",
      top: isFullscreen ? 0 : "auto", left: isFullscreen ? 0 : "auto",
      right: isFullscreen ? 0 : "auto", bottom: isFullscreen ? 0 : "auto",
      zIndex: isFullscreen ? 10000 : "auto",
    }}>
      {/* Top controls bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isFullscreen ? "20px 32px" : "0 0 16px 0" }}>
        <button onClick={onExit} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${c.slate300}`, background: isFullscreen ? "rgba(255,255,255,0.1)" : c.white, color: isFullscreen ? c.white : c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <ChevronLeft size={15} /> Exit Timer
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? "Unmute" : "Mute"} style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${isFullscreen ? "rgba(255,255,255,0.2)" : c.slate200}`, background: isFullscreen ? "rgba(255,255,255,0.1)" : c.white, color: isFullscreen ? c.white : c.slate600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 500, fontSize: 12 }}>
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />} {isMuted ? "Muted" : "Sound On"}
          </button>
          <button onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${isFullscreen ? "rgba(255,255,255,0.2)" : c.slate200}`, background: isFullscreen ? "rgba(255,255,255,0.1)" : c.white, color: isFullscreen ? c.white : c.slate600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontWeight: 500, fontSize: 12 }}>
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />} {isFullscreen ? "Exit Full" : "Full Screen"}
          </button>
        </div>
      </div>

      {/* Overall progress */}
      <div style={{ padding: isFullscreen ? "0 32px" : "0", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: isFullscreen ? "rgba(255,255,255,0.5)" : c.slate400, marginBottom: 4 }}>
          <span>Overall Progress</span>
          <span>Drill {currentIdx + 1} of {plan.length} · {formatTime(Math.round(overallTotal - overallElapsed))} remaining</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: isFullscreen ? "rgba(255,255,255,0.1)" : c.slate200, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 3, background: c.green500, width: `${overallProgress * 100}%`, transition: "width 1s linear" }} />
        </div>
        {/* Phase indicators */}
        <div style={{ display: "flex", marginTop: 6, gap: 2 }}>
          {plan.map((p, i) => {
            const pk = phaseLabels[p.phaseLabel] || "technical";
            return <div key={i} style={{ flex: p.phaseDuration, height: 3, borderRadius: 2, background: i < currentIdx ? (phaseColorMap[pk] || c.green500) : i === currentIdx ? `${phaseColorMap[pk] || c.green500}80` : (isFullscreen ? "rgba(255,255,255,0.08)" : c.slate100) }} />;
          })}
        </div>
      </div>

      {/* Main timer display */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: isFullscreen ? "20px 32px" : "20px",
        background: isFullscreen ? "transparent" : `linear-gradient(135deg, ${c.slate900}, ${c.slate800})`,
        borderRadius: isFullscreen ? 0 : 20, color: c.white,
        minHeight: isFullscreen ? "auto" : 400,
      }}>
        {/* Phase label */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: `${color}30`, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
          <span style={{ fontSize: 13, fontWeight: 600, color, textTransform: "uppercase", letterSpacing: 1 }}>{currentDrill?.phaseLabel}</span>
        </div>

        {/* Drill name */}
        <h2 style={{ fontSize: isFullscreen ? 42 : 32, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>{currentDrill?.name}</h2>

        {/* Circular timer */}
        <div style={{ position: "relative", width: isFullscreen ? 280 : 220, height: isFullscreen ? 280 : 220, margin: "16px 0" }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: isFullscreen ? 56 : 44, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{formatTime(secondsLeft)}</div>
            <div style={{ fontSize: 13, opacity: 0.5, marginTop: 4 }}>of {currentDrill?.phaseDuration} min</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <button onClick={() => setIsRunning(!isRunning)} style={{
            width: isFullscreen ? 72 : 60, height: isFullscreen ? 72 : 60, borderRadius: "50%",
            border: "none", background: isRunning ? "rgba(255,255,255,0.15)" : color,
            color: c.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, transition: "all 0.2s", boxShadow: isRunning ? "none" : `0 4px 20px ${color}60`,
          }}>
            {isRunning ? <Pause size={isFullscreen ? 28 : 24} /> : <Play size={isFullscreen ? 28 : 24} style={{ marginLeft: 3 }} />}
          </button>
          <button onClick={skipDrill} aria-label="Skip to next drill" style={{
            width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)", color: c.white, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SkipForward size={20} />
          </button>
        </div>

        {/* Coaching points (compact) */}
        {currentDrill?.coaching?.length > 0 && (
          <div style={{ marginTop: 24, maxWidth: 500, width: "100%" }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, opacity: 0.4, marginBottom: 8 }}>Coaching Points</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {currentDrill.coaching.slice(0, 3).map((pt, i) => (
                <span key={i} style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.08)", fontSize: 12, opacity: 0.7 }}>{pt}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next up card */}
      {nextDrill && (
        <div style={{
          padding: isFullscreen ? "16px 32px" : "16px 0", marginTop: 12,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: isFullscreen ? "rgba(255,255,255,0.4)" : c.slate400, whiteSpace: "nowrap" }}>Next up</div>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
            background: isFullscreen ? "rgba(255,255,255,0.05)" : c.white,
            borderRadius: 12, border: `1px solid ${isFullscreen ? "rgba(255,255,255,0.08)" : c.slate200}`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `${phaseColorMap[phaseLabels[nextDrill.phaseLabel]] || c.green500}20`,
              color: phaseColorMap[phaseLabels[nextDrill.phaseLabel]] || c.green500,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>{nextDrill.phaseDuration}'</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: isFullscreen ? c.white : c.slate800 }}>{nextDrill.name}</div>
              <div style={{ fontSize: 12, color: isFullscreen ? "rgba(255,255,255,0.4)" : c.slate500 }}>{nextDrill.phaseLabel}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLAN RESULT PAGE (CoachPlan's plan view in Whistle's design language)
function PlanResultPage({ plan: initialPlan, config, sport = "Soccer", setPage, onRegenerate, onSavePlan, onLogPractice, onStartTimer, isPro = false }) {
  const isMobile = useIsMobile();
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
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "flex-start", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Your Training Plan</h1>
            <p style={{ fontSize: 14, color: c.slate500, marginBottom: 4 }}>{ageInfo?.label} · {config.playerCount} players · {totalTime} min · Focus: {config.focusAreas.join(", ")}</p>
            {ageInfo?.philosophy && <p style={{ fontSize: 12, color: c.green600, fontStyle: "italic" }}>{ageInfo.philosophy}</p>}
          </div>
          <div className="whistle-plan-actions" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button onClick={() => { if (onSavePlan) onSavePlan(planTitle); setSaved(true); }} aria-label={saved ? "Plan saved" : "Save plan"} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: saved ? c.green700 : `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, color: c.white, fontWeight: 600, fontSize: 13, cursor: saved ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: saved ? "none" : "0 2px 8px rgba(22,163,74,0.3)", transition: "all 0.3s ease" }}>
              <CheckCircle2 size={15} /> {saved ? "Plan Saved!" : "Save Plan"}
            </button>
            <button onClick={() => {
              if (!isPro) { alert("PDF export is a Pro feature. Upgrade to unlock it!"); return; }
              handlePrintOrExport(plan, config, sport, ageInfo);
            }} aria-label="Export as PDF" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${isPro ? c.slate200 : c.amber200}`, background: isPro ? c.white : "#fffbeb", color: isPro ? c.slate600 : c.amber700, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Download size={15} /> Export PDF {!isPro && <span style={{ ...badgeBase, background: c.amber100, color: c.amber700, fontSize: 10, padding: "2px 6px" }}>PRO</span>}
            </button>
            <button onClick={() => handlePrintOrExport(plan, config, sport, ageInfo)} aria-label="Print plan" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Printer size={15} /> Print
            </button>
            <button onClick={() => handleShare(plan, config, sport, ageInfo)} aria-label="Copy plan to clipboard" style={{ padding: "10px 18px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Copy size={15} /> Copy to Clipboard
            </button>
            <button onClick={() => onStartTimer && onStartTimer(plan)} aria-label="Start practice timer" style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.amber500}, ${c.amber600})`, color: c.white, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 8px rgba(245,158,11,0.3)" }}>
              <Timer size={15} /> Start Practice
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
                    {drill.phaseLabel} · {runningTime}'–{runningTime + drill.phaseDuration}'
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: c.slate800, marginTop: 2 }}>{drill.name}</div>
                </div>
                <div style={{ color: c.slate400, fontSize: 20, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</div>
              </div>

              {expanded && (
                <div style={{ padding: "0 24px 24px 24px", borderTop: `1px solid ${c.slate200}` }}>
                  <p style={{ color: c.slate500, fontSize: 14, lineHeight: 1.7, margin: "16px 0" }}>{drill.description}</p>

                  <div style={{ fontSize: 12, fontWeight: 600, color: color, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Coaching Points</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {drill.coaching?.map((point, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: color, fontSize: 8, marginTop: 6 }}>●</span>
                        <span style={{ color: c.slate700, fontSize: 14, lineHeight: 1.5 }}>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {drill.equipment?.map(e => (
                        <span key={e} style={{ ...badgeBase, background: `${color}12`, color: color, textTransform: "capitalize" }}>{e}</span>
                      ))}
                      <span style={{ ...badgeBase, background: `${color}12`, color: color }}>{drill.players?.[0]}–{drill.players?.[1]} players</span>
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
function DrillsPage({ sport, setPage, setSelectedDrill, isPro = false }) {
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
      <div className="whistle-filter-bar" style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
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
        <div className="whistle-drill-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
          {filtered.map(drill => {
            const cat = categoryColors[drill.category] || categoryColors.technical;
            const isFavorite = favorites.includes(drill.id);
            return (
              <HoverCard key={drill.id}>
                <div style={{ padding: 14, cursor: "pointer" }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }} {...clickableProps(() => { setSelectedDrill(drill); setPage("drill-detail"); })}><AnimatedDrillDiagram drill={drill} sport={sport} isPro={isPro} /></div>
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

// ═══════════════════════════════════════════════════════════════════════════
// DRILL VIDEO TUTORIALS — YouTube coaching clips mapped to drill IDs
// ═══════════════════════════════════════════════════════════════════════════
const DRILL_VIDEOS = {
  // Soccer
  w1: { title: "Fun Tag Dribbling Warm-Up", ytId: "hW4pG7sCDqQ" },
  w2: { title: "Rondo Explained — 4v1 Drill", ytId: "RYUg3dTGM0E" },
  w3: { title: "Sharks & Minnows Dribbling", ytId: "yC0iQFBgTtY" },
  t1: { title: "Perfect Passing Technique", ytId: "xwHy1hLBx_c" },
  t2: { title: "Cone Dribbling Skills", ytId: "1qTq2yFBFgA" },
  t3: { title: "Youth Shooting Technique", ytId: "RqVKKYsPaOY" },
  t4: { title: "First Touch Training", ytId: "N8idRK-LnPQ" },
  t5: { title: "Ball Mastery Drills", ytId: "D1wWMJoQ1fU" },
  t6: { title: "1v1 Attacking Moves", ytId: "Gp1HxnNHnFs" },
  ta1: { title: "3v1 Possession Drill", ytId: "V8-Pm4LSIms" },
  ta2: { title: "Small-Sided Game Tips", ytId: "7sJ7y4HHjKw" },
  ta3: { title: "Defensive Shape Training", ytId: "FUbUMSPhP7I" },
  g1: { title: "Running a Great Scrimmage", ytId: "d9Nj8CEYXGM" },
  // Baseball
  "101": { title: "Dynamic Baseball Warm-Up", ytId: "QwBKPdSHg8c" },
  "103": { title: "Ground Ball Fundamentals", ytId: "cm5GReLj07s" },
  "107": { title: "Batting Tee Progression", ytId: "U0hRLLsBi14" },
  "111": { title: "Relay Cutoff Positioning", ytId: "ULZ-5R2JeBs" },
  // Football
  "201": { title: "Agility Ladder Warm-Up", ytId: "YL_6M8sOjWM" },
  "205": { title: "Route Running Basics", ytId: "KVE5x2Vb-OA" },
  "207": { title: "Tackling Technique", ytId: "JkvNbGq_XBg" },
  // Basketball
  "301": { title: "Ball Handling Warm-Up", ytId: "g3wWRmjhqEI" },
  "303": { title: "Form Shooting Drill", ytId: "aQrjSWKdWYU" },
  "305": { title: "Youth Layup Technique", ytId: "5KwN3cSMbRI" },
  "309": { title: "Give & Go Motion", ytId: "O9ck0n0oW0c" },
};

function VideoTutorial({ drillId }) {
  const video = DRILL_VIDEOS[drillId];
  if (!video) return null;
  return (
    <div style={{ ...cardStyle, padding: 24, marginBottom: 20 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: c.slate600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <Play size={16} style={{ color: c.green600 }} /> Video Tutorial
      </h4>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12 }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.ytId}`}
          title={video.title}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 12 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p style={{ fontSize: 13, color: c.slate500, marginTop: 10, fontWeight: 500 }}>{video.title}</p>
    </div>
  );
}

function DrillDetailPage({ drill, sport, setPage, isPro = false }) {
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
            <span style={{ ...badgeBase, background: c.amber100, color: c.amber700 }}>{drill.intensity} intensity</span>
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
        <AnimatedDrillDiagram drill={drill} sport={sport} isPro={isPro} />
      </div>

      {/* Animated Preview */}
      <div style={{ ...cardStyle, padding: 24, marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: c.slate600, marginBottom: 8 }}>
          Animated Preview
        </h4>
        <DrillAnimation
          drillType={mapDrillToAnimation(drill)}
          sport={sport}
          width={typeof window !== 'undefined' && window.matchMedia("(max-width: 768px)").matches ? 280 : 400}
          height={typeof window !== 'undefined' && window.matchMedia("(max-width: 768px)").matches ? 180 : 260}
        />
      </div>


      {/* Video Tutorial */}
      <VideoTutorial drillId={drill.id} />

      <div className="whistle-drill-detail-grid" style={{ display: "grid", gridTemplateColumns: typeof window !== 'undefined' && window.matchMedia("(max-width: 768px)").matches ? "1fr" : "1fr 320px", gap: 20 }}>
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
                {(plan.focus || []).map(f => <span key={f} style={{ ...badgeBase, background: c.blue100, color: c.blue700, fontSize: 11 }}>{f}</span>)}
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
function TeamsPage({ sport, setPage, setSelectedTeam, isPro = false }) {
  const [teams] = useLocalStorage("teams", defaultTeamsData);
  const canCreateTeam = isPro || teams.length < FREE_LIMITS.maxTeams;
  return (
    <div>
      <PageHero gradient={sportConfig[sport].heroGradient} title={`${sportConfig[sport].emoji} My Teams`}
        subtitle="Manage your teams and rosters"
        actions={<HeroBtn label={canCreateTeam ? "Create Team" : "Upgrade for More Teams"} primary icon={canCreateTeam ? Plus : Sparkles} onClick={() => {
          if (!canCreateTeam) { setPage("pricing"); return; }
          alert("Team creation coming soon!");
        }} />}
      />
      {!isPro && teams.length >= FREE_LIMITS.maxTeams && (
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px", borderRadius: 12, marginBottom: 16,
          background: "#fffbeb", border: "1px solid #fed7aa",
        }}>
          <Info size={18} color="#d97706" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "#92400e", lineHeight: 1.5, margin: 0 }}>
            Free accounts are limited to {FREE_LIMITS.maxTeams} team.{" "}
            <span onClick={() => setPage("pricing")} style={{ fontWeight: 700, cursor: "pointer", textDecoration: "underline" }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setPage("pricing"); }}>
              Upgrade to Pro for unlimited teams
            </span>
          </p>
        </div>
      )}
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

// ─── Pricing Page ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
// STRIPE CHECKOUT INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

const STRIPE_PUBLISHABLE_KEY = typeof window !== "undefined"
  ? window.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_YOUR_KEY_HERE"
  : "";

const PRO_FEATURES = [
  { name: "Season Planning", desc: "Map out your entire season with templates", free: false },
  { name: "PDF Export", desc: "Download practice plans as polished PDFs", free: false },
  { name: "Unlimited Saved Plans", desc: "Save as many practice plans as you need", free: false },
  { name: "Animated Drill Diagrams", desc: "Interactive drill visualizations", free: false },
  { name: "Generate Practice Plans", desc: "AI-powered plan generation", free: true },
  { name: "Drill Library (210+ drills)", desc: "Full access to all drills", free: true },
  { name: "Team Management", desc: "Manage your roster and track attendance", free: true },
  { name: "Practice History", desc: "Log and review past sessions", free: true },
];

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["3 practice plans per month", "Full drill library", "Drill diagrams", "1 team"],
    cta: "Current Plan",
    disabled: true,
    stripePriceId: null,
  },
  {
    name: "Pro",
    price: "$49.99",
    period: "/year",
    description: "Everything you need to run a great season",
    sub: "$4.17/month",
    features: PRO_FEATURES.map((f) => f.name),
    cta: "Start Free Trial",
    popular: true,
    stripePriceId: "price_pro_annual", // Replace with real Stripe price ID
    trial: 14,
  },
];


// ═══════════════════════════════════════════════════════════════════════════
// SCHEDULE PAGE — Practice calendar with RSVP + attendance tracking
// ═══════════════════════════════════════════════════════════════════════════
function SchedulePage({ sport, setPage }) {
  const [events, setEvents] = useLocalStorage("schedule_" + sport, []);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "17:00", type: "practice", location: "", notes: "" });
  const isMobile = useIsMobile();
  const sportTheme = SPORT_THEMES[sport] || SPORT_THEMES.Soccer;

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    const ev = { ...newEvent, id: Date.now().toString(), rsvp: { yes: [], no: [], maybe: [] }, attendance: [] };
    setEvents([...events, ev].sort((a, b) => a.date.localeCompare(b.date)));
    setNewEvent({ title: "", date: "", time: "17:00", type: "practice", location: "", notes: "" });
    setShowForm(false);
  };

  const deleteEvent = (id) => { setEvents(events.filter(e => e.id !== id)); };

  const toggleRSVP = (eventId, status) => {
    setEvents(events.map(e => {
      if (e.id !== eventId) return e;
      const rsvp = { ...e.rsvp };
      ["yes", "no", "maybe"].forEach(s => { rsvp[s] = rsvp[s].filter(n => n !== "Coach"); });
      rsvp[status] = [...rsvp[status], "Coach"];
      return { ...e, rsvp };
    }));
  };

  const toggleAttendance = (eventId, playerName) => {
    setEvents(events.map(e => {
      if (e.id !== eventId) return e;
      const att = e.attendance || [];
      return { ...e, attendance: att.includes(playerName) ? att.filter(n => n !== playerName) : [...att, playerName] };
    }));
  };

  const upcoming = events.filter(e => e.date >= new Date().toISOString().split("T")[0]);
  const past = events.filter(e => e.date < new Date().toISOString().split("T")[0]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Schedule</h1>
          <p style={{ fontSize: 14, color: c.slate500 }}>Manage practices, games & events</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, color: c.white, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      {showForm && (
        <div style={{ ...cardStyle, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: c.slate800, marginBottom: 16 }}>New Event</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Event title" style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none" }} />
            <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none", background: c.white }}>
              <option value="practice">Practice</option>
              <option value="game">Game</option>
              <option value="tournament">Tournament</option>
              <option value="meeting">Team Meeting</option>
            </select>
            <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none" }} />
            <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none" }} />
            <input value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} placeholder="Location" style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none" }} />
            <input value={newEvent.notes} onChange={e => setNewEvent({...newEvent, notes: e.target.value})} placeholder="Notes (optional)" style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={addEvent} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: c.green600, color: c.white, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Save Event</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && !showForm && (
        <div style={{ ...cardStyle, padding: 48, textAlign: "center" }}>
          <Calendar size={40} style={{ color: c.slate300, marginBottom: 12 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: c.slate600, marginBottom: 8 }}>No events yet</h3>
          <p style={{ fontSize: 14, color: c.slate400 }}>Add your first practice or game to get started</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Upcoming ({upcoming.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcoming.map(ev => {
              const typeColors = { practice: { bg: c.green50, color: c.green700 }, game: { bg: c.blue50, color: c.blue700 }, tournament: { bg: c.amber100, color: c.amber700 }, meeting: { bg: c.slate100, color: c.slate600 } };
              const tc = typeColors[ev.type] || typeColors.practice;
              return (
                <div key={ev.id} style={{ ...cardStyle, padding: "18px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 52, textAlign: "center", padding: "8px 0", borderRadius: 10, background: sportTheme.heroGradient, color: c.white }}>
                        <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9 }}>{new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>{new Date(ev.date + "T12:00:00").getDate()}</div>
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 600, color: c.slate800, margin: 0 }}>{ev.title}</h4>
                          <span style={{ ...badgeBase, background: tc.bg, color: tc.color, fontSize: 11 }}>{ev.type}</span>
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 13, color: c.slate500 }}>
                          <span>{ev.time}</span>
                          {ev.location && <span>{ev.location}</span>}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                          {["yes", "no", "maybe"].map(status => (
                            <button key={status} onClick={() => toggleRSVP(ev.id, status)} style={{
                              padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                              border: `1px solid ${(ev.rsvp || {})[status]?.includes("Coach") ? (status === "yes" ? c.green500 : status === "no" ? c.red500 : c.amber500) : c.slate200}`,
                              background: (ev.rsvp || {})[status]?.includes("Coach") ? (status === "yes" ? c.green50 : status === "no" ? c.red50 : "#fffbeb") : c.white,
                              color: (ev.rsvp || {})[status]?.includes("Coach") ? (status === "yes" ? c.green700 : status === "no" ? c.red700 : c.amber700) : c.slate500,
                            }}>
                              {status === "yes" ? "Going" : status === "no" ? "Not going" : "Maybe"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteEvent(ev.id)} style={{ padding: 6, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: c.slate400 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: c.slate500, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Past Events ({past.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {past.map(ev => (
              <div key={ev.id} style={{ ...cardStyle, padding: "14px 18px", opacity: 0.8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: c.slate600 }}>{ev.title}</span>
                    <span style={{ fontSize: 13, color: c.slate400, marginLeft: 8 }}>{new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: (ev.attendance || []).length > 0 ? c.green700 : c.slate400, fontWeight: (ev.attendance || []).length > 0 ? 600 : 400 }}>
                      {(ev.attendance || []).length > 0 ? `${ev.attendance.length} attended` : "No attendance"}
                    </span>
                    <button onClick={() => toggleAttendance(ev.id, "Player" + ((ev.attendance || []).length + 1))} title="Add attendee" style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${c.green200}`, background: c.green50, color: c.green700, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Attended</button>
                    {(ev.attendance || []).length > 0 && (
                      <button onClick={() => { setEvents(events.map(e => e.id === ev.id ? { ...e, attendance: e.attendance.slice(0, -1) } : e)); }} title="Remove last" style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate500, fontSize: 11, cursor: "pointer" }}>−</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// MESSAGES PAGE — Team announcements & communication
// ═══════════════════════════════════════════════════════════════════════════
function MessagesPage({ sport, setPage }) {
  const [messages, setMessages] = useLocalStorage("messages_" + sport, []);
  const [pinned, setPinned] = useLocalStorage("pinned_" + sport, []);
  const [newMsg, setNewMsg] = useState("");
  const [msgType, setMsgType] = useState("announcement");
  const [showCompose, setShowCompose] = useState(false);
  const isMobile = useIsMobile();

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now().toString(),
      text: newMsg,
      type: msgType,
      author: "Coach",
      timestamp: new Date().toISOString(),
      reactions: {},
    };
    setMessages([msg, ...messages]);
    setNewMsg("");
    setShowCompose(false);
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id));
    setPinned(pinned.filter(p => p !== id));
  };

  const togglePin = (id) => {
    setPinned(pinned.includes(id) ? pinned.filter(p => p !== id) : [...pinned, id]);
  };

  const addReaction = (msgId, emoji) => {
    setMessages(messages.map(m => {
      if (m.id !== msgId) return m;
      const reactions = { ...m.reactions };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      return { ...m, reactions };
    }));
  };

  const typeConfig = {
    announcement: { icon: Volume2, label: "Announcement", bg: c.blue50, color: c.blue700, border: c.blue200 },
    alert: { icon: Info, label: "Game Day Alert", bg: c.amber100, color: c.amber700, border: c.amber300 },
    reminder: { icon: Clock, label: "Reminder", bg: c.green50, color: c.green700, border: c.green200 },
    update: { icon: Activity, label: "Update", bg: c.slate100, color: c.slate600, border: c.slate200 },
  };

  const pinnedMsgs = messages.filter(m => pinned.includes(m.id));
  const regularMsgs = messages.filter(m => !pinned.includes(m.id));

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>Messages</h1>
          <p style={{ fontSize: 14, color: c.slate500 }}>Team announcements, alerts & updates</p>
        </div>
        <button onClick={() => setShowCompose(!showCompose)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, color: c.white, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={16} /> New Message
        </button>
      </div>

      {showCompose && (
        <div style={{ ...cardStyle, padding: 24, marginBottom: 24, borderLeft: `3px solid ${c.green500}` }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <button key={key} onClick={() => setMsgType(key)} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${msgType === key ? cfg.border : c.slate200}`,
                background: msgType === key ? cfg.bg : c.white,
                color: msgType === key ? cfg.color : c.slate500,
              }}>{cfg.label}</button>
            ))}
          </div>
          <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Write your message..." rows={3} style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={sendMessage} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: c.green600, color: c.white, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Send</button>
            <button onClick={() => setShowCompose(false)} style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${c.slate200}`, background: c.white, color: c.slate600, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {messages.length === 0 && !showCompose && (
        <div style={{ ...cardStyle, padding: 48, textAlign: "center" }}>
          <Volume2 size={40} style={{ color: c.slate300, marginBottom: 12 }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: c.slate600, marginBottom: 8 }}>No messages yet</h3>
          <p style={{ fontSize: 14, color: c.slate400 }}>Send your first team announcement to get started</p>
        </div>
      )}

      {pinnedMsgs.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: c.slate400, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Pinned</h3>
          {pinnedMsgs.map(msg => {
            const cfg = typeConfig[msg.type] || typeConfig.announcement;
            const TypeIcon = cfg.icon;
            return (
              <div key={msg.id} style={{ ...cardStyle, padding: "16px 20px", marginBottom: 8, borderLeft: `3px solid ${cfg.border}`, background: cfg.bg }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <TypeIcon size={14} style={{ color: cfg.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                      <span style={{ ...badgeBase, background: c.amber100, color: c.amber700, fontSize: 10 }}>Pinned</span>
                      <span style={{ fontSize: 12, color: c.slate400, marginLeft: "auto" }}>{formatTime(msg.timestamp)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: c.slate700, lineHeight: 1.6, margin: 0 }}>{msg.text}</p>
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      {["thumbsup", "fire", "check"].map(emoji => (
                        <button key={emoji} onClick={() => addReaction(msg.id, emoji)} style={{ padding: "3px 10px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, fontSize: 12, cursor: "pointer", color: c.slate500 }}>
                          {emoji === "thumbsup" ? "\u{1F44D}" : emoji === "fire" ? "\u{1F525}" : "✅"} {(msg.reactions || {})[emoji] || ""}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => togglePin(msg.id)} title="Unpin" style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", color: c.amber500 }}><Star size={14} /></button>
                    <button onClick={() => deleteMessage(msg.id)} title="Delete" style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", color: c.slate400 }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {regularMsgs.length > 0 && (
        <div>
          {pinnedMsgs.length > 0 && <h3 style={{ fontSize: 13, fontWeight: 600, color: c.slate400, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Recent</h3>}
          {regularMsgs.map(msg => {
            const cfg = typeConfig[msg.type] || typeConfig.announcement;
            const TypeIcon = cfg.icon;
            return (
              <div key={msg.id} style={{ ...cardStyle, padding: "16px 20px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <TypeIcon size={14} style={{ color: cfg.color }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                      <span style={{ fontSize: 12, color: c.slate400, marginLeft: "auto" }}>{formatTime(msg.timestamp)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: c.slate700, lineHeight: 1.6, margin: 0 }}>{msg.text}</p>
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      {["thumbsup", "fire", "check"].map(emoji => (
                        <button key={emoji} onClick={() => addReaction(msg.id, emoji)} style={{ padding: "3px 10px", borderRadius: 10, border: `1px solid ${c.slate200}`, background: c.white, fontSize: 12, cursor: "pointer", color: c.slate500 }}>
                          {emoji === "thumbsup" ? "\u{1F44D}" : emoji === "fire" ? "\u{1F525}" : "\u2705"} {(msg.reactions || {})[emoji] || ""}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => togglePin(msg.id)} title="Pin" style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", color: c.slate300 }}><Star size={14} /></button>
                    <button onClick={() => deleteMessage(msg.id)} title="Delete" style={{ padding: 4, border: "none", background: "transparent", cursor: "pointer", color: c.slate400 }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function useProAccess() {
  const [isPro, setIsPro] = useLocalStorage("wc_isPro", false);
  const [email] = useLocalStorage("userEmail", "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setIsPro(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("checkout") === "cancel") {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Periodically verify Pro status against Stripe (on load, once per session)
  useEffect(() => {
    if (!email) return;
    const lastCheck = sessionStorage.getItem("wc_proCheckDone");
    if (lastCheck) return; // Only check once per browser session

    fetch(`/api/status?email=${encodeURIComponent(email)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setIsPro(data.isPro);
          sessionStorage.setItem("wc_proCheckDone", "1");
        }
      })
      .catch(() => {
        // Silently fail — keep localStorage value
      });
  }, [email]);

  return { isPro, setIsPro };
}

// ─── Usage Tracking (Free Tier Limits) ──────────────────────────────────
const FREE_LIMITS = {
  plansPerMonth: 3,
  maxTeams: 1,
};

function useUsageTracking() {
  const [usage, setUsage] = useLocalStorage("usageTracking", {
    plansGenerated: 0,
    monthKey: "",
  });

  const currentMonthKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  // Reset counter if month changed
  const getUsage = () => {
    const mk = currentMonthKey();
    if (usage.monthKey !== mk) {
      const reset = { plansGenerated: 0, monthKey: mk };
      setUsage(reset);
      return reset;
    }
    return usage;
  };

  const trackPlanGenerated = () => {
    const mk = currentMonthKey();
    setUsage((prev) => ({
      plansGenerated: (prev.monthKey === mk ? prev.plansGenerated : 0) + 1,
      monthKey: mk,
    }));
  };

  const u = getUsage();
  return {
    plansGenerated: u.plansGenerated,
    plansRemaining: Math.max(0, FREE_LIMITS.plansPerMonth - u.plansGenerated),
    canGeneratePlan: u.plansGenerated < FREE_LIMITS.plansPerMonth,
    maxTeams: FREE_LIMITS.maxTeams,
    trackPlanGenerated,
  };
}

// ─── Pro Gate Component ─────────────────────────────────────────────────
function ProGate({ children, isPro, feature, setPage }) {
  if (isPro) return children;

  return (
    <div style={{
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
    }}>
      <div style={{ filter: "blur(3px)", opacity: 0.5, pointerEvents: "none" }}>
        {children}
      </div>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(4px)",
        borderRadius: 16,
        padding: 32,
        textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: `linear-gradient(135deg, ${c.green100}, ${c.emerald100})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
        }}>
          <Sparkles size={28} color={c.green600} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: c.slate800, marginBottom: 8 }}>
          {feature} is a Pro Feature
        </h3>
        <p style={{ fontSize: 14, color: c.slate500, marginBottom: 20, maxWidth: 320, lineHeight: 1.6 }}>
          Upgrade to Whistle Pro to unlock {feature.toLowerCase()}, unlimited plans, PDF export, and more.
        </p>
        <button
          onClick={() => setPage("pricing")}
          style={{
            padding: "12px 28px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`,
            color: c.white, fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
          }}
        >
          Upgrade to Pro — $49.99/year
        </button>
      </div>
    </div>
  );
}

// ─── Usage Limit Banner ─────────────────────────────────────────────────
function UsageLimitBanner({ plansRemaining, plansGenerated, setPage }) {
  if (plansRemaining > 1) return null;

  const isAtLimit = plansRemaining === 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 20px", borderRadius: 12, marginBottom: 16,
      background: isAtLimit ? "#fef2f2" : "#fffbeb",
      border: `1px solid ${isAtLimit ? "#fecaca" : "#fed7aa"}`,
    }}>
      <Info size={18} color={isAtLimit ? "#dc2626" : "#d97706"} style={{ flexShrink: 0 }} />
      <p style={{ fontSize: 13, color: isAtLimit ? "#991b1b" : "#92400e", lineHeight: 1.5, margin: 0, flex: 1 }}>
        {isAtLimit
          ? `You've used all ${FREE_LIMITS.plansPerMonth} free plans this month.`
          : `${plansRemaining} free plan${plansRemaining === 1 ? "" : "s"} remaining this month.`}
        {" "}
        <span
          onClick={() => setPage("pricing")}
          style={{ fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setPage("pricing"); }}
        >
          Upgrade to Pro for unlimited plans
        </span>
      </p>
    </div>
  );
}

function PricingPagePro({ sport, setPage }) {
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useLocalStorage("userEmail", "");
  const [emailInput, setEmailInput] = useState(email);
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  const handleCheckout = async (tier) => {
    if (!tier.stripePriceId) return;
    if (!emailInput || !emailInput.includes("@")) {
      setError("Please enter a valid email to continue.");
      return;
    }
    setEmail(emailInput);
    setError("");
    setLoading(tier.name);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: tier.stripePriceId,
          email: emailInput,
          successUrl: window.location.origin + "?checkout=success",
          cancelUrl: window.location.origin + "?checkout=cancel",
        }),
      });
      if (!response.ok) throw new Error("Checkout session failed");
      const { sessionUrl } = await response.json();
      window.location.href = sessionUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
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

      {/* Email input */}
      <div style={{
        maxWidth: 480, margin: "0 auto 24px",
        padding: 20, borderRadius: 12,
        background: c.white, border: `1px solid ${c.slate200}`,
      }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: c.slate700, display: "block", marginBottom: 8 }}>
          Your email (for account & receipt)
        </label>
        <input
          type="email"
          value={emailInput}
          onChange={(e) => { setEmailInput(e.target.value); setError(""); }}
          placeholder="coach@example.com"
          style={{
            width: "100%", padding: "12px 16px", borderRadius: 10, fontSize: 14,
            border: `1px solid ${error ? "#fca5a5" : c.slate200}`,
            outline: "none", color: c.slate800,
          }}
        />
        {error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>{error}</p>}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: 16,
        marginBottom: 40,
        maxWidth: 700,
        margin: "0 auto 40px",
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
                14-DAY FREE TRIAL
              </div>
            )}

            <div style={{ padding: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: c.slate800, marginBottom: 4 }}>
                {tier.name}
              </h3>
              <p style={{ fontSize: 13, color: c.slate500, marginBottom: 16 }}>
                {tier.description}
              </p>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: c.slate900 }}>
                  {tier.price}
                </span>
                <span style={{ fontSize: 14, color: c.slate500 }}>{tier.period}</span>
              </div>
              {tier.sub && (
                <p style={{ fontSize: 13, color: c.green600, fontWeight: 600, marginBottom: 16 }}>
                  {tier.sub}
                </p>
              )}
              {!tier.sub && <div style={{ marginBottom: 16 }} />}

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
                    : `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`,
                  color: tier.disabled ? c.slate400 : c.white,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: tier.disabled ? "default" : "pointer",
                  marginBottom: 20,
                  boxShadow: tier.disabled ? "none" : "0 4px 12px rgba(22,163,74,0.3)",
                }}
              >
                {loading === tier.name ? "Redirecting to checkout..." : tier.cta}
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

      {/* Guarantee */}
      <div style={{ textAlign: "center", marginBottom: 40, padding: "0 20px" }}>
        <p style={{ fontSize: 13, color: c.slate500, lineHeight: 1.6 }}>
          14-day free trial · Cancel anytime · No credit card required to start
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════════════════════════════════════════
function Toast({ message, visible, type = "success" }) {
  const bgMap = { success: c.green600, error: c.rose500, info: c.blue500 };
  const iconMap = { success: CheckCircle2, error: X, info: Info };
  const Icon = iconMap[type];
  return (
    <div style={{
      position: "fixed", bottom: visible ? 32 : -80, left: "50%", transform: "translateX(-50%)",
      background: bgMap[type], color: c.white, padding: "14px 28px", borderRadius: 14,
      display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 9999,
      transition: "bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      whiteSpace: "nowrap",
    }}>
      <Icon size={18} />
      {message}
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState({ message: "", visible: false, type: "success" });
  const timerRef = useRef(null);
  const showToast = useCallback((message, type = "success", duration = 3000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, visible: true, type });
    timerRef.current = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), duration);
  }, []);
  return { toast, showToast };
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
        React.createElement("h2", { style: { fontSize: 20, fontWeight: 600, color: c.slate700, marginBottom: 8 } }, "Something went wrong"),
        React.createElement("p", { style: { color: c.slate500, marginBottom: 16 } }, "An error occurred while loading this page."),
        React.createElement("button", { onClick: () => this.setState({ hasError: false, error: null }), style: { padding: "10px 20px", borderRadius: 8, border: "none", background: c.green600, color: c.white, fontWeight: 600, cursor: "pointer" } }, "Try Again")
      );
    }
    return this.props.children;
  }
}

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

const SEASON_CURRICULA = {
  Soccer: {
    "Full Season (12 weeks)": [
      {
        weekNumber: 1,
        title: "Getting Started: Ball Comfort",
        drills: ["w1", "w3", "t5", "t2", "g4"],
        coachingTip: "Keep it fun — this week is about falling in love with the ball.",
      },
      {
        weekNumber: 2,
        title: "Passing Foundations",
        drills: ["w8", "t1", "t4", "t15", "g3"],
        coachingTip: "Lock that ankle on every pass. Repetition builds muscle memory.",
      },
      {
        weekNumber: 3,
        title: "Fitness & Agility Base",
        drills: ["w4", "w7", "t7", "c1", "ta2"],
        coachingTip: "Push players just past comfortable — that is where growth happens.",
      },
      {
        weekNumber: 4,
        title: "Dribbling Under Pressure",
        drills: ["w9", "t6", "t11", "t13", "g4"],
        coachingTip: "Encourage players to try moves and fail — fear of mistakes kills creativity.",
      },
      {
        weekNumber: 5,
        title: "Shooting Technique",
        drills: ["w1", "t3", "t18", "t10", "g1"],
        coachingTip: "Plant foot beside the ball, laces through it. Accuracy before power.",
      },
      {
        weekNumber: 6,
        title: "First Touch & Receiving",
        drills: ["w2", "t4", "t20", "t9", "ta1"],
        coachingTip: "A good first touch is worth more than a fast sprint. Drill it relentlessly.",
      },
      {
        weekNumber: 7,
        title: "Possession & Combination Play",
        drills: ["w8", "ta5", "ta14", "ta9", "g2"],
        coachingTip: "Move after you pass. Triangles everywhere. Praise quick decisions.",
      },
      {
        weekNumber: 8,
        title: "Defending Shape & Pressing",
        drills: ["w4", "ta3", "ta7", "ta13", "g5"],
        coachingTip: "Stay on your feet. The best tackle is the one you never have to make.",
      },
      {
        weekNumber: 9,
        title: "Transition & Counter-Attacks",
        drills: ["w7", "ta4", "ta16", "ta6", "g2"],
        coachingTip: "The first 3 seconds after winning the ball decide everything. Sprint forward.",
      },
      {
        weekNumber: 10,
        title: "Set Pieces & Dead Balls",
        drills: ["w2", "sp1", "sp2", "sp3", "g1"],
        coachingTip: "Games are won and lost on set pieces. Give them the attention they deserve.",
      },
      {
        weekNumber: 11,
        title: "Game Management & Decision Making",
        drills: ["w6", "ta8", "ta12", "ta15", "g7"],
        coachingTip: "Let players solve problems. Ask questions instead of giving answers.",
      },
      {
        weekNumber: 12,
        title: "Match Prep & Peak Performance",
        drills: ["w1", "ta4", "ta10", "g1", "g2"],
        coachingTip: "Light intensity, high confidence. Remind them of how far they have come.",
      },
    ],
  },
  Basketball: {
    "Full Season (12 weeks)": [
      {
        weekNumber: 1,
        title: "Ball Handling & Getting Comfortable",
        drills: [108, 121, 134, 111, 132],
        coachingTip: "Fingertips, not palms. Make them best friends with the ball this week.",
      },
      {
        weekNumber: 2,
        title: "Passing Fundamentals",
        drills: [105, 109, 136, 110, 122],
        coachingTip: "Step into every pass. Call your target's name before you throw.",
      },
      {
        weekNumber: 3,
        title: "Layups & Footwork",
        drills: [101, 102, 112, 113, 120],
        coachingTip: "Inside foot plants, outside knee drives. Repetition on both sides.",
      },
      {
        weekNumber: 4,
        title: "Shooting Form & Accuracy",
        drills: [135, 111, 104, 126, 140],
        coachingTip: "Same routine every shot. Elbow in, follow through, hold the release.",
      },
      {
        weekNumber: 5,
        title: "Dribble Moves & 1v1",
        drills: [106, 107, 138, 139, 131],
        coachingTip: "Eyes up through the cones. The best ball handlers never look down.",
      },
      {
        weekNumber: 6,
        title: "Defensive Fundamentals",
        drills: [105, 113, 114, 103, 133],
        coachingTip: "Defense is effort. Low stance, active hands, never cross your feet.",
      },
      {
        weekNumber: 7,
        title: "Pick & Roll and Screening",
        drills: [135, 119, 128, 137, 116],
        coachingTip: "Screener: be a wall. Ball handler: set up the screen then attack.",
      },
      {
        weekNumber: 8,
        title: "Fast Break & Transition",
        drills: [101, 115, 130, 145, 147],
        coachingTip: "Push the ball ahead. Fill the lanes wide. Make the simple play.",
      },
      {
        weekNumber: 9,
        title: "Team Offense & Motion",
        drills: [136, 129, 125, 124, 116],
        coachingTip: "Pass, don't stand. Every player touches the ball before a shot.",
      },
      {
        weekNumber: 10,
        title: "Help Defense & Rotations",
        drills: [135, 146, 103, 117, 149],
        coachingTip: "See man and ball. Talk on every possession. Rotation drills save games.",
      },
      {
        weekNumber: 11,
        title: "Zone Offense & Pressure Situations",
        drills: [105, 144, 143, 118, 148],
        coachingTip: "Skip passes kill zones. Stay calm when the defense looks different.",
      },
      {
        weekNumber: 12,
        title: "Game Day Prep & Competition",
        drills: [134, 141, 127, 142, 150],
        coachingTip: "Sharpen, don't exhaust. Confidence is the best game-day weapon.",
      },
    ],
  },
  Baseball: {
    "Full Season (12 weeks)": [
      {
        weekNumber: 1,
        title: "Arm Care & Throwing Basics",
        drills: [203, 227, 213, 232, 224],
        coachingTip: "Fingers on top of the ball. Build arm strength gradually — no max effort yet.",
      },
      {
        weekNumber: 2,
        title: "Hitting Fundamentals",
        drills: [204, 205, 201, 214, 225],
        coachingTip: "Load back, stride forward, stay inside the ball. Tee work builds swings.",
      },
      {
        weekNumber: 3,
        title: "Fielding Basics & Footwork",
        drills: [203, 202, 219, 231, 241],
        coachingTip: "Get in front of the ball every time. Two hands, field through it.",
      },
      {
        weekNumber: 4,
        title: "Live Hitting & Pitch Recognition",
        drills: [226, 206, 230, 212, 224],
        coachingTip: "Have a plan before you step in the box. See the ball out of the hand.",
      },
      {
        weekNumber: 5,
        title: "Defensive Positioning & Communication",
        drills: [227, 207, 233, 218, 242],
        coachingTip: "Call it loud and early. Outfielder always has priority on fly balls.",
      },
      {
        weekNumber: 6,
        title: "Baserunning Intelligence",
        drills: [204, 210, 222, 223, 237],
        coachingTip: "Touch inside of the bag with your left foot. Read the ball off the bat.",
      },
      {
        weekNumber: 7,
        title: "Situational Hitting",
        drills: [203, 228, 229, 206, 211],
        coachingTip: "Right situation, right approach. Move runners. Productive outs win games.",
      },
      {
        weekNumber: 8,
        title: "Pitching Development",
        drills: [227, 209, 234, 235, 213],
        coachingTip: "Mechanics first, velocity second. Every pitch has a purpose in the bullpen.",
      },
      {
        weekNumber: 9,
        title: "Cutoffs, Relays & Team Defense",
        drills: [204, 208, 238, 215, 211],
        coachingTip: "Everyone not catching or throwing is backing up. No standing around.",
      },
      {
        weekNumber: 10,
        title: "Advanced Situations",
        drills: [203, 239, 240, 236, 211],
        coachingTip: "Think one play ahead. Know the situation before every pitch.",
      },
      {
        weekNumber: 11,
        title: "Clutch Performance & Mental Game",
        drills: [226, 230, 217, 216, 225],
        coachingTip: "Pressure is a privilege. Slow the game down and trust your preparation.",
      },
      {
        weekNumber: 12,
        title: "Season Review & Competition",
        drills: [227, 212, 211, 224, 243],
        coachingTip: "Celebrate growth over results. Every player improved — remind them.",
      },
    ],
  },
  Football: {
    "Full Season (12 weeks)": [
      {
        weekNumber: 1,
        title: "Conditioning & Movement Fundamentals",
        drills: [303, 304, 327, 330, 325],
        coachingTip: "Build the engine first. Quick feet and proper movement patterns set the foundation.",
      },
      {
        weekNumber: 2,
        title: "Throwing & Catching Basics",
        drills: [329, 305, 306, 320, 326],
        coachingTip: "Grip the laces. Catch with your hands, not your body. Reps build confidence.",
      },
      {
        weekNumber: 3,
        title: "Ball Security & Running",
        drills: [303, 307, 308, 333, 343],
        coachingTip: "Five points of contact. High and tight. Fumbles are the most preventable mistake.",
      },
      {
        weekNumber: 4,
        title: "Route Running & QB Footwork",
        drills: [327, 301, 315, 331, 311],
        coachingTip: "Sharp cuts sell routes. Push off the front foot on drops. Timing is everything.",
      },
      {
        weekNumber: 5,
        title: "Blocking Fundamentals",
        drills: [304, 317, 318, 334, 344],
        coachingTip: "Low man wins. Hands inside, feet keep churning. Blocking wins championships.",
      },
      {
        weekNumber: 6,
        title: "Defensive Techniques",
        drills: [303, 309, 310, 322, 336],
        coachingTip: "Run to where they are going, not where they are. Break down before contact.",
      },
      {
        weekNumber: 7,
        title: "Team Offense Installation",
        drills: [327, 312, 339, 340, 311],
        coachingTip: "Walk through, jog through, then go live. Every player knows their job.",
      },
      {
        weekNumber: 8,
        title: "Team Defense & Coverage",
        drills: [304, 321, 323, 335, 346],
        coachingTip: "Eyes on your key. Zone defenders play the ball, man defenders play the player.",
      },
      {
        weekNumber: 9,
        title: "Special Teams & Situational",
        drills: [327, 324, 337, 338, 313],
        coachingTip: "Special teams are one-third of the game. Lane discipline and effort win here.",
      },
      {
        weekNumber: 10,
        title: "Blitz Pickup & Advanced Reads",
        drills: [303, 316, 342, 332, 341],
        coachingTip: "Count the box. Identify the extra rusher. The hot route is your safety valve.",
      },
      {
        weekNumber: 11,
        title: "Red Zone & Two-Minute Drill",
        drills: [304, 313, 328, 319, 311],
        coachingTip: "Compressed field, compressed time. Make quick decisions and trust your teammates.",
      },
      {
        weekNumber: 12,
        title: "Game Prep & Championship Mindset",
        drills: [327, 312, 340, 311, 345],
        coachingTip: "Sharpen the blade, do not dull it. Light work, high confidence, peak focus.",
      },
    ],
  },
};


// ============================================================================
// SECTION 2: AnimatedDrillDiagram
// Paste AFTER DrillDiagram (around line 909), BEFORE MiniField
// ============================================================================


function SeasonPlannerPage({ sport, setPage, isPro = false }) {
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
    const dayOfWeek = startDate.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    startDate.setDate(startDate.getDate() + daysUntilMonday);
  
    // Check if a curriculum exists for this sport + template
    const curriculum = SEASON_CURRICULA[sport]?.[template.name];
  
    const weeks = [];
    for (let i = 0; i < template.weeks; i++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + i * 7);
      const phase = template.phases.find((p) => p.weeks.includes(i + 1));
      const focusOptions = PROGRESSIVE_FOCUS[sport]?.[phase?.name] || [];
  
      // Look up curriculum entry for this week
      const currWeek = curriculum?.find((cw) => cw.weekNumber === i + 1);
  
      // Build drill objects from IDs if curriculum exists
      const sportDrills = drillsBySport[sport] || [];
      const practiceDrills = currWeek
        ? currWeek.drills
            .map((drillId) => sportDrills.find((d) => d.id === drillId))
            .filter(Boolean)
        : [];
  
      weeks.push({
        id: `w-${Date.now()}-${i}`,
        weekNumber: i + 1,
        date: weekDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        phase: phase?.name || "General",
        phaseColor: phase?.color || c.slate400,
        focus: focusOptions.slice(0, 2),
        practices: [
          {
            id: `p-${Date.now()}-${i}-1`,
            title: currWeek?.title || "",
            status: "planned",
            drills: practiceDrills,
          },
        ],
        completed: false,
        notes: currWeek?.coachingTip ? `Coaching tip: ${currWeek.coachingTip}` : "",
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

  // ── Pro Gate ──
  if (!isPro) {
    return (
      <div>
        <PageHero
          title="Season Planner"
          subtitle="Map out your entire season with progressive training templates."
          gradient={sportConfig[sport]?.heroGradient}
        />
        <ProGate isPro={isPro} feature="Season Planning" setPage={setPage}>
          <div style={{ minHeight: 300, padding: 40 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: c.white, borderRadius: 12, padding: 20, border: `1px solid ${c.slate200}` }}>
                  <div style={{ height: 20, width: "60%", background: c.slate200, borderRadius: 6, marginBottom: 12 }} />
                  <div style={{ height: 14, width: "80%", background: c.slate100, borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 14, width: "70%", background: c.slate100, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          </div>
        </ProGate>
      </div>
    );
  }

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
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: c.slate800 }}>
                    {tmpl.name}
                  </h3>
                  {SEASON_CURRICULA[sport]?.[tmpl.name] && (
                    <span style={{ ...badgeBase, background: c.green100, color: c.green700, fontSize: 10, fontWeight: 700 }}>
                      SEASON-IN-A-BOX
                    </span>
                  )}
                </div>
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
                {/* Week number + date + title */}
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: c.slate800 }}>
                    Week {week.weekNumber}
                  </div>
                  <div style={{ fontSize: 12, color: c.slate400 }}>{week.date}</div>
                  {week.practices?.[0]?.title && (
                    <div style={{ fontSize: 12, fontWeight: 600, color: c.green700, marginTop: 2 }}>{week.practices[0].title}</div>
                  )}
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
                  {week.practices?.[0]?.drills?.length > 0 && (
                    <span style={{ ...badgeBase, background: c.green100, color: c.green700, fontSize: 10 }}>
                      {week.practices[0].drills.length} drills loaded
                    </span>
                  )}
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

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
function LandingPage({ onGetStarted }) {
  const isMobile = useIsMobile();
  const totalDrills = Object.values(drillsBySport).reduce((sum, d) => sum + d.length, 0);

  const features = [
    { icon: Zap, title: "4 Sports, 213+ Drills", desc: "Soccer, Basketball, Baseball, and Football — each with a curated library of age-appropriate drills with coaching points and diagrams." },
    { icon: Sparkles, title: "Smart Plan Generator", desc: "Tell us the age group, session length, and focus — our engine builds a phase-structured practice plan in seconds." },
    { icon: ClipboardList, title: "Practice History", desc: "Log sessions, track attendance, rate practices, and build a record of your coaching journey over the season." },
    { icon: Users, title: "Team Management", desc: "Organize rosters, manage multiple teams, and tailor plans to your specific group size and skill level." },
  ];

  const steps = [
    { num: "1", title: "Set up your team", desc: "Choose your sport, age group, and player count." },
    { num: "2", title: "Generate a plan", desc: "Pick focus areas and duration — the engine handles the rest." },
    { num: "3", title: "Coach with confidence", desc: "Print, export, or pull it up on your phone at practice." },
  ];

  const pricingTiers = [
    { name: "Free", price: "$0", period: "/month", features: ["3 practice plans per month", "Full drill library", "Drill diagrams", "1 team"], cta: "Get Started Free", popular: false },
    { name: "Pro", price: "$49.99", period: "/year", sub: "$4.17/month · Save $21.89/yr", features: ["Unlimited practice plans", "Full drill library", "Animated drill diagrams", "Season-in-a-Box curricula", "Unlimited teams", "PDF export", "Shareable plan links", "Priority support"], cta: "Start Free Trial", popular: true },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: c.slate800, overflowX: "hidden" }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 20px" : "16px 48px", background: c.white, borderBottom: `1px solid ${c.slate100}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16 }}>W</div>
          <span style={{ fontSize: 22, fontWeight: 700, color: c.slate800, letterSpacing: -0.5 }}>Whistle</span>
        </div>
        <button onClick={onGetStarted} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, color: c.white, fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, ${c.green900} 0%, ${c.green700} 40%, ${c.emerald600} 100%)`, padding: isMobile ? "60px 20px" : "100px 48px", color: c.white, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
            {Object.values(sportConfig).map((s, i) => (
              <span key={i} style={{ fontSize: isMobile ? 28 : 36 }}>{s.emoji}</span>
            ))}
          </div>
          <h1 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: -1 }}>
            Practice plans that<br />make coaching easy
          </h1>
          <p style={{ fontSize: isMobile ? 16 : 20, opacity: 0.85, lineHeight: 1.6, marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
            {totalDrills}+ drills across 4 sports. Generate age-appropriate, phase-structured practice plans in seconds — not hours.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onGetStarted} style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: c.white, color: c.green700, fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              <Sparkles size={18} /> Get Started Free
            </button>
            <button onClick={onGetStarted} style={{ padding: "14px 32px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)", color: c.white, fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Play size={18} /> See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: isMobile ? "60px 20px" : "100px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 800, color: c.slate900, marginBottom: 12 }}>Everything a youth coach needs</h2>
          <p style={{ fontSize: 16, color: c.slate500, maxWidth: 520, margin: "0 auto" }}>From drill ideas to full practice plans — Whistle handles the prep so you can focus on coaching.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 24 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{ padding: "28px 28px", borderRadius: 16, border: `1px solid ${c.slate200}`, background: c.white, transition: "box-shadow 0.2s" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: c.green50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={22} color={c.green600} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: c.slate500, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: c.slate50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 800, color: c.slate900, marginBottom: 48 }}>Ready in 3 steps</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, display: "flex", alignItems: "center", justifyContent: "center", color: c.white, fontSize: 24, fontWeight: 800, margin: "0 auto 16px" }}>{s.num}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: c.slate800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: c.slate500, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: isMobile ? "60px 20px" : "100px 48px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 800, color: c.slate900, marginBottom: 12 }}>Simple pricing</h2>
          <p style={{ fontSize: 16, color: c.slate500 }}>Start free. Upgrade when you're ready.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 24 }}>
          {pricingTiers.map(tier => (
            <div key={tier.name} style={{ ...cardStyle, padding: "36px 32px", position: "relative", border: tier.popular ? `2px solid ${c.green500}` : `1px solid ${c.slate200}` }}>
              {tier.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", ...badgeBase, background: c.green600, color: c.white, fontSize: 11 }}>Most Popular</div>}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: c.slate800, textAlign: "center", marginBottom: 8 }}>{tier.name}</h3>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: c.slate900 }}>{tier.price}</span>
                <span style={{ fontSize: 14, color: c.slate500 }}>{tier.period}</span>
              </div>
              {tier.sub && <p style={{ textAlign: "center", fontSize: 13, color: c.green600, fontWeight: 500, marginBottom: 8 }}>{tier.sub}</p>}
              <div style={{ marginTop: 20 }}>
                {tier.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", fontSize: 14, color: c.slate600 }}>
                    <CheckCircle2 size={16} color={c.green500} />{f}
                  </div>
                ))}
              </div>
              <button onClick={onGetStarted} style={{ width: "100%", marginTop: 24, padding: "14px", borderRadius: 12, border: "none", background: tier.popular ? `linear-gradient(135deg, ${c.green500}, ${c.emerald600})` : c.slate100, color: tier.popular ? c.white : c.slate700, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: tier.popular ? "0 2px 8px rgba(22,163,74,0.3)" : "none" }}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? "60px 20px" : "80px 48px", background: `linear-gradient(135deg, ${c.green800} 0%, ${c.emerald600} 100%)`, textAlign: "center", color: c.white }}>
        <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 800, marginBottom: 12 }}>Ready to level up your practices?</h2>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>Join coaches who spend less time planning and more time coaching.</p>
        <button onClick={onGetStarted} style={{ padding: "16px 40px", borderRadius: 14, border: "none", background: c.white, color: c.green700, fontWeight: 700, fontSize: 17, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          <Sparkles size={20} /> Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 48px", textAlign: "center", color: c.slate400, fontSize: 13, background: c.slate900 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.green500}, ${c.emerald600})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 12 }}>W</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: c.slate300 }}>Whistle</span>
        </div>
        <p>Built for youth coaches, by coaches.</p>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function WhistleApp() {
  const isMobile = useIsMobile();
  const isOnline = useOnlineStatus();
  const { isPro, setIsPro } = useProAccess();
  const usage = useUsageTracking();
  const { deferredPrompt, isInstalled, promptInstall } = useInstallPrompt();
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage("isAuthenticated", false);
  const [page, setPage] = useState("dashboard");
  const [sport, setSport] = useLocalStorage("selectedSport", "Soccer");
  const [sportOpen, setSportOpen] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planConfig, setPlanConfig] = useState(null);
  const [planKey, setPlanKey] = useState(0);
  const [timerPlan, setTimerPlan] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, showToast } = useToast();
  const mainRef = useRef(null);

  // Register service worker for PWA offline support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {
        // Service worker not found — expected during development
      });
    }
  }, []);

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
    showToast("Practice plan saved successfully!");
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

  const handleStartTimer = (plan) => {
    setTimerPlan(plan);
    setPage("timer");
  };

  const pages = {
    dashboard: <DashboardPage sport={sport} setPage={setPage} />,
    generate: <GeneratePlanPage sport={sport} setPage={setPage} onPlanGenerated={handlePlanGenerated} isPro={isPro} usage={usage} />,
    "plan-result": generatedPlan && planConfig ? <PlanResultPage key={planKey} plan={generatedPlan} config={planConfig} sport={sport} setPage={setPage} onRegenerate={handleRegenerate} onSavePlan={handleSavePlan} onLogPractice={handleLogPractice} onStartTimer={handleStartTimer} isPro={isPro} /> : null,
    "timer": timerPlan && planConfig ? <PracticeTimer plan={timerPlan} config={planConfig} sport={sport} onExit={() => setPage("plan-result")} /> : null,
    plans: <PlansPage sport={sport} setPage={setPage} />,
    drills: <DrillsPage sport={sport} setPage={setPage} setSelectedDrill={setSelectedDrill} isPro={isPro} />,
    "drill-detail": <DrillDetailPage drill={selectedDrill} sport={sport} setPage={setPage} isPro={isPro} />,
    teams: <TeamsPage sport={sport} setPage={setPage} setSelectedTeam={setSelectedTeam} isPro={isPro} />,
    "team-detail": <TeamDetailPage team={selectedTeam} sport={sport} setPage={setPage} />,
    history: <HistoryPage sport={sport} />,
    schedule: <SchedulePage sport={sport} setPage={setPage} />,
    messages: <MessagesPage sport={sport} setPage={setPage} />,
    season: <SeasonPlannerPage sport={sport} setPage={setPage} isPro={isPro} />,
    pricing: <PricingPagePro sport={sport} setPage={setPage} />,
  };

  if (!isAuthenticated) {
    return <LandingPage onGetStarted={() => setIsAuthenticated(true)} />;
  }

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
        * { box-sizing: border-box; }

        @media (max-width: 768px) {
          body { margin: 0; padding: 0; }

          /* Touch-friendly tap targets */
          button, [role="button"], select, input {
            min-height: 44px;
            min-width: 44px;
          }

          /* Stacking grids */
          .whistle-grid-4, .whistle-grid-3, .whistle-grid-2 {
            grid-template-columns: 1fr !important;
          }

          /* Card layouts */
          .whistle-card-grid {
            grid-template-columns: 1fr !important;
          }

          /* Drill cards stack */
          .whistle-drill-grid {
            grid-template-columns: 1fr !important;
          }

          /* Hero sections */
          .whistle-hero {
            padding: 24px 20px !important;
            border-radius: 14px !important;
          }
          .whistle-hero h1 {
            font-size: 22px !important;
          }

          /* Plan result buttons wrap */
          .whistle-plan-actions {
            flex-direction: column !important;
          }
          .whistle-plan-actions button {
            width: 100% !important;
            justify-content: center !important;
          }

          /* Filter bar stacks */
          .whistle-filter-bar {
            flex-direction: column !important;
          }
          .whistle-filter-bar select {
            width: 100% !important;
          }

          /* Drill detail 2-column to 1-column */
          .whistle-drill-detail-grid {
            grid-template-columns: 1fr !important;
          }

          /* Team roster table */
          .whistle-roster-grid {
            grid-template-columns: 40px 1fr 70px 60px !important;
            gap: 6px !important;
            font-size: 13px !important;
          }

          /* Step indicator wraps */
          .whistle-step-indicator {
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .whistle-step-connector {
            display: none !important;
          }

          /* Wizard cards stack */
          .whistle-wizard-cards {
            flex-direction: column !important;
          }

          /* Focus grid */
          .whistle-focus-grid {
            grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)) !important;
          }
        }

        @media (max-width: 480px) {
          button, [role="button"] {
            font-size: 13px !important;
          }
          .whistle-hero h1 {
            font-size: 20px !important;
          }
          .whistle-hero p {
            font-size: 13px !important;
          }
        }

        /* Print styles */
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .whistle-sidebar, .whistle-mobile-header, .whistle-overlay {
            display: none !important;
          }
          main {
            margin-left: 0 !important;
            padding: 20px !important;
          }
          .whistle-hero {
            background: #f1f5f9 !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          button { display: none !important; }
          @page { margin: 0.5in; }
        }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: c.slate50, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
        onClick={() => {
          if (sportOpen) setSportOpen(false);
          if (isMobile && sidebarOpen) setSidebarOpen(false);
        }}>
        <Sidebar page={page} setPage={setPage} sport={sport} setSport={setSport} sportOpen={sportOpen} setSportOpen={setSportOpen} isMobile={isMobile} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isPro={isPro} />
        {isMobile && sidebarOpen && <div className="whistle-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 999, display: sidebarOpen ? "block" : "none" }} />}
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
            <div className="whistle-mobile-header" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingTop: 4 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Close menu" : "Open menu"} aria-expanded={sidebarOpen} style={{ padding: "8px", borderRadius: 8, border: `1px solid ${c.slate200}`, background: c.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}>
                {sidebarOpen ? <X size={20} color={c.slate800} /> : <Menu size={20} color={c.slate800} />}
              </button>
              <div style={{ fontSize: 16, fontWeight: 600, color: c.slate800 }}>Whistle</div>
            </div>
          )}
          <ErrorBoundary key={page}>{pages[page]}</ErrorBoundary>
        </main>
        <Toast message={toast.message} visible={toast.visible} type={toast.type} />
        <OfflineIndicator isOnline={isOnline} />
        {showInstallBanner && !isInstalled && <InstallBanner deferredPrompt={deferredPrompt} promptInstall={promptInstall} onDismiss={() => setShowInstallBanner(false)} />}
      </div>
    </>
  );
}