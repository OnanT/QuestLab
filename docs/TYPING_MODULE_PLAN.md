# QuestLab Typing Module Implementation Plan: Keys of the Islands

## 🎯 Project Overview

The Typing Module, titled **"Keys of the Islands"**, is a first-class interactive learning feature for QuestLab. It transforms typing practice into a Caribbean-themed adventure where students journey across islands (Nevis, Dominica, St. Kitts, St. Lucia, and Jamaica) to master keyboard skills.

## 🏗 Architecture & Integration Strategy

The module follows the "just another game type" pattern to ensure seamless integration with existing progress, rewards, and dashboard systems.

### Backend

- **Service**: `backend/modules/typing/services/typing_service.py` - Core logic for WPM and accuracy calculation.
- **Router**: `backend/routers/typing.py` - Endpoints for fetching lessons and submitting results.
- **Data Model**: Uses the existing `games` and `game_engines` tables.
- **Engine Name**: `TypingGame` (normalized to `typing` in the frontend).

### Frontend

- **Component**: `frontend/src/components/games/TypingGame/` - Contains the main orchestrator, engine hooks, and UI components.
- **Integration**: Plugs into `GamePlayerPage.jsx` via a new case in the game renderer.
- **Audio System**: Low-latency Web Audio API for feedback, ambient loops, and a `speechSynthesis` fallback for narration.

---

## 📅 Phase-by-Phase Execution

### Phase 1: Backend Foundation

- [x] **Engine Registration**: Register `TypingGame` in the `game_engines` table.
- [x] **Typing Service**: Implement `evaluate_typing(input, target, time)` to calculate:
  - **Accuracy**: (Correct Chars / Total Chars) \* 100.
  - **WPM**: (Chars / 5) / (Minutes).
- [x] **API Endpoints**:
  - `POST /api/typing/complete`: Validates result, saves progress, and awards shells.
  - `GET /api/games?game_type=typing`: Fetches typing-specific content.

### Phase 2: Frontend Engine (Typing V1)

- [x] **Engine Hook (`useTypingEngine`)**: Handles keystroke tracking, per-character state (correct/error/pending), and live stats.
- [x] **Audio Hook (`useAudioEngine`)**: Manages SFX (clicks), ambient loops (waves/forests), and TTS narration.
- [x] **UI Components**:
  - `TargetText`: Displays the sentence with color-coded feedback.
  - `TypingGame`: Main orchestrator handling `onKeyDown` and game states.
  - `ResultModal`: Displays WPM, Accuracy, and Shells earned.

### Phase 3: Content Seeding

- [x] **Seed Data**: 28 lessons across 4 islands (Nevis, St. Kitts, St. Lucia, Jamaica).
- [x] **Difficulty Progression**:
  - Lesson 1-2: Home Row & Center Reach (g, h).
  - Lesson 3-4: Common Vowels (e, i, o, u) & Top Row.
  - Lesson 5: Full Alphabet.
  - Lesson 6: Punctuation & Capitals.
  - Lesson 7: Speed Trials (Full Prose).

---

## 🛠 Technical Specifications

### Game Configuration (JSON)

```json
{
  "type": "typing",
  "title": "Pinneys Beach — Home Row",
  "island": "nevis",
  "config": {
    "target": "aaa sss ddd fff jjj kkk lll",
    "timeLimit": 60,
    "difficulty": "beginner",
    "ambient": "ocean_gentle.ogg",
    "narration": "nevis_01.ogg",
    "flavorText": "The calm waters of Pinneys Beach mirror the calm of the home row..."
  }
}
```

### Reward System

- **Base Reward**: 10 Shells for completion (≥ 80% accuracy).
- **Speed Bonus**: Multiplier based on WPM (e.g., > 40 WPM = 1.5x Shells).
- **Streak Multiplier**: Consecutive correct characters trigger visual "fire" effects and small point boosts.

---

## 🔊 Audio Asset Requirements

Each island location will have a unique ambient soundscape:

- **Nevis**: `ocean_gentle.ogg`, `spring_water.ogg`, `rainforest_birds.ogg`.
- **St. Kitts**: `fortress_wind.ogg`, `train_rhythm.ogg`.
- **Jamaica**: `reggae_beach.ogg`, `waterfall.ogg`.

---

## ✅ Quality & Validation

- [ ] **Unit Tests**: `tests/test_typing.py` for backend stat calculations.
- [ ] **E2E Tests**: Playwright scripts to simulate typing flows and reward validation.
- [ ] **Performance**: Ensure no UI lag on keystrokes; use `useMemo` for per-character rendering.

---

_Plan Generated: 2026-03-23_  
_Status: Phases 1-3 Completed ✅_
