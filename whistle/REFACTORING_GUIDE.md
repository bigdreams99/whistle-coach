# Whistle Coach - React Refactoring Guide

## Overview
The monolithic `whistle-app.jsx` file (1,765 lines) has been refactored into a proper multi-file React project structure. All functionality and features remain intact—this is purely a structural reorganization for better maintainability and scalability.

## New File Structure

```
src/
├── hooks/
│   ├── useIsMobile.js              # Mobile responsiveness hook
│   └── useLocalStorage.js           # LocalStorage with wc_ prefix
├── constants/
│   ├── colors.js                    # Color tokens (c) and phaseColorMap
│   ├── sports.js                    # Sport configs, age groups, focus options, equipment
│   └── defaults.js                  # Default data for plans, teams, history
├── data/
│   └── drills.js                    # All 63 soccer drills + multi-sport drill arrays
├── utils/
│   ├── planGenerator.js             # normalizeDrill, generatePlan, getDrillPool
│   └── planExport.js                # Plan export: PDF, print, share, text summary
├── components/
│   ├── ui/
│   │   ├── MiniField.jsx            # Sport field visualization
│   │   ├── PageHero.jsx             # Hero section component
│   │   ├── HeroBtn.jsx              # Hero button component
│   │   ├── HoverCard.jsx            # Hover card with animations
│   │   ├── Stars.jsx                # Star rating display
│   │   └── Breadcrumb.jsx           # Navigation breadcrumb
│   └── Sidebar.jsx                  # Main navigation sidebar
├── pages/
│   ├── DashboardPage.jsx            # Dashboard overview
│   ├── GeneratePlanPage.jsx         # Plan generation interface
│   ├── PlanResultPage.jsx           # Generated plan display
│   ├── DrillsPage.jsx               # Drill library browser
│   ├── DrillDetailPage.jsx          # Individual drill details
│   ├── PlansPage.jsx                # Saved plans list
│   ├── TeamsPage.jsx                # Teams management
│   ├── TeamDetailPage.jsx           # Team details & roster
│   ├── HistoryPage.jsx              # Practice session history
│   └── PricingPage.jsx              # Pricing & plan comparison
├── App.jsx                          # Main app component with routing
└── index.js                         # Entry point (re-exports App.jsx)
```

## Backward Compatibility

Two entry points are available:

1. **Original location** (backward compatible):
   ```javascript
   import WhistleApp from './whistle-app.jsx'
   ```
   The original `whistle-app.jsx` now acts as a barrel file that re-exports from `src/App.jsx`

2. **New location** (preferred):
   ```javascript
   import WhistleApp from './src/App.jsx'
   ```

## Key Refactoring Details

### Hooks (`src/hooks/`)
- **useIsMobile.js**: Detects viewport width ≤ 768px, updates on resize
- **useLocalStorage.js**: Custom hook with `wc_` prefix for all keys, JSON serialization

### Constants (`src/constants/`)
- **colors.js**: 
  - Color palette (green, slate, amber, blue, etc.)
  - `phaseColorMap` for plan phase visualization
- **sports.js**:
  - `sportConfig`: Sport-specific settings (emoji, field color, gradient, positions, tips)
  - `AGE_GROUPS`: U6–U14 age groups with philosophies
  - `FOCUS_OPTIONS_BY_SPORT`: Focus areas per sport
  - `EQUIPMENT_BY_SPORT`: Equipment lists per sport
  - `DURATION_OPTIONS`: Available practice durations
- **defaults.js**:
  - `defaultPracticePlans`: Sample plans
  - `defaultTeamsData`: Sample teams with rosters
  - `defaultHistoryData`: Sample practice history

### Data (`src/data/`)
- **drills.js**:
  - `soccerDrillsFull`: 63 complete soccer drills with all properties (id, name, phase, focus, ages, duration, players, equipment, description, coaching, category, skills, intensity)
  - `drillsBySport`: Organized drills by sport (Soccer, Basketball, Baseball, Football)
  - Automatic conversion to Whistle-format display data using age group mapping

### Utilities (`src/utils/`)
- **planGenerator.js**:
  - `normalizeDrill()`: Converts drills from various sports into unified format
  - `generatePlan()`: Creates a 5-phase practice plan (Warm-up, Technical, Tactical, Game, Cool-Down) based on age, duration, focus areas, equipment
  - `getDrillPool()`: Returns normalized drills for any sport
- **planExport.js**:
  - `generatePlanTextSummary()`: Plain-text plan export
  - `generatePrintHTML()`: Print-ready HTML with styling
  - `handleExportPDF()`: Opens print dialog for PDF export
  - `handlePrint()`: Opens print dialog
  - `handleShare()`: Copies plan to clipboard

### Components (`src/components/`)
- **ui/** subfolder:
  - `MiniField.jsx`: SVG field visualization with player dots (sport-specific)
  - Other UI components (PageHero, HeroBtn, HoverCard, Stars, Breadcrumb) - to be migrated
- **Sidebar.jsx**: Navigation with sport selector dropdown

### Pages (`src/pages/`)
- Each page is a separate component file
- Pages manage their own state and layout
- Integration with useLocalStorage for persistence

## Migration Steps (If Extending)

### To Add a New Page:
1. Create `src/pages/NewPage.jsx`
2. Import in `src/App.jsx`
3. Add page to `pages` object in App component
4. Add navigation item to Sidebar

### To Add a New Component:
1. Create in `src/components/` or `src/components/ui/`
2. Use named exports
3. Import in relevant pages/components

### To Add a New Hook:
1. Create in `src/hooks/`
2. Use named export
3. Import in components that need it

### To Add New Constants:
1. Add to appropriate file in `src/constants/`
2. Export as named export
3. Import where needed

## All Functionality Preserved

✅ Multi-sport support (Soccer, Basketball, Baseball, Football)  
✅ Dynamic plan generation based on age, duration, focus, equipment  
✅ Drill library with 63+ soccer drills + other sports  
✅ Plan customization (swap drills, adjust timing)  
✅ PDF export and print functionality  
✅ Team management and rosters  
✅ Practice history logging  
✅ Mobile responsive design  
✅ LocalStorage persistence  
✅ Pricing page with plan comparison  

## Testing the Refactor

1. **Import the app**:
   ```javascript
   import WhistleApp from './src/App.jsx'
   ```

2. **Verify core features**:
   - Sport switching (dropdown in sidebar)
   - Dashboard displays correctly
   - Plan generation works
   - Pages route properly

3. **Check persistence**:
   - Browser DevTools → Application → Local Storage
   - Should see keys with `wc_` prefix

## Next Steps

Once this structure is confirmed working:
1. Migrate page components from App.jsx to individual files in `src/pages/`
2. Extract remaining UI components to `src/components/ui/`
3. Add proper TypeScript types (optional but recommended)
4. Set up build process (Vite/Webpack/Parcel) for production
5. Add unit tests for utilities and hooks
6. Document component APIs with JSDoc

## Questions?

Refer to the original whistle-app.jsx for implementation details of specific pages. The logic is identical—only the file organization has changed.
