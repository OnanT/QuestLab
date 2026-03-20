# QuestLab Frontend Feature Enhancement Plan

## 1. Objective
Transform the user account experience by implementing a comprehensive profile management system, a secure multi-step password recovery flow, and an omnipresent feedback mechanism. The goal is to increase user autonomy and platform quality through high-visibility engagement loops that align with the QuestLab unified design system.

---

## 2. UX Review & Flow Analysis

### Profile Flow
- **Current Gaps**: Users cannot update metadata (school, grade, country) after registration. Profile viewing is currently restricted to dashboard statistics.
- **Improvements**: Centralized settings hub with intuitive tab navigation. Visual confirmation for all updates. Instant avatar preview.

### Password Reset Flow
- **Entry Points**: "Forgot Password?" link on the `LoginPage`.
- **UX Issues**: Generic error messages and multi-field OTP entry can be confusing for younger users.
- **Improvements**: Guided 3-step wizard. Auto-focusing OTP input fields. Clear visual countdown for OTP expiry (15-minute window).

### Feedback Flow
- **Current Gaps**: Users have no formal way to report bugs or suggest features within the app.
- **Improvements**: Floating Action Button (FAB) for contextual feedback (Modal). "Help & Feedback" sidebar entry for long-form suggestions (Page).

---

## 3. Feature Design Decisions

### Profile System
- **Structure**: Multi-tab interface (`Profile`, `Security`, `Preferences`).
- **Avatar System**: 
    - **Selection**: Grid-based gallery of predefined Caribbean characters.
    - **Upload**: Interactive drop-zone with `react-easy-crop` for 1:1 aspect ratio enforcement.
- **State Management**: Local form state synced to `AuthProvider` on successful API response.

### Password Reset
- **Flow**: `Step 1: Identity` (Email) -> `Step 2: Verification` (OTP) -> `Step 3: New Password`.
- **UX Detail**: Masked email display in Step 2 (e.g., `o***n@example.com`) to confirm delivery without compromising privacy.

### Feedback System (Hybrid Approach)
- **Recommendation**: Implement a global `FeedbackTrigger` (FAB) combined with a dedicated `/feedback` route.
- **Reasoning**: Modals provide low-friction reporting during learning sessions (contextual), while pages allow for expansive feature requests and viewing submission history.

---

## 4. Implementation Phases

### Phase 1: Profile System & Avatar Hub
- **Task 1.1**: Build `ProfilePage.jsx` using unified design tokens (Teal-600).
- **Task 1.2**: Create `AvatarSelector.jsx` with support for local SVG assets.
- **Task 1.3**: Implement custom image upload logic with `axios` multipart support.

### Phase 2: Secure Password Recovery
- **Task 2.1**: Develop `ForgotPasswordPage.jsx` (Trigger endpoint).
- **Task 2.2**: Build `ResetPasswordPage.jsx` with a custom `OTPInput` component.
- **Task 2.3**: Implement success redirect with automated username pre-fill on Login.

### Phase 3: Feedback & Engagement
- **Task 3.1**: Design `FeedbackModal.jsx` using Radix UI Dialog primitives.
- **Task 3.2**: Create `FeedbackPage.jsx` for detailed categorized submissions.
- **Task 3.3**: Implement the global `FeedbackFAB` component.

### Phase 4: Route Hardening
- **Task 4.1**: Ensure `ProtectedRoute` logic covers the new Profile and Feedback routes.
- **Task 4.2**: Update `App.tsx` navigation map.

---

## 5. Component Architecture

| Component | Responsibility | Props/State |
| :--- | :--- | :--- |
| `ProfilePage` | User settings container | `user` (from context) |
| `AvatarSelector` | Icon gallery + file trigger | `onSelect`, `currentAvatar` |
| `OTPInput` | Unified 6-digit numeric input | `length`, `onComplete` |
| `FeedbackFAB` | Global floating trigger | `isVisible` (bool) |
| `FeedbackForm` | Shared submission logic | `category`, `lessonId?` |

---

## 6. State Management Strategy
- **Context**: The `user` object in `AuthProvider` will be the single source of truth for profile data.
- **Forms**: Use `react-hook-form` with `zod` for client-side validation (matching backend Pydantic schemas).
- **Toasts**: Use `sonner` for status updates (e.g., "Avatar updated", "OTP sent").

---

## 7. API Integration Points

- **Profile Update**: `PUT /api/users/{id}` (Metadata fields).
- **Avatar Upload**: `POST /api/users/avatar` (Multipart/form-data).
- **Forgot Password**: `POST /api/auth/forgot-password` (Email payload).
- **Reset Password**: `POST /api/auth/reset-password` (OTP + New Pass).
- **Feedback**: `POST /api/feedback/` (Optional `lesson_id`).

---

## 8. Validation & UX Considerations
- **A11Y**: All icon-only buttons (FAB, Avatar remove) must have `aria-label`.
- **Loading States**: Button-level spinners for network-heavy tasks (OTP triggers, image uploads).
- **Error Handling**: Friendly error messages for expired OTPs or unsupported image formats.

---

## 9. Timeline & Milestones

- **Day 1**: Profile UI & Metadata integration.
- **Day 2**: Avatar Selection Gallery & Custom Upload handling.
- **Day 3**: Password Reset Flow (Request & Verification UI).
- **Day 4**: Feedback Modal & FAB implementation.
- **Day 5**: Final QA, Route verification, and Playwright E2E tests.

---

## 10. Final Recommendation
Start by implementing the **Profile System** to leverage the new backend metadata fields. Deploy the **Feedback FAB** simultaneously to allow early users to report any edge cases encountered during the profile transition.

---
*Last Updated: 2026-03-19*  
*Status: Ready for Implementation*