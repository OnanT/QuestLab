# QuestLab Game System Enhancement Plan

## 1. Current System Overview

### Existing Architecture
The game system consists of a central `GamePlayerPage.jsx` that delegates rendering to specialized components in `frontend/src/components/games/`.

**Current Engines:**
| ID | Name | Implementation Status | Component |
| :--- | :--- | :--- | :--- |
| 1 | SkillBuilder | Fully Integrated | `SkillBuilder.jsx` |
| 2 | QuizBattle | Fully Integrated | `QuizBattle.jsx` |
| 3 | StoryQuest | Fully Integrated | `StoryQuest.jsx` |
| 4 | MapChallenge | Fully Integrated | `MapChallenge.jsx` |
| 15 | MemoryMatch | Fully Integrated | `MemoryMatch.jsx` |
| 16 | SentenceBuilder | Fully Integrated | `SentenceBuilder.jsx` |
| 17 | BucketSort | Fully Integrated | `BucketSort.jsx` |

**Missing Frontend Logic (Pending):**
- **Drag and Drop** (ID 7): To be implemented as a generic sorting/matching interface.
- **Fill in the Blanks** (ID 9): To be implemented as a text-completion interface.
- **Interactive Simulation** (ID 10): To be implemented as a generic HTML/Embed container for simulation content.

---

## 2. Lessons Analysis & Mapping

We will leverage the existing Grade 3 Term III curriculum data to generate 5+ games for each type.

| Game Type | Target Lessons | Mapping Logic |
| :--- | :--- | :--- |
| **Skill Builder** | Math Arithmetic, English Mechanics | Sequential problems (e.g., "5 x 4 = ?", "Capitalize: nevis"). |
| **Quiz Battle** | Science (Plants/Animals), Social Studies | Multiple choice based on lesson facts. |
| **Story Quest** | Social Studies (History/Culture) | Branching scenarios (e.g., "A day at Alexander Hamilton Museum"). |
| **Map Challenge** | Social Studies (Geography), Science (Ear Anatomy) | Clicking hotspots on maps or diagrams. |
| **Memory Match** | Math (Fractions/Decimals), Vocabulary (Similes) | Pairing equivalent concepts. |
| **Sentence Builder** | English Grammar (Verbs/Continuous Tense) | Reordering words to form correct sentences. |
| **Bucket Sort** | Science (Classification), Economics (Needs vs Wants) | Categorizing items into buckets. |

---

## 3. New Game Designs (Missing Logic)

### Game C: "Gap Filler" (Fill in the Blanks)
- **Mechanic**: A paragraph with missing words. Player selects from a word bank or types the answer.
- **Data Structure**:
  ```json
  {
    "text": "The [blank1] is the largest planet. It has [blank2] moons.",
    "blanks": {
      "blank1": { "answer": "Jupiter", "options": ["Mars", "Jupiter", "Earth"] },
      "blank2": { "answer": "many", "options": ["few", "many", "none"] }
    }
  }
  ```

### Game D: "Nexus" (Drag and Drop)
- **Mechanic**: Match items from column A to column B by dragging lines or snapping tiles.
- **Data Structure**:
  ```json
  {
    "pairs": [
      { "source": "Dog", "target": "Puppy" },
      { "source": "Cat", "target": "Kitten" }
    ]
  }
  ```

---

## 4. Game Page Updates (UI/UX)

The `GamesPage.jsx` will be updated to:
1.  **Dynamic Filter Cards**: Include icons and colors for all 7+ game types.
2.  **Search Bar**: Add keyword search for game titles/descriptions.
3.  **Improved Sorting**: Sort by points, difficulty, or date added.
4.  **Responsive Grid**: Optimize layout for mobile/tablet.

---

## 5. Database Seeding Plan

### Seeding Strategy (Python + SQL)
We will use a script `quest-scripts/seed_enhanced_games.py` that:
1.  **Extracts** key concepts from existing lesson `content_html`.
2.  **Transforms** content into game-specific JSON configs.
3.  **Loads** data into the `games` table using `UPSERT` (ON CONFLICT) to maintain idempotency.

### Story Quest Expansion
We will add 6 unique Story Quests:
1.  **The Hamilton Heritage**: Exploration of the Museum.
2.  **Market Day Hero**: Managing "Needs vs Wants" at a local market.
3.  **The Sound Wave Voyager**: Journey through the human ear.
4.  **Community Protector**: A day in the life of a community worker.
5.  **The Green Keeper**: Balancing a food web in a garden.
6.  **Timeline Traveler**: Chronological journey through SKN history.

---

## 6. Compatibility & Risk Analysis

### Safety Measures
- **UI Fallbacks**: If a game type doesn't have an icon, a default `Gamepad2` icon is shown.
- **Schema Safety**: Use `JSONB` for configs to allow evolution without migration.
- **Progress Preservation**: New games are added as new IDs; existing `progress` records remain untouched.

### Risks
- **Technical**: Performance of large Memory Match grids on low-end devices. *Mitigation: Limit grid size to 4x4 on mobile.*
- **UX**: Complex Story Quests might be overwhelming for Grade 3. *Mitigation: Use simple language and clear choice consequences.*
- **Scalability**: Managing 50+ games. *Mitigation: Implement pagination on the Games page.*

---

## 7. Timeline & Milestones

| Day | Task | Milestone |
| :--- | :--- | :--- |
| **Day 1** | Frontend logic for Fill in the Blanks & Drag and Drop. | All 9 engines supported in UI. |
| **Day 2** | UI Update for `GamesPage.jsx` (Filters/Icons). | Modernized game browser. |
| **Day 3** | Bulk Seeding (5 games per type = 35+ games). | Content library parity. |
| **Day 4** | 6 Story Quests implementation & asset linking. | Advanced narrative content. |
| **Day 5** | QA & Verification (Playwright tests). | Deployment ready. |

---
*Plan Authored: 2026-03-20*
