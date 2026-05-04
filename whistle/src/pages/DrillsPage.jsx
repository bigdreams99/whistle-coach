import React, { useState } from "react";
import { Search, Heart, Plus, Timer, Zap } from "lucide-react";
import { sportConfig } from "../constants/sports.js";
import { drillsBySport } from "../data/drills.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { PageHero, HeroBtn, HoverCard, Badge, Input, Select } from "../components/ui/index.js";
import { MiniField } from "../components/ui/MiniField.jsx";

export default function DrillsPage({ sport, setPage, setSelectedDrill }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useLocalStorage("favoriteDrills", []);
  const [heartAnimating, setHeartAnimating] = useState(null);
  const drills = drillsBySport[sport] || [];

  const filtered = drills.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== "all" && d.category !== catFilter) return false;
    if (ageFilter !== "all" && !d.ages.includes(ageFilter)) return false;
    if (showFavoritesOnly && !favorites.includes(d.id)) return false;
    return true;
  });

  const toggleFavorite = (drillId) => {
    setHeartAnimating(drillId);
    setTimeout(() => setHeartAnimating(null), 400);
    if (favorites.includes(drillId)) {
      setFavorites(favorites.filter((id) => id !== drillId));
    } else {
      setFavorites([...favorites, drillId]);
    }
  };

  const categoryBadgeColors = {
    technical: "blue",
    tactical: "purple",
    warmup: "green",
    fitness: "rose",
  };

  return (
    <div>
      <PageHero
        gradient={`linear-gradient(135deg, #0f172a 0%, #334155 100%)`}
        title={`${sportConfig[sport].emoji} Drill Library`}
        subtitle={`Browse ${drills.length} ${sport.toLowerCase()} drills with coaching points and diagrams`}
        actions={
          <>
            <HeroBtn label="Create Drill" primary icon={Plus} />
            <HeroBtn
              label={showFavoritesOnly ? "All Drills" : "Favorites"}
              icon={Heart}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            />
          </>
        }
      />

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-6)", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <Input
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drills..."
          />
        </div>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} aria-label="Filter by category">
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="tactical">Tactical</option>
          <option value="warmup">Warmup</option>
        </Select>
        <Select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)} aria-label="Filter by age group">
          <option value="all">All Ages</option>
          {["U6", "U8", "U10", "U12", "U14"].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          padding: "60px 40px",
          textAlign: "center",
          animation: "fadeInUp 0.3s ease-out",
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
            <Zap size={28} color="var(--color-text-faint)" />
          </div>
          <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", marginBottom: "var(--space-2)" }}>
            No drills found
          </h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", maxWidth: 300, margin: "0 auto" }}>
            Try adjusting your filters or search term to find what you're looking for
          </p>
        </div>
      ) : (
        <div className="stagger-children" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-5)" }}>
          {filtered.map((drill) => {
            const isFavorite = favorites.includes(drill.id);
            const catColor = categoryBadgeColors[drill.category] || "blue";
            return (
              <HoverCard key={drill.id}>
                <div style={{ padding: "var(--space-4)" }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }}>
                  <MiniField seed={drill.id} sport={sport} />
                </div>
                <div style={{ padding: "var(--space-1) var(--space-5) var(--space-5)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-1-5)" }}>
                    <h3
                      style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-bold)", color: "var(--color-text-primary)", cursor: "pointer", flex: 1, lineHeight: "var(--leading-snug)" }}
                      onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }}
                    >
                      {drill.name}
                    </h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(drill.id); }}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      aria-pressed={isFavorite}
                      style={{
                        padding: "6px 8px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "var(--space-2)",
                        minWidth: 32,
                        minHeight: 32,
                      }}
                    >
                      <Heart
                        size={16}
                        color={isFavorite ? "var(--color-accent-rose)" : "var(--color-text-faint)"}
                        fill={isFavorite ? "var(--color-accent-rose)" : "none"}
                        className={heartAnimating === drill.id ? "heart-bounce" : ""}
                        style={{ transition: `color var(--transition-fast)` }}
                      />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: "var(--space-1-5)" }}>
                    <Timer size={13} color="var(--color-text-faint)" />
                    <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", fontWeight: "var(--weight-medium)" }}>{drill.duration} min</span>
                  </div>
                  <div style={{ cursor: "pointer" }} onClick={() => { setSelectedDrill(drill); setPage("drill-detail"); }}>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: "var(--leading-normal)", marginBottom: "var(--space-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {drill.desc || drill.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1-5)" }}>
                      <Badge color={catColor}>{drill.category}</Badge>
                      {(drill.ages || []).slice(0, 3).map((a) => (
                        <Badge key={a} color="green">{a}</Badge>
                      ))}
                      {(drill.ages || []).length > 3 && (
                        <Badge color="gray">+{drill.ages.length - 3}</Badge>
                      )}
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
