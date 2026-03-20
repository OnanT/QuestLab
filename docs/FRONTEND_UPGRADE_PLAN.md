# QuestLab Frontend Upgrade Plan

## 1. Objective
Transform the QuestLab frontend into a cohesive, mobile-first, and highly accessible educational platform. This upgrade focuses on unifying the design system, improving code maintainability through custom hooks, and ensuring a premium user experience across all stakeholder dashboards.

## 2. Design System & Tokens
We are standardizing on a **Light Teal & Coral** theme, optimized for clarity and student engagement.

### Core Tokens (CSS Variables)
- **Primary**: `#0D9488` (Teal-600) - Main actions.
- **Secondary**: `#F97316` (Orange-500) - Quizzes and warnings.
- **Accent**: `#F59E0B` (Amber-500) - Achievements and points.
- **Background**: `#F8FAFC` (Slate-50) - Page surfaces.
- **Radius**: Consistent scale from `8px` (sm) to `24px` (xl).

## 3. Implementation Phases

### Phase 1: CSS & Design Unification (Foundation)
- **Task 1.1**: Merge `App.css` and `index.css` into a single source of truth.
- **Task 1.2**: Remove "zombie" CSS classes and legacy dark-mode variables.
- **Task 1.3**: Implement utility-first approach using the unified tokens.

### Phase 2: Logic Decoupling (Custom Hooks)
- **Task 2.1**: Create `useDashboardData` to handle student statistics and recent activity.
- **Task 2.2**: (Planned) Create `useParentStudents` and `useTeacherClass` hooks.

### Phase 3: Navigation & Mobile Responsiveness
- **Task 3.1**: Enhance `StudentNav` with a sticky bottom bar for mobile users.
- **Task 3.2**: Improve accessibility by adding `aria-labels` to all icon-only buttons.
- **Task 3.3**: Ensure touch targets meet the 44px minimum for mobile devices.

### Phase 4: Dashboard Refactoring
- **Task 4.1**: **Student Dashboard**: Bento-grid layout, real-time level progress, and animated stat cards.
- **Task 4.2**: **Parent Dashboard**: Standardize layout to match Student UI, improve child progress visibility.
- **Task 4.3**: **Teacher Dashboard**: Enhance class management views and assignment tracking.
- **Task 4.4**: **Admin Dashboard**: Modernize table views and system health monitoring.

### Phase 5: Auth & Onboarding
- **Task 5.1**: Modernize `LoginPage` and `RegisterPage` with consistent branding and improved validation feedback.

## 4. Quality Assurance
- **Playwright Testing**: Automated validation of dashboard stats, navigation flows, and logout logic.
- **Accessibility Audit**: Verify ARIA roles, color contrast (AA standard), and keyboard navigation.
- **Build Verification**: Ensure `docker-compose up --build` results in a clean, high-performance production build.

---
*Last Updated: 2026-03-19*
