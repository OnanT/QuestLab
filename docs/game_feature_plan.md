# QuestLab Game Feature Implementation Plan

## 1. Current System Overview

### Frontend Architecture
The game system is centralized in `GamePlayerPage.jsx`, which acts as a state container and layout orchestrator.

- **Game Loop**:
  1.  **Init**: Fetches game data (`/games/:id`), sets `gameState` to "playing", initializes score/timer.
  2.  **Play**: Renders specific game UI based on `game_type` (switch statement).
  3.  **Interaction**: Updates local state (`currentIndex`, `score`, `userAnswer`).
  4.  **End**: Triggered by timer or completion. Sets `gameState` to "finished".
  5.  **Submit**: POSTs results to `/games/:id/submit`. Displays `results` overlay.

### Existing Game Engines
| Type | Mechanic | Config Structure |
| :--- | :--- | :--- |
| **Skill Builder** | Sequential text input problems. | `problems: [{ question, answer, hint }]` |
| **Quiz Battle** | Multiple choice questions. | `questions: [{ question, options[], answer }]` |
| **Story Quest** | Branching narrative text. | `scenes: [{ id, text, choices[] }]` |
| **Map Challenge** | Coordinate clicking (Image/Leaflet). | `locations: [{ name, x, y, lat, lng }]` |

### Technical Observations
- **State Management**: Local `useState` is sufficient for current complexity.
- **Timer**: Centralized `useEffect` interval handles all timed modes.
- **Normalization**: Backend returns `config_json`, frontend normalizes to `game.config`.
- **Extensibility**: The system is highly extensible. Adding a new game requires adding a new condition in `GamePlayerPage` and a corresponding rendering block.

---

## 2. Lessons & Content Mapping

Analysis of `restore_lesson_html.py` seed data reveals high-potential patterns:

| Content Theme | Data Structure | Potential Gameplay |
| :--- | :--- | :--- |
| **Grammar (Verbs)** | "Walk" -> "Walked" (Pairs) | Memory Match (Tense Pairing) |
| **Grammar (Sentences)** | "The | dog | runs" (Sequence) | Sentence Builder (Ordering) |
| **Science (Classification)** | Herbivore vs Carnivore (Categories) | Bucket Sort (Categorization) |
| **Math (Fractions)** | "1/2" -> "0.5" (Equivalence) | Memory Match or Sorting |
| **History (Dates)** | Event -> Year (Timeline) | Timeline Drag & Drop |

---

## 3. New Game Design (2 Types)

### Game A: "Word Constructor" (Sentence Builder)
*Focus: Language Arts & Logic*

- **Core Mechanic**: Players are presented with a jumbled set of word tiles and must drag/click them into the correct order to form a valid sentence or equation.
- **Lesson Integration**:
    - *English*: Reorder "cat / The / sleeping / is" -> "The cat is sleeping".
    - *Math*: Reorder "5 / = / 2 / + / 3" -> "2 + 3 = 5".
- **Progression**: Sentences get longer; distractors (wrong words) are added.
- **Data Structure**:
  ```json
  {
    "type": "sentence_builder",
    "prompts": [
      { "target": "The cat runs", "shuffled": ["runs", "The", "cat"], "distractors": ["dog"] }
    ]
  }
  ```

### Game B: "Category Sorter" (Bucket Sort)
*Focus: Science & Social Studies*

- **Core Mechanic**: Items fall or appear one by one. Player sorts them into 2-4 labeled buckets.
- **Lesson Integration**:
    - *Science*: Buckets "Conductor" vs "Insulator". Item "Copper Wire".
    - *Math*: Buckets "Even" vs "Odd". Item "42".
- **Progression**: Speed increases; items become more ambiguous.
- **Data Structure**:
  ```json
  {
    "type": "bucket_sort",
    "buckets": [{"id": "b1", "label": "Living"}, {"id": "b2", "label": "Non-Living"}],
    "items": [{"text": "Tree", "bucketId": "b1"}, {"text": "Rock", "bucketId": "b2"}]
  }
  ```

---

## 4. Memory Match System Design

### Core Mechanics
A grid of cards is presented face-down. The player flips two cards. If they match, they stay face-up. If not, they flip back after a short delay.

### Game States
1.  **Idle**: Waiting for input.
2.  **OneFlipped**: First card revealed.
3.  **TwoFlipped (Checking)**: Input blocked. Comparison logic running.
4.  **Matched**: Cards updated to "solved" state. Input unblocked.
5.  **Miss**: Cards flip back. Input unblocked.

### Anti-Bug & Stability Logic
- **Locking**: A `isProcessing` boolean flag MUST prevent a 3rd card click while 2 are visible.
- **Self-Match**: Prevent clicking the same card twice.
- **Persistency**: Use unique IDs for card instances, not just content IDs (to handle duplicate content if needed).

### Lesson Integration Types
1.  **Identical Match**: `A` matches `A` (Simple recognition).
2.  **Association Match**: `Concept` matches `Definition` (Deep learning).
    - Example: Card A "Herbivore" matches Card B "Eats plants".
3.  **Media Match**: `Text` matches `Image`.

### Data Structure (`config_json`)
```json
{
  "grid_size": 12, // 4x3
  "time_limit": 120,
  "pairs": [
    { 
      "id": 1, 
      "content_a": { "type": "text", "value": "Apple" },
      "content_b": { "type": "image", "value": "/img/apple.png" }
    }
  ]
}
```

### Enhancements
- **Streak Multiplier**: 2x score for consecutive matches without a miss.
- **"Peek" Power-up**: Reveal all cards for 1 second (cost: points).

---

## 5. Database Seeding Strategy

### Schema Requirements
No schema changes required. `game_engines` table already exists. We just need to insert new rows for the new engines.

### Seeding Logic (Idempotent)
1.  **Insert Engines**: Ensure `MemoryMatch`, `SentenceBuilder`, and `BucketSort` exist in `game_engines`.
2.  **Fetch Lessons**: Query lessons by category (e.g., "Grammar").
3.  **Generate Config**: Python script to parse lesson HTML (or use seed dictionaries) and generate JSON.
4.  **Insert Games**: UPSERT into `games` table based on `lesson_id` and `game_engine_id`.

### Sample SQL (Engine Registration)
```sql
INSERT INTO game_engines (name) VALUES 
('MemoryMatch'), 
('SentenceBuilder'), 
('BucketSort') 
ON CONFLICT (name) DO NOTHING;
```

---

## 6. Compatibility & Risk Analysis

### Risk: Frontend State Collision
- **Issue**: Adding complex state (like card grids) to `GamePlayerPage` might bloat the component.
- **Mitigation**: Extract game-specific logic into sub-components (`<MemoryGame />`, `<SortingGame />`) that accept `config` and `onScoreUpdate` props. Keep the main page as a wrapper.

### Risk: Timer Sync
- **Issue**: Animations in Memory Match (flipping) take time. If the timer ends *during* an animation, race conditions may occur.
- **Mitigation**: Pause timer during "Level Complete" animations. Ensure `handleGameEnd` cancels all pending timeouts/animations.

### Risk: Mobile Responsiveness
- **Issue**: Drag-and-drop (Sentence Builder) can be tricky on touch devices.
- **Mitigation**: Implement "Click-to-Select" as a fallback interaction model for sorting/ordering games, rather than relying solely on Drag-and-drop. Use a responsive grid for Memory Match (2 cols on mobile, 4 on desktop).

### Backward Compatibility
- Existing games (`quiz_battle`, etc.) rely on the current `GamePlayerPage` structure.
- **Strategy**: The `switch` statement in `GamePlayerPage` defaults to `null` or error if type is unknown. New types will simply be added as new `case` blocks. No existing logic is touched.
