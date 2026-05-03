// DEPRECATION NOTICE:
// This file re-exports from the new modular structure in src/
// The original monolithic whistle-app.jsx has been refactored into a proper multi-file project.
//
// NEW STRUCTURE:
// src/
//   hooks/
//     useIsMobile.js
//     useLocalStorage.js
//   constants/
//     colors.js
//     sports.js
//     defaults.js
//   data/
//     drills.js
//   utils/
//     planGenerator.js
//     planExport.js
//   components/
//     ui/
//       MiniField.jsx
//       PageHero.jsx
//       HeroBtn.jsx
//       HoverCard.jsx
//       Stars.jsx
//       Breadcrumb.jsx
//     Sidebar.jsx
//   pages/
//     DashboardPage.jsx
//     GeneratePlanPage.jsx
//     PlanResultPage.jsx
//     DrillsPage.jsx
//     DrillDetailPage.jsx
//     PlansPage.jsx
//     TeamsPage.jsx
//     TeamDetailPage.jsx
//     HistoryPage.jsx
//     PricingPage.jsx
//   App.jsx (main component - default export)
//   index.js (re-exports from App.jsx)
//
// BACKWARDS COMPATIBILITY:
// Import the app as usual:
// import WhistleApp from './whistle-app-refactored.jsx'
// OR
// import WhistleApp from './src/App.jsx'
//
// All functionality has been preserved. This is purely a structural refactor.

import WhistleApp from "./src/App.jsx";

export default WhistleApp;
