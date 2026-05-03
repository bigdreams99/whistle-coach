import React, { useState } from "react";
import { Search, Heart, Plus, Timer } from "lucide-react";
import { c } from "../constants/colors.js";
import { sportConfig, drillsBySport } from "../constants/sports.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { PageHero, HeroBtn, HoverCard } from "../components/ui/index.js";
import { MiniField } from "../components/ui/MiniField.jsx";

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

export default function DrillsPage({ sport, setPage, setSelectedDrill }) {
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
        actions={<><HeroBtn label="Create Drill" primary icon={Plus} /><HeroBtn label={showFavoritesOnly ? "All Drills" : "Favorites"} icon={Heart} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} /></>}
      />
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: c.slate400 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drills..."
            style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 10, border: `1px solid ${c.slate200}`, fontSize: 14, outline: "none" }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={sel}>
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="tactical">Tactical</option>
          <option value="warmup">Warmup</option>
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
                <div style={{ padding: 14 }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }}><MiniField seed={drill.id} sport={sport} /></div>
                <div style={{ padding: "4px 18px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: c.slate800, cursor: "pointer", flex: 1 }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }}>{drill.name}</h3>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(drill.id); }} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                      <Heart size={16} color={isFavorite ? c.rose500 : c.slate300} fill={isFavorite ? c.rose500 : "none"} />
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: c.slate500, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><Timer size={13} />{drill.duration} min</span>
                  </div>
                  <div style={{ cursor: "pointer" }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }}>
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
