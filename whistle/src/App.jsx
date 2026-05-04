import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { useIsMobile } from "./hooks/useIsMobile.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

import { c, phaseColorMap } from "./constants/colors.js";
import { sportConfig, AGE_GROUPS, FOCUS_OPTIONS_BY_SPORT, EQUIPMENT_BY_SPORT, DURATION_OPTIONS } from "./constants/sports.js";
import { defaultPracticePlans, defaultTeamsData, defaultHistoryData } from "./constants/defaults.js";

import { soccerDrillsFull, drillsBySport } from "./data/drills.js";

import { generatePlan, getDrillPool } from "./utils/planGenerator.js";
import { generatePlanTextSummary, generatePrintHTML, handleExportPDF, handlePrint, handleShare } from "./utils/planExport.js";

import { DashboardPage, GeneratePlanPage, PlanResultPage, DrillsPage, DrillDetailPage, PlansPage, TeamsPage, TeamDetailPage, HistoryPage, PricingPage } from "./pages/index.js";

import Sidebar from "./components/Sidebar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";

export default function WhistleApp() {
  const isMobile = useIsMobile();
  const [page, setPage] = useState("dashboard");
  const [prevPage, setPrevPage] = useState(null);
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
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [darkMode]);

  // Page transition tracking
  const handleSetPage = (newPage) => {
    setPrevPage(page);
    setPage(newPage);
    if (isMobile) setSidebarOpen(false);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlanGenerated = (plan, config) => {
    setGeneratedPlan(plan);
    setPlanConfig(config);
    handleSetPage("plan-result");
  };

  const handleSavePlan = (planTitle) => {
    if (!generatedPlan || !planConfig) return;
    const newPlan = {
      id: Math.max(...plans.map((p) => p.id), 0) + 1,
      title: planTitle || `${planConfig.ageGroup} Practice Plan`,
      duration: planConfig.duration,
      age: planConfig.ageGroup,
      date: new Date()
        .toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "2-digit" })
        .replace(/\//g, "/"),
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
      setPlanKey((k) => k + 1);
    }
  };

  const pages = {
    dashboard: <DashboardPage sport={sport} setPage={handleSetPage} />,
    generate: <GeneratePlanPage sport={sport} setPage={handleSetPage} onPlanGenerated={handlePlanGenerated} />,
    "plan-result":
      generatedPlan && planConfig ? (
        <PlanResultPage
          key={planKey}
          plan={generatedPlan}
          config={planConfig}
          sport={sport}
          setPage={handleSetPage}
          onRegenerate={handleRegenerate}
          onSavePlan={handleSavePlan}
          onLogPractice={handleLogPractice}
        />
      ) : null,
    plans: <PlansPage sport={sport} setPage={handleSetPage} />,
    drills: <DrillsPage sport={sport} setPage={handleSetPage} setSelectedDrill={setSelectedDrill} />,
    "drill-detail": <DrillDetailPage drill={selectedDrill} sport={sport} setPage={handleSetPage} />,
    teams: <TeamsPage sport={sport} setPage={handleSetPage} setSelectedTeam={setSelectedTeam} />,
    "team-detail": <TeamDetailPage team={selectedTeam} sport={sport} setPage={handleSetPage} />,
    history: <HistoryPage />,
    pricing: <PricingPage sport={sport} />,
  };

  return (
    <ToastProvider>
      {/* Skip to content link */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "var(--color-surface-alt)",
          fontFamily: "var(--font-family)",
        }}
        onClick={() => {
          if (sportOpen) setSportOpen(false);
          if (isMobile && sidebarOpen) setSidebarOpen(false);
        }}
      >
        {/* Sidebar — hidden on mobile in favor of bottom nav */}
        {!isMobile && (
          <Sidebar
            page={page}
            setPage={handleSetPage}
            sport={sport}
            setSport={setSport}
            sportOpen={sportOpen}
            setSportOpen={setSportOpen}
            isMobile={false}
            sidebarOpen={true}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        )}

        {/* Mobile sidebar overlay */}
        {isMobile && sidebarOpen && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "var(--color-surface-overlay)",
                zIndex: 999,
              }}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <Sidebar
              page={page}
              setPage={handleSetPage}
              sport={sport}
              setSport={setSport}
              sportOpen={sportOpen}
              setSportOpen={setSportOpen}
              isMobile={true}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </>
        )}

        <main
          id="main-content"
          style={{
            marginLeft: isMobile ? 0 : 260,
            flex: 1,
            padding: isMobile ? "var(--space-3) var(--space-4)" : "var(--space-8) var(--space-10)",
            maxWidth: isMobile ? "100%" : 1200,
            position: "relative",
            width: "100%",
            overflow: "hidden",
            paddingBottom: isMobile ? "calc(80px + env(safe-area-inset-bottom, 0px))" : undefined,
          }}
        >
          {/* Mobile header */}
          {isMobile && (
            <div
              className="safe-area-top"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-4)",
                paddingTop: "var(--space-1)",
              }}
            >
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                style={{
                  padding: 8,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 44,
                  minWidth: 44,
                  transition: `all var(--transition-fast)`,
                }}
              >
                {sidebarOpen ? (
                  <X size={20} color="var(--color-text-primary)" />
                ) : (
                  <Menu size={20} color="var(--color-text-primary)" />
                )}
              </button>
              <div
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--weight-bold)",
                  color: "var(--color-text-primary)",
                }}
              >
                Whistle
              </div>
            </div>
          )}

          {/* Page content with transition */}
          <div key={page} className="page-enter">
            {pages[page]}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        {isMobile && (
          <BottomNav
            page={page}
            setPage={handleSetPage}
            onMoreClick={() => setSidebarOpen(true)}
          />
        )}
      </div>
    </ToastProvider>
  );
}
