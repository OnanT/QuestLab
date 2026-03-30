# Keys of Wai'tukubuli — Full Implementation Plan

**QuestLab Feature Spec | Typing Game Module**

---

## 🎯 Vision

_Keys of Wai'tukubuli_ is a Caribbean-themed typing adventure built as a first-class QuestLab game type. Players journey across the islands of Dominica — unlocking beaches, rainforests, and cultural landmarks — by mastering the keyboard. Audio is woven throughout: ambient soundscapes, key-click feedback, speech narration of lesson text, and reward fanfares.

---

## ✅ Success Criteria (Goal-Backward)

The feature is done when a player can:

1. **Load a lesson** — select "Keys of Wai'tukubuli" from the island map, see a lesson screen with a narrated target sentence and ambient audio.
2. **Complete a lesson** — type the target text, receive real-time per-character feedback (correct = green, error = red), and hear audio cues on error and completion.
3. **Earn rewards** — submit results to `/typing/complete`, have WPM/accuracy calculated server-side, shells awarded via the existing rewards system, and progress reflected on the dashboard.

---

## 🗺️ Architecture Overview

Keys of Wai'tukubuli is **not a standalone system**. It is registered as `"type": "typing"` in the existing games table and rendered by extending `GamePlayerPage.jsx`. The engine, audio system, and UI are isolated within `components/games/TypingGame/`.

```
backend/
  modules/typing/
    services/typing_service.py      ← WPM / accuracy / validation
  routers/typing.py                  ← POST /typing/complete, GET /typing/lesson/{id}

frontend/src/
  components/games/TypingGame/
    TypingGame.jsx                   ← Main orchestrator
    TargetText.jsx                   ← Renders target with per-char state
    KeyboardOverlay.jsx              ← Visual key highlight (optional phase 2)
    ResultModal.jsx                  ← Post-lesson stats + shell award
    hooks/
      useTypingEngine.js             ← Core engine (input, stats, timing)
      useAudioEngine.js              ← All audio logic (Web Audio API)
  assets/audio/typing/
    ambient/                         ← Per-island soundscapes (looping .ogg)
    sfx/                             ← keypress_correct, keypress_error, complete, shells
    narration/                       ← TTS or recorded lesson sentences
```

---

## Phase 0 — Research & Discovery

**Before writing a single line of code**, verify the existing system.

### Task 0.1 — Map the Codebase

```
<files>
  backend/models.py
  backend/routers/games.py
  backend/routers/progress.py
  backend/routers/rewards.py
  frontend/src/pages/GamePlayerPage.jsx
  frontend/src/components/games/
</files>

<action>
  grep -r "game.type" frontend/src/pages/GamePlayerPage.jsx
  grep -r "award_shells\|update_progress" backend/routers/
  grep -r "type.*quiz\|type.*memory" backend/  # find existing game type patterns
</action>

<verify>
  Confirm: What does the `games` table schema look like? Does it have a `type` + `config` JSON column?
  Confirm: What is the exact function signature of award_shells() and update_progress()?
</verify>

<done>
  You have a written note of: game table schema, progress function signatures, GamePlayerPage switch/case structure.
</done>
```

---

## Phase 1 — Backend Foundation (Vertical Slice: DB → API)

### Task 1.1 — Register the Game Type

```
<files>
  backend/models.py (or migration file)
  quest-scripts/seed_enhanced_games.py
</files>

<action>
  Add 7 seed lessons with type "typing" to seed_enhanced_games.py.
  Each lesson maps to a Wai'tukubuli island landmark.
</action>
```

**Seed data schema:**

```json
[
  {
    "type": "typing",
    "engine": "typing_v1",
    "title": "Scotts Head — The Home Row",
    "island": "south",
    "config": {
      "target": "fff jjj fff jjj fj fj fj ddd kkk ddd kkk",
      "timeLimit": 60,
      "difficulty": "beginner",
      "narration": "scotts_head_01.ogg",
      "ambient": "ocean_south.ogg"
    }
  },
  {
    "type": "typing",
    "title": "Boiling Lake — Full Alphabet",
    "island": "interior",
    "config": {
      "target": "the quick brown fox jumps over the lazy dog",
      "timeLimit": 45,
      "difficulty": "intermediate",
      "narration": "boiling_lake_01.ogg",
      "ambient": "rainforest.ogg"
    }
  }
  // ... 5 more lessons, scaling difficulty
]
```

**Lesson Progression:**

| #   | Location           | Difficulty | Keys Introduced            |
| --- | ------------------ | ---------- | -------------------------- |
| 1   | Scotts Head        | Beginner   | Home row: asdf jkl;        |
| 2   | Roseau Market      | Beginner   | Add: g h                   |
| 3   | Morne Trois Pitons | Easy       | Add: e i                   |
| 4   | Trafalgar Falls    | Easy       | Add: w o r u               |
| 5   | Boiling Lake       | Medium     | Full alphabet              |
| 6   | Carib Territory    | Medium     | Punctuation                |
| 7   | Wai'tukubuli Trail | Hard       | Speed run — full sentences |

```
<verify>
  docker compose exec backend python quest-scripts/seed_enhanced_games.py
  # Check: 7 rows with type="typing" exist in games table
</verify>

<done>
  GET /games returns lessons with type="typing" and correct config payloads.
</done>
```

---

### Task 1.2 — Typing Service (Business Logic)

```
<files>
  backend/modules/typing/__init__.py
  backend/modules/typing/services/typing_service.py
  tests/test_typing.py
</files>

<action>
  Implement server-side stat calculation. Never trust frontend numbers.
</action>
```

**typing_service.py:**

```python
from dataclasses import dataclass

@dataclass
class TypingResult:
    accuracy: float
    wpm: float
    errors: int
    passed: bool

def evaluate_typing(input_text: str, target: str, time_ms: int) -> TypingResult:
    """
    Pure function — no side effects, fully testable.
    """
    if time_ms <= 0:
        raise ValueError("time_ms must be positive")

    char_count = min(len(input_text), len(target))
    errors = sum(1 for i in range(char_count) if input_text[i] != target[i])
    errors += abs(len(target) - len(input_text))  # penalize incomplete/over-typed

    accuracy = max(0.0, (len(target) - errors) / len(target) * 100)
    wpm = (len(input_text) / 5) / (time_ms / 60_000)

    return TypingResult(
        accuracy=round(accuracy, 2),
        wpm=round(wpm, 2),
        errors=errors,
        passed=accuracy >= 80.0  # configurable threshold
    )
```

**tests/test_typing.py (write FIRST — RED phase):**

```python
def test_perfect_input():
    r = evaluate_typing("fff jjj", "fff jjj", 5000)
    assert r.accuracy == 100.0
    assert r.errors == 0

def test_errors_reduce_accuracy():
    r = evaluate_typing("fxx jjj", "fff jjj", 5000)
    assert r.errors == 2
    assert r.accuracy < 100.0

def test_empty_input():
    r = evaluate_typing("", "fff jjj", 5000)
    assert r.accuracy == 0.0
    assert not r.passed

def test_wpm_calculation():
    # 10 chars in 6 seconds = (10/5) / (6000/60000) = 2 / 0.1 = 20 WPM
    r = evaluate_typing("ffffffffff", "ffffffffff", 6000)
    assert r.wpm == pytest.approx(20.0, 0.1)
```

```
<verify>
  docker compose exec backend pytest tests/test_typing.py -v
</verify>

<done>
  All 4 tests pass. No existing tests broken.
</done>
```

---

### Task 1.3 — Typing Router

```
<files>
  backend/routers/typing.py
  backend/schemas/typing_schemas.py
  backend/integrate_endpoints.py (or main.py)
</files>
```

**typing_schemas.py:**

```python
class TypingResultSchema(BaseModel):
    game_id: int
    input_text: str
    target: str
    time_ms: int

class TypingResultResponse(BaseModel):
    accuracy: float
    wpm: float
    errors: int
    passed: bool
    shells_awarded: int
```

**typing.py router:**

```python
@router.post("/complete", response_model=TypingResultResponse)
def complete_typing(
    payload: TypingResultSchema,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stats = typing_service.evaluate_typing(
        payload.input_text,
        payload.target,
        payload.time_ms
    )

    update_progress(db, current_user.id, payload.game_id, {
        "accuracy": stats.accuracy,
        "wpm": stats.wpm,
        "completed": stats.passed
    })

    shells = 0
    if stats.passed:
        shells = calculate_shell_reward(stats.accuracy, stats.wpm)
        award_shells(db, current_user.id, shells)

    return { **stats.__dict__, "shells_awarded": shells }

@router.get("/lesson/{id}")
def get_lesson(id: int, db: Session = Depends(get_db)):
    lesson = db.query(Game).filter(Game.id == id, Game.type == "typing").first()
    if not lesson:
        raise HTTPException(404)
    return lesson
```

**Register in integrate_endpoints.py:**

```python
from routers import typing
app.include_router(typing.router, prefix="/typing", tags=["typing"])
```

```
<verify>
  curl -X POST http://localhost:8000/typing/complete \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"game_id":1,"input_text":"fff jjj","target":"fff jjj","time_ms":5000}'
  # Expect: {"accuracy":100.0,"wpm":...,"shells_awarded":10}
</verify>

<done>
  POST /typing/complete returns valid TypingResultResponse. Shells reflected in user balance.
</done>

<commit>
  feat(phase1-typing): add typing service, router, and seed data
</commit>
```

---

## Phase 2 — Frontend Engine

### Task 2.1 — Typing Engine Hook

```
<files>
  frontend/src/components/games/TypingGame/hooks/useTypingEngine.js
</files>
```

**Design principles:** No keystroke stored in global state. Stats computed with `useMemo` only when `input` changes. `startTime` is a ref, not state — prevents re-render on first keypress.

```javascript
// hooks/useTypingEngine.js
import { useState, useRef, useMemo, useCallback } from "react";

export function useTypingEngine(target) {
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef(null);

  const onKeyPress = useCallback(
    (char) => {
      if (isComplete) return;
      if (!startTimeRef.current) startTimeRef.current = Date.now();

      setInput((prev) => {
        const next = prev + char;
        if (next.length >= target.length) setIsComplete(true);
        return next;
      });
    },
    [isComplete, target.length],
  );

  const onBackspace = useCallback(() => {
    if (isComplete) return;
    setInput((prev) => prev.slice(0, -1));
  }, [isComplete]);

  const stats = useMemo(() => {
    if (!startTimeRef.current || input.length === 0) return null;
    const elapsed = Date.now() - startTimeRef.current;
    const errors = input.split("").filter((c, i) => c !== target[i]).length;
    const accuracy = ((input.length - errors) / input.length) * 100;
    const wpm = input.length / 5 / (elapsed / 60_000);
    return {
      accuracy: Math.round(accuracy),
      wpm: Math.round(wpm),
      errors,
      elapsed,
    };
  }, [input, target]);

  const reset = useCallback(() => {
    setInput("");
    setIsComplete(false);
    startTimeRef.current = null;
  }, []);

  // Per-character state array for rendering
  const charStates = useMemo(
    () =>
      target.split("").map((char, i) => ({
        char,
        state:
          i >= input.length
            ? "pending"
            : input[i] === char
              ? "correct"
              : "error",
      })),
    [input, target],
  );

  return {
    input,
    charStates,
    stats,
    isComplete,
    elapsedMs: startTimeRef.current ? Date.now() - startTimeRef.current : 0,
    onKeyPress,
    onBackspace,
    reset,
  };
}
```

---

### Task 2.2 — Audio Engine Hook

Audio is a first-class feature, not an afterthought. All sounds use the **Web Audio API** for low-latency playback — no `<audio>` element per-keystroke.

```
<files>
  frontend/src/components/games/TypingGame/hooks/useAudioEngine.js
  frontend/public/audio/typing/ (audio assets)
</files>
```

```javascript
// hooks/useAudioEngine.js
import { useRef, useEffect, useCallback } from "react";

const SFX = {
  correct: "/audio/typing/sfx/key_correct.ogg",
  error: "/audio/typing/sfx/key_error.ogg",
  complete: "/audio/typing/sfx/complete.ogg",
  shells: "/audio/typing/sfx/shells.ogg",
};

export function useAudioEngine(ambientSrc, narrationSrc) {
  const ctxRef = useRef(null);
  const buffersRef = useRef({});
  const ambientRef = useRef(null);

  // Init AudioContext on first user gesture (browser policy)
  const init = useCallback(async () => {
    if (ctxRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;

    // Preload all SFX buffers
    await Promise.all(
      Object.entries(SFX).map(async ([key, url]) => {
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        buffersRef.current[key] = await ctx.decodeAudioData(buf);
      }),
    );
  }, []);

  // Play a one-shot SFX
  const playSfx = useCallback((key) => {
    const ctx = ctxRef.current;
    const buf = buffersRef.current[key];
    if (!ctx || !buf) return;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  }, []);

  // Start ambient loop
  const startAmbient = useCallback(async () => {
    if (!ctxRef.current || !ambientSrc) return;
    const res = await fetch(ambientSrc);
    const raw = await res.arrayBuffer();
    const buf = await ctxRef.current.decodeAudioData(raw);
    const src = ctxRef.current.createBufferSource();
    const gain = ctxRef.current.createGain();
    gain.gain.value = 0.25; // subtle background
    src.buffer = buf;
    src.loop = true;
    src.connect(gain);
    gain.connect(ctxRef.current.destination);
    src.start(0);
    ambientRef.current = src;
  }, [ambientSrc]);

  const stopAmbient = useCallback(() => {
    ambientRef.current?.stop();
  }, []);

  // Play narration (the lesson's target text, read aloud)
  const playNarration = useCallback(async () => {
    if (!ctxRef.current || !narrationSrc) return;
    const res = await fetch(narrationSrc);
    const raw = await res.arrayBuffer();
    const buf = await ctxRef.current.decodeAudioData(raw);
    const src = ctxRef.current.createBufferSource();
    src.buffer = buf;
    src.connect(ctxRef.current.destination);
    src.start(0);
  }, [narrationSrc]);

  useEffect(() => () => stopAmbient(), []);

  return { init, playSfx, startAmbient, stopAmbient, playNarration };
}
```

**Audio asset requirements:**

| File                 | Description                | Suggested Style       |
| -------------------- | -------------------------- | --------------------- |
| `key_correct.ogg`    | Satisfying soft tick       | Wooden drum tap       |
| `key_error.ogg`      | Subtle wrong note          | Low steel pan note    |
| `complete.ogg`       | Lesson complete fanfare    | Steel pan riff (1.5s) |
| `shells.ogg`         | Shell reward jingle        | Waves + coins (2s)    |
| `ocean_south.ogg`    | Scotts Head ambient loop   | Ocean waves           |
| `rainforest.ogg`     | Interior island ambient    | Rainforest birds      |
| `scotts_head_01.ogg` | Narration: lesson 1 target | TTS or recorded voice |

> 💡 Use `Web Speech API` (`speechSynthesis`) as a zero-asset fallback for narration if audio files are not yet produced.

---

### Task 2.3 — TypingGame Component

```
<files>
  frontend/src/components/games/TypingGame/TypingGame.jsx
  frontend/src/components/games/TypingGame/TargetText.jsx
  frontend/src/components/games/TypingGame/ResultModal.jsx
</files>
```

**TargetText.jsx** — renders each character with colour state:

```jsx
// TargetText.jsx
export function TargetText({ charStates, currentIndex }) {
  return (
    <p className="text-2xl font-mono tracking-widest leading-loose select-none">
      {charStates.map(({ char, state }, i) => (
        <span
          key={i}
          className={[
            state === "correct" ? "text-green-400" : "",
            state === "error" ? "text-red-500 bg-red-900/30" : "",
            state === "pending" ? "text-gray-400" : "",
            i === currentIndex ? "border-b-2 border-yellow-400" : "",
          ].join(" ")}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
}
```

**TypingGame.jsx — full orchestrator:**

```jsx
import { useEffect, useRef } from "react";
import { useTypingEngine } from "./hooks/useTypingEngine";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { TargetText } from "./TargetText";
import { ResultModal } from "./ResultModal";
import axios from "../../api/axios";

export default function TypingGame({ config, gameId, onComplete }) {
  const { target, timeLimit, ambient, narration } = config;
  const engine = useTypingEngine(target);
  const audio = useAudioEngine(
    `/audio/typing/ambient/${ambient}`,
    `/audio/typing/narration/${narration}`,
  );
  const prevLenRef = useRef(0);
  const hasSubmittedRef = useRef(false);

  // Init audio on first keydown (respects browser autoplay policy)
  const handleKeyDown = async (e) => {
    if (e.metaKey || e.ctrlKey) return;
    await audio.init();
    await audio.startAmbient();

    if (e.key === "Backspace") {
      engine.onBackspace();
      return;
    }
    if (e.key.length === 1) {
      engine.onKeyPress(e.key);
    }
  };

  // Per-keystroke audio feedback
  useEffect(() => {
    const len = engine.input.length;
    if (len === 0 || len === prevLenRef.current) return;
    prevLenRef.current = len;
    const lastIdx = len - 1;
    const isCorrect = engine.charStates[lastIdx]?.state === "correct";
    audio.playSfx(isCorrect ? "correct" : "error");
  }, [engine.input]);

  // Submit on completion
  useEffect(() => {
    if (!engine.isComplete || hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    audio.playSfx("complete");
    audio.stopAmbient();

    axios
      .post("/typing/complete", {
        game_id: gameId,
        input_text: engine.input,
        target,
        time_ms: engine.elapsedMs,
      })
      .then(({ data }) => {
        if (data.shells_awarded > 0) audio.playSfx("shells");
        onComplete?.(data);
      });
  }, [engine.isComplete]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-900 to-teal-900 flex flex-col items-center justify-center p-8 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      autoFocus
    >
      {/* Island header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-yellow-300">{config.title}</h2>
        <button
          className="mt-2 text-sm text-teal-300 underline"
          onClick={audio.playNarration}
        >
          🔊 Listen to lesson
        </button>
      </div>

      {/* Target text display */}
      <div className="bg-black/30 rounded-2xl p-8 w-full max-w-3xl mb-6">
        <TargetText
          charStates={engine.charStates}
          currentIndex={engine.input.length}
        />
      </div>

      {/* Live stats bar */}
      {engine.stats && (
        <div className="flex gap-8 text-white text-lg">
          <span>⚡ {engine.stats.wpm} WPM</span>
          <span>🎯 {engine.stats.accuracy}%</span>
          <span>❌ {engine.stats.errors} errors</span>
        </div>
      )}

      {engine.isComplete && (
        <ResultModal stats={engine.stats} onRetry={engine.reset} />
      )}
    </div>
  );
}
```

---

### Task 2.4 — Wire into GamePlayerPage

```
<files>
  frontend/src/pages/GamePlayerPage.jsx
</files>

<action>
  Add the typing case to the existing game type switch.
</action>
```

```jsx
import TypingGame from "../components/games/TypingGame/TypingGame";

// Inside the switch:
case "typing":
  return (
    <TypingGame
      config={game.config}
      gameId={game.id}
      onComplete={(result) => handleGameComplete(result)}
    />
  );
```

```
<verify>
  npx playwright test tests/typing_game.spec.js
  # Or manually: load a typing lesson, type the target, confirm modal appears with correct stats
</verify>

<done>
  Level 3 Wired: GamePlayerPage renders TypingGame → user types → POST /typing/complete fires → shells awarded.
</done>

<commit>
  feat(phase2-typing): add TypingGame component, engine hooks, audio engine, GamePlayerPage integration
</commit>
```

---

## Phase 3 — Polish & Engagement Systems

### 3.1 — Keyboard Overlay (Visual Key Hints)

For beginner lessons, render an interactive keyboard that highlights the **expected next key** and shows **which finger** to use. This is disabled for difficulty ≥ intermediate.

```
<files>
  frontend/src/components/games/TypingGame/KeyboardOverlay.jsx
</files>

<action>
  Render a static SVG keyboard layout.
  Calculate nextExpectedKey from engine.input.length and target string.
  Apply a CSS pulse animation to the matching key element.
  Color-code by finger (index = yellow, middle = blue, ring = green, pinky = red).
</action>
```

---

### 3.2 — Streaks & Combo Multiplier

Track consecutive correct characters. Award a "fire streak" UI badge at 10, 20, 50 correct in a row. Multiply shell reward by streak tier:

| Streak | Multiplier | Visual |
| ------ | ---------- | ------ |
| 0-9    | 1x         | —      |
| 10-19  | 1.5x       | 🔥     |
| 20-49  | 2x         | 🔥🔥   |
| 50+    | 3x         | 🌋     |

Implement in `useTypingEngine.js` — track `currentStreak` and `maxStreak`, pass to backend in `POST /typing/complete` payload.

---

### 3.3 — Island Map Unlock Flow

Completing a lesson with ≥ 80% accuracy **unlocks** the next island location on the Wai'tukubuli trail map. Implement as a visual overlay using the existing progress system — no new DB tables needed, store `unlocked_locations` as JSON in the user's progress record.

---

### 3.4 — Speech Synthesis Fallback

If narration `.ogg` files aren't ready yet, use the Web Speech API as a zero-asset fallback:

```javascript
const speakLesson = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85; // slightly slower for learning
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
};
```

Wire this into `useAudioEngine.playNarration()` as the fallback branch when the `.ogg` fetch 404s.

---

## Phase 4 — Testing

### Backend

```bash
# Run new tests
docker compose exec backend pytest tests/test_typing.py -v

# Run full suite — confirm no regressions
docker compose exec backend pytest -v
```

### Frontend (Playwright)

```javascript
// tests/typing_game.spec.js
test("completes a lesson and awards shells", async ({ page }) => {
  await page.goto("/game/1");
  await page.focus(".typing-area");

  // Type the target text
  const target = "fff jjj fff jjj";
  await page.keyboard.type(target);

  // Expect result modal
  await expect(page.locator(".result-modal")).toBeVisible();
  await expect(page.locator(".wpm-display")).toContainText(/\d+ WPM/);
});

test("plays error sound on wrong key", async ({ page }) => {
  // intercept Web Audio API or check aria-label on error span
  await page.goto("/game/1");
  await page.focus(".typing-area");
  await page.keyboard.press("x"); // wrong key for "f"
  await expect(page.locator("span.text-red-500")).toBeVisible();
});
```

---

## Phase 5 — Deployment Checklist

- [ ] Audio files added to `frontend/public/audio/typing/` (or served via CDN)
- [ ] Migration run: confirm `games` table accepts `type = "typing"`
- [ ] Seed script run: 7 lessons in DB
- [ ] `typing.router` registered in `integrate_endpoints.py`
- [ ] Docker rebuild: `docker compose up --build`
- [ ] Nginx: confirm `/audio/` static path is served (add location block if needed)
- [ ] Test on low-end device: typing engine must not lag on 2-core CPU

---

## ⚠️ Critical Pitfalls (Do Not Repeat)

| Pitfall                                        | Rule                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ |
| Storing every keystroke in Redux/global state  | Use local `useState` in the engine hook only                 |
| Trusting frontend WPM/accuracy for rewards     | Always recalculate in `typing_service.evaluate_typing()`     |
| Playing audio with `new Audio()` per keystroke | Use preloaded `AudioBuffer` via Web Audio API                |
| Building a new progress/reward system          | Call existing `update_progress()` and `award_shells()`       |
| Tight coupling of audio + engine               | `useAudioEngine` is independent — engine has no audio import |
| Skipping the narration fallback                | Implement `speechSynthesis` fallback on Day 1                |

---

## 🚀 Execution Order (Do This Exactly)

```
[1] Task 0.1  — Grep codebase, confirm game table schema
[2] Task 1.1  — Seed 7 lessons, confirm DB rows
[3] Task 1.2  — Write failing tests → implement typing_service → tests pass
[4] Task 1.3  — Build router, register endpoint, curl-verify
[5] Task 2.1  — useTypingEngine hook (pure logic, no UI)
[6] Task 2.2  — useAudioEngine hook (Web Audio API + speech fallback)
[7] Task 2.3  — TypingGame.jsx + TargetText.jsx + ResultModal.jsx
[8] Task 2.4  — Wire into GamePlayerPage switch
[9]           — End-to-end test: play full lesson, confirm shells awarded
[10] Phase 3  — Keyboard overlay, streaks, island map unlock
[11] Phase 4  — Full test suite (backend + Playwright)
[12] Phase 5  — Deployment checklist
```

---

_Keys of Wai'tukubuli — Built on QuestLab. Every keystroke, a step along the trail._
