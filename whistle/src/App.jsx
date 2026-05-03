// Import all dependencies
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Home, ClipboardList, Zap, Users, Clock, Star, ChevronDown, ChevronLeft,
  Plus, Search, Heart, ArrowRight, Calendar, Timer, Target, Trophy,
  TrendingUp, Filter, MoreHorizontal, CheckCircle2, Circle, Sparkles,
  UserPlus, Trash2, BarChart3, Activity, Award, Play, RotateCcw, ChevronRight, Info,
  Download, Printer, Share2, Menu, X,
} from "lucide-react";

// Import hooks
import { useIsMobile } from "./hooks/useIsMobile.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

// Import constants
import { c, phaseColorMap } from "./constants/colors.js";
import { sportConfig, AGE_GROUPS, FOCUS_OPTIONS_BY_SPORT, EQUIPMENT_BY_SPORT, DURATION_OPTIONS } from "./constants/sports.js";
import { defaultPracticePlans, defaultTeamsData, defaultHistoryData } from "./constants/defaults.js";

// Import data
import { soccerDrillsFull, drillsBySport } from "./data/drills.js";

// Import utilities
import { generatePlan, getDrillPool } from "./utils/planGenerator.js";
import { generatePlanTextSummary, generatePrintHTML, handleExportPDF, handlePrint, handleShare } from "./utils/planExport.js";

// Import page components
import { DashboardPage, GeneratePlanPage, PlanResultPage, DrillsPage, DrillDetailPage, PlansPage, TeamsPage, TeamDetailPage, HistoryPage, PricingPage } from "./pages/index.js";

// Import Sidebar component
import Sidebar from "./components/Sidebar.jsx";



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
    history: <HistoryPage />,
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
        <main style={{
          marginLeft: isMobile ? 0 : 240,
          flex: 1,
          padding: isMobile ? "12px 16px" : "28px 36px",
          maxWidth: isMobile ? "100%" : 1200,
          position: "relative",
          width: "100%",
          overflow: "hidden"
        }}>
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingTop: 4 }}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: "8px", borderRadius: 8, border: `1px solid ${c.slate200}`, background: c.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 44 }}>
                {sidebarOpen ? <X size={20} color={c.slate800} /> : <Menu size={20} color={c.slate800} />}
              </button>
              <div style={{ fontSize: 16, fontWeight: 600, color: c.slate800 }}>Whistle</div>
            </div>
          )}
          {pages[page]}
        </main>
      </div>
    </>
  );
}
