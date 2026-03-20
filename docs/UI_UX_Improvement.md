QuestLab — UI/UX Improvement
Executive Summary
After a full audit of all four files, here are the five most critical issues:

1. Dual CSS system collision. App.css and index.css define conflicting versions of the same class names — .btn-primary, .progress-bar, .level-badge, .streak-badge, and .sidebar are all duplicated with incompatible styles. This causes unpredictable rendering depending on import order.
2. Hardcoded color values scattered everywhere. The background #FFFDF5 is hardcoded directly on JSX elements in three places (loading state, error state, and the main return). Any future rebrand requires a grep-and-replace hunt across component files instead of a single CSS variable change.
3. The loading skeleton duplicates StudentNav JSX. A full custom nav is manually re-created inside fetchDashboardData's loading block, guaranteeing it drifts out of sync with the real StudentNav over time.
4. Mobile navigation is incomplete. StudentNav hides four critical links (Lessons, Quizzes, Games, Achievements) on mobile with hidden md:flex / hidden sm:block, but the CSS index.css promises a bottom navigation via a @media (max-width: 768px) sidebar override that is never wired up in the JSX. Mobile users have no way to navigate.
5. Accessibility gaps. Icon-only buttons (LogOut, Award, Trophy in StudentNav) have no aria-label. The streak and level stat pills in the nav have no accessible text — screen readers see only the icon. The progressbar in the dashboard has aria-label (good!) but the aria-valuenow is passed a float and aria-valuemin/aria-valuemax are strings, not numbers.

Section 1 — Mobile-First Responsiveness
What's breaking on small screens
The nav collapses to just the logo and user avatar on mobile. Four primary navigation items vanish. There's no bottom nav to replace them, so a mobile user literally cannot go to Lessons, Quizzes, or Games from the dashboard.
The stats grid uses grid-cols-2 md:grid-cols-4 which is fine, but the first card has col-span-2 md:col-span-1, making it double-wide on mobile. This creates a visual imbalance — one large card with two small ones — rather than a consistent 2×2 grid.
Touch targets on the subject list items (p-4 = 16px padding, items roughly 40px tall) fall below the 44px minimum.
Fix 1 — Mobile bottom navigation
Replace StudentNav's mobile-hidden links with a sticky bottom bar. This should live entirely inside StudentNav so the dashboard doesn't need to change:
jsx// StudentNav.jsx — add this after the existing <nav>
// Mobile bottom navigation
export default function StudentNav() {
const { user, logout } = useAuth();
const navigate = useNavigate();
const location = useLocation(); // add this import from react-router-dom

const navLinks = [
{ to: "/dashboard", icon: Home, label: "Home", testId: "mob-nav-home" },
{ to: "/lessons", icon: BookOpen, label: "Lessons", testId: "mob-nav-lessons" },
{ to: "/quizzes", icon: HelpCircle, label: "Quizzes", testId: "mob-nav-quizzes" },
{ to: "/games", icon: Gamepad2, label: "Games", testId: "mob-nav-games" },
{ to: "/achievements", icon: Award, label: "Awards", testId: "mob-nav-achievements" },
];

return (
<>
{/_ existing desktop nav stays exactly as-is _/}

<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
{/_ ... existing content ... _/}
</nav>

      {/* ---- Mobile bottom bar (md+ hidden) ---- */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 flex md:hidden"
        aria-label="Mobile navigation"
      >
        {navLinks.map(({ to, icon: Icon, label, testId }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              data-testid={testId}
              className={`flex flex-col items-center justify-center flex-1 py-2 gap-0.5 min-h-[56px] transition-colors ${
                isActive
                  ? "text-teal-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>

);
}
Then in StudentDashboard.jsx add bottom padding so content isn't hidden behind the bar:
jsx// In the main return's content wrapper, add pb-20 md:pb-0

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-20 md:pb-8">
Fix 2 — Stats grid balance
Change the first card from col-span-2 md:col-span-1 to just col-span-1. This creates a clean 2×2 on mobile and a 1×4 on desktop:
jsx// Before:
<div className="student-card p-4 md:p-5 col-span-2 md:col-span-1">

// After:

<div className="student-card p-4 md:p-5">
Fix 3 — Subject list touch targets
Add min-h-[44px] to the subject link items:
jsx<Link
  key={subject.id}
  to={`/lessons?subject=${subject.id}`}
  className="flex items-center gap-3 p-4 min-h-[44px] hover:bg-slate-50 transition-colors group"
>

Section 2 — Color Scheme & Visual Identity
The problem
There are two competing design directions in this codebase. index.css defines a dark glassmorphism theme (black backgrounds, purple gradients, oklch color tokens). App.css defines a light teal/coral/gold theme. The component files use the light theme via Tailwind classes, making index.css's dark variables largely orphaned.
The right call is to standardize on the light teal theme (it's more appropriate for a student-facing educational product) and clean out the dark mode variables that aren't being used.
Unified design token system
Replace the :root block in App.css and consolidate the orphaned index.css variables into one source of truth:
css/_ App.css — replace the existing :root block with this _/
:root {
/_ Brand _/
--color-primary: #0D9488; /_ teal-600 — main action color _/
--color-primary-light: #CCFBF1; /_ teal-100 — hover backgrounds _/
--color-primary-hover: #0F766E; /_ teal-700 — pressed state _/
--color-secondary: #F97316; /_ orange-500 — quizzes, warnings _/
--color-accent: #F59E0B; /_ amber-500 — points, achievements _/

/_ Surfaces _/
--color-bg: #F8FAFC; /_ slate-50 — page background _/
--color-surface: #FFFFFF; /_ white — cards _/
--color-surface-raised: #F1F5F9; /_ slate-100 — hover states, skeletons _/
--color-border: #E2E8F0; /_ slate-200 _/
--color-border-focus: #99F6E4; /_ teal-200 — focus rings _/

/_ Text _/
--color-text-primary: #0F172A; /_ slate-900 _/
--color-text-secondary: #64748B; /_ slate-500 _/
--color-text-muted: #94A3B8; /_ slate-400 _/

/_ Semantic _/
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;

/_ Spacing scale (use instead of magic numbers) _/
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
}
Then update StudentDashboard.jsx to use the variable instead of the hardcoded hex:
jsx// Before (in 3 places):

<div className="min-h-screen bg-[#FFFDF5]">

// After — use a Tailwind arbitrary value tied to the CSS variable,
// OR add a utility class in App.css:

<div className="min-h-screen bg-[var(--color-bg)]">

Section 3 — Layout, Hierarchy & Spacing
Fix 1 — Eliminate the loading skeleton nav duplication
The entire custom nav in the loading block should be replaced with <StudentNav />. The real nav is already covered by bg-white/80 — it won't flash or break. This removes ~15 lines of drift-prone duplicate JSX:
jsx// Before: 15-line custom nav clone inside the loading return
if (loading) {
return (

<div className="min-h-screen bg-[var(--color-bg)]">
<nav className="sticky top-0 ..."> {/_ ← DELETE THIS ENTIRE NAV CLONE _/}
...
</nav>
<div className="max-w-7xl mx-auto ...">
jsx// After: just reuse StudentNav
if (loading) {
return (
<div className="min-h-screen bg-[var(--color-bg)]">
<StudentNav />
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
Fix 2 — Level progress card spacing
The level progress card has mb-3 before a progress bar that has no label for what it's measuring. Add a subtle "XP" label so the bar isn't orphaned:
jsx// In StudentDashboard.jsx — Level Progress Card

<div className="student-card p-5 md:p-6 mb-6 md:mb-8 bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-200/60">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Level {progress?.level || 1}</p>
        <p className="text-xs text-slate-500">{getPointsToNextLevel()} XP to Level {(progress?.level || 1) + 1}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-2xl font-bold text-teal-700 tabular-nums">{Math.round(getLevelProgress())}%</p>
      <p className="text-xs text-slate-400 uppercase tracking-wide">Progress</p>
    </div>
  </div>
  <div
    className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden"
    role="progressbar"
    aria-valuenow={Math.round(getLevelProgress())}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={`Level ${progress?.level || 1} progress: ${Math.round(getLevelProgress())}%`}
  >
    <div
      className="h-full bg-gradient-to-r from-teal-500 to-sky-500 rounded-full transition-all duration-700 ease-out"
      style={{ width: `${getLevelProgress()}%` }}
    />
  </div>
</div>
Note: aria-valuenow is now Math.round(...) (an integer), and aria-valuemin/aria-valuemax are {0} and {100} (numbers, not strings "0" and "100").
Fix 3 — Games empty state "wasted space"
The empty state currently uses p-12 giving it excessive padding. Reduce to p-8:
jsx// Before:
<div className="student-card p-12 text-center">

// After:

<div className="student-card p-8 text-center">

Section 4 — Code Quality & Best Practices
Fix 1 — Extract data-fetching into a custom hook
fetchDashboardData mixes data normalization, error recovery, and user context updates directly inside the component. Move it out:
js// src/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../App";

export function useDashboardData(updateUser) {
const [progress, setProgress] = useState(null);
const [subjects, setSubjects] = useState([]);
const [recentGames, setRecentGames] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const fetchData = useCallback(async () => {
try {
setLoading(true);
setError(null);

      const [userRes, subjectsRes, gamesRes] = await Promise.all([
        apiClient.get("/users/me"),
        apiClient.get("/subjects/enhanced"),
        apiClient.get("/games/list?limit=4"),
      ]);

      setProgress({
        points:            userRes.data.points || 0,
        level:             userRes.data.level || 1,
        streak:            userRes.data.streak || 0,
        quizzes_completed: 0,
        games_played:      0,
        badges:            userRes.data.badges || [],
      });

      setSubjects(subjectsRes.data);
      setRecentGames(gamesRes.data.slice(0, 4));

      updateUser?.(userRes.data);
    } catch (err) {
      if (err.response?.status === 404 && err.config?.url?.includes("/subjects")) {
        setSubjects([
          { id: 1, name: "Math",    color: "#3B82F6" },
          { id: 2, name: "Science", color: "#10B981" },
        ]);
      } else {
        setError("Unable to load dashboard. Please try again.");
      }
    } finally {
      setLoading(false);
    }

}, [updateUser]);

useEffect(() => { fetchData(); }, [fetchData]);

return { progress, subjects, recentGames, loading, error, refetch: fetchData };
}
Then StudentDashboard.jsx becomes clean:
jsx// StudentDashboard.jsx — top of component
const { user, updateUser } = useAuth();
const { progress, subjects, recentGames, loading, error, refetch } = useDashboardData(updateUser);

```

The `handleLogout` function can also be removed from `StudentDashboard` entirely — it already exists in `StudentNav` and both call the same `logout()`. The duplicate in the dashboard is dead code.

### Fix 2 — Remove zombie CSS from `index.css`

The following classes in `index.css` are entirely overridden by Tailwind utilities in the JSX and are never actually applied. They should be removed:
```

/_ DELETE from index.css — never used in JSX: _/
.questlab-bg { ... } /_ components use bg-[#FFFDF5] directly _/
.sidebar { ... } /_ Tailwind classes handle nav layout _/
.nav-item, .nav-item.active { ... }
.stat-card, .feature-card { ... } /_ components use .student-card from App.css _/
.lesson-card { ... }
.avatar-ring { ... }
.input-glass { ... } /_ no form inputs in these files _/
.leaderboard-row { ... } /_ leaderboard is a separate route _/
.login-container { ... } /_ login is a separate route _/
Also remove the entire block of dark-mode Tailwind theme variables from index.css (.dark { --background: oklch(0.145 0 0); ... }) since the application is using the light theme exclusively. These variables conflict with the teal-branded :root values in App.css.
Fix 3 — Memoize the helper functions
getGameTypeIcon and getGameTypeColor are recreated on every render. Since they only depend on game_engine_id, they can be plain constants or memoized:
jsx// Move these outside the component — they have no closure dependencies
const GAME_TYPE_ICON = {
1: Target,
2: Flame,
3: BookOpen,
4: Gamepad2,
};

const GAME_TYPE_COLOR = {
1: "from-blue-400 to-blue-600",
2: "from-red-400 to-red-600",
3: "from-purple-400 to-purple-600",
4: "from-green-400 to-green-600",
};

// Usage in JSX:
const IconComponent = GAME_TYPE_ICON[game.game_engine_id] ?? Gamepad2;
const colorClass = GAME_TYPE_COLOR[game.game_engine_id] ?? "from-teal-400 to-teal-600";

<div className={`w-12 h-12 bg-gradient-to-br ${colorClass} ...`}>
  <IconComponent className="w-5 h-5 text-white" aria-hidden="true" />
</div>

Section 5 — Accessibility (A11Y)
Fix 1 — Icon-only buttons in StudentNav
Every interactive element that shows only an icon needs an aria-label:
jsx// Before:

<Link to="/achievements" className="p-2 hover:bg-slate-100 rounded-lg ...">
  <Award className="w-5 h-5 text-purple-500" />
</Link>

// After:

<Link
  to="/achievements"
  aria-label="My Achievements"
  className="p-2 hover:bg-slate-100 rounded-lg ..."
>
  <Award className="w-5 h-5 text-purple-500" aria-hidden="true" />
</Link>

// Logout button:
<Button
variant="ghost"
size="icon"
onClick={handleLogout}
aria-label="Log out"
data-testid="logout-btn"

>   <LogOut className="w-5 h-5 text-slate-500" aria-hidden="true" />
> </Button>
> Fix 2 — Stat pills in the nav are invisible to screen readers
> The points and level pills have no text labels announced to assistive technology:
> jsx// Before:

<div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-full">
  <Star className="w-4 h-4 text-amber-600" />
  <span className="font-accent font-semibold text-amber-700 text-sm">{user?.points || 0}</span>
</div>

// After (add aria-label to the container):

<div
  className="flex items-center gap-1.5 bg-amber-100 px-3 py-1.5 rounded-full"
  aria-label={`${user?.points || 0} points`}
>
  <Star className="w-4 h-4 text-amber-600" aria-hidden="true" />
  <span className="font-accent font-semibold text-amber-700 text-sm" aria-hidden="true">
    {user?.points || 0}
  </span>
</div>
Fix 3 — Color contrast
text-slate-500 (#64748B) on white passes AA for large text but fails for small text (contrast ratio ~4.5:1, needs 4.5:1 at exactly the threshold — fine). However the text-xs text-slate-500 uppercase tracking-wide stat labels inside the cards are small + uppercase + light — switch these to text-slate-600 for comfortable contrast:
jsx// Before:
<p className="text-xs text-slate-500 uppercase tracking-wide">Total Points</p>

// After:

<p className="text-xs text-slate-600 uppercase tracking-wide font-medium">Total Points</p>
Fix 4 — Add role="main" to the page content wrapper
jsx// In StudentDashboard.jsx main return:
<main
  role="main"
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-20 md:pb-8"
>
  {/* ... all dashboard content ... */}
</main>

Future-Proofing Recommendations
Here's a diagram of where this refactor leaves you and what to build toward:
::view-transition-group(_),
::view-transition-old(_),
::view-transition-new(\*) {
animation-duration: 0.25s;
animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}
VvisualizeVvisualize show_widgetSpecific library recommendations
Animations — Framer Motion. Your animate-fadeInUp and animate-pulse-slow classes in App.css can be replaced with more controllable exit/enter animations. Specifically, wrap the stats grid and the games grid with <motion.div> variants for staggered reveals:
jsximport { motion } from "framer-motion";

const container = {
hidden: {},
show: { transition: { staggerChildren: 0.08 } },
};
const item = {
hidden: { opacity: 0, y: 16 },
show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// Wrap the stats grid:
<motion.div
variants={container}
initial="hidden"
animate="show"
className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"

> {[/* stat cards */].map((card) => (

    <motion.div variants={item} key={card.key} className="student-card ...">
      {card.content}
    </motion.div>

))}
</motion.div>
Toast notifications — Sonner. When a game is played or a quiz is completed and points update, display a non-intrusive toast:
jsximport { toast } from "sonner";

// On points update:
toast.success(`+${pointsEarned} XP earned!`, {
description: "Keep going to reach the next level.",
duration: 3000,
});
Icon consistency. You're already using Lucide React — that's the right call. One gap: the Flame icon currently doubles as both a game type icon (inside getGameTypeIcon) and a streak indicator in the nav's planned display. Use Zap for speed/game types and keep Flame exclusively for streaks to avoid icon ambiguity.
PWA readiness. Your bottom navigation, sticky header, and data-testid coverage are all perfectly aligned with a PWA approach. Add a manifest.json and a Vite PWA plugin entry when you're ready — the architecture is already there.
