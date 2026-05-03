export const defaultPracticePlans = [
  { id: 1, title: "Passing & Movement", duration: 60, age: "U10", date: "4/15/2026", status: "draft", drills: 5, focus: ["passing", "movement"] },
  { id: 2, title: "Defensive Shape", duration: 75, age: "U12", date: "4/12/2026", status: "complete", drills: 5, focus: ["defending", "positioning"] },
  { id: 3, title: "Dribbling Fundamentals", duration: 60, age: "U8", date: "4/10/2026", status: "complete", drills: 5, focus: ["dribbling", "agility"] },
];

export const defaultTeamsData = [
  { id: "t1", name: "Lightning U10", age: "U10", season: "Spring 2026", players: [
    { number: 1, name: "Emily Chen", position: "GK" },
    { number: 2, name: "Lucas Gonzalez", position: "CB" },
    { number: 3, name: "Maya Patel", position: "CB" },
    { number: 4, name: "João Silva", position: "RB" },
    { number: 5, name: "Alex Kim", position: "LB" },
    { number: 6, name: "Sarah Miller", position: "CDM" },
    { number: 7, name: "Daniel Rodriguez", position: "CM" },
    { number: 8, name: "Sofia Bergström", position: "CAM" },
    { number: 9, name: "Marcus Johnson", position: "ST" },
    { number: 10, name: "Amara Okafor", position: "LW" },
    { number: 11, name: "Kai Nakamura", position: "RW" },
    { number: 12, name: "Jessica Watson", position: "CM" },
  ] },
  { id: "t2", name: "Thunderbirds U12", age: "U12", season: "Spring 2026", players: [
    { number: 1, name: "Harper Davis", position: "GK" },
    { number: 2, name: "Oliver Brown", position: "CB" },
    { number: 3, name: "Zara Thompson", position: "CB" },
    { number: 4, name: "Liam Murphy", position: "RB" },
    { number: 5, name: "Ava Anderson", position: "LB" },
  ] },
];

export const defaultHistoryData = [
  { id: "h1", date: "4/10/2026", team: "Lightning U10", plan: "Passing & Movement", duration: 58, attendance: 11, total: 12, rating: 4, notes: "Great energy. Players really clicked with the rondo warm-up." },
  { id: "h2", date: "4/8/2026", team: "Lightning U10", plan: "Defensive Shape", duration: 72, attendance: 10, total: 12, rating: 3, notes: "Good session overall, some younger players struggled with shape concept." },
  { id: "h3", date: "4/5/2026", team: "Lightning U10", plan: "Dribbling Fundamentals", duration: 55, attendance: 12, total: 12, rating: 5, notes: "Best session of the season. 1v1 moves drill was a huge hit." },
];
