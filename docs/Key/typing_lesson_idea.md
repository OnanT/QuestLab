High-Level Strategy (Why this will work)

You already have a modular game system:

frontend/components/games/\*
backend/routers/games.py
progress, rewards, lessons

So the typing module should NOT be a standalone system.

👉 It must behave like:

“Just another game type with a custom engine”

This avoids:

duplicating progress logic
breaking dashboards
creating special-case code everywhere
🏗️ Target Architecture (Final State)
Backend

Add:

modules/typing/
routers/typing.py
services/typing_service.py
Frontend

Add:

components/games/TypingGame/
pages/TypingPage.jsx (optional)
engine/typingEngine.ts
🚧 PHASE 1 — Backend Foundation

1. DO NOT create new systems

You already have:

progress.py
rewards.py
games.py

👉 Reuse them.

2. Add Typing as a Game Type

In your DB (games or lessons):

Add:

{
"type": "typing",
"engine": "typing_v1",
"config": {
"target": "fff jjj fff jjj",
"timeLimit": 45,
"difficulty": "easy"
}
} 3. Create Typing Service (Business Logic Layer)

Create:

backend/modules/typing/services/typing_service.py

Responsibilities:

validate results
calculate stats (server-side trust)
award shells
return normalized result
Example (clean + testable)
def evaluate_typing(input_text: str, target: str, time_ms: int):
errors = sum(1 for i, c in enumerate(target) if i >= len(input_text) or input_text[i] != c)

    accuracy = (len(target) - errors) / len(target) * 100

    wpm = (len(input_text) / 5) / (time_ms / 60000)

    return {
        "accuracy": round(accuracy, 2),
        "wpm": round(wpm, 2),
        "errors": errors
    }

4. Add Router (Minimal, clean)

Create:

backend/routers/typing.py
Endpoints
POST /typing/complete
GET /typing/lesson/{id}
Example
@router.post("/complete")
def complete_typing(payload: TypingResultSchema):
stats = typing_service.evaluate_typing(
payload.input,
payload.target,
payload.time_ms
)

    # integrate with existing progress system
    save_progress(...)

    return stats

5. Integrate into Existing Router System

In:

integrate_endpoints.py

Add:

from routers import typing
app.include_router(typing.router, prefix="/typing")
🎮 PHASE 2 — Frontend Integration

1. DO NOT create a new “module system”

You already have:

components/games/

👉 So we follow that pattern.

2. Create Typing Game Component
   components/games/TypingGame/
   TypingGame.jsx
   KeyboardOverlay.jsx
   useTypingEngine.js
3. Game Loader Integration

Your:

GamePlayerPage.jsx

likely has something like:

switch (game.type) {
case "quiz":
case "memory":

👉 Add:

case "typing":
return <TypingGame config={game.config} />;
🧠 PHASE 3 — Typing Engine (Critical)

This is where most implementations fail.

1. Requirements
   deterministic
   no re-renders per keystroke explosion
   testable
2. Engine Hook
   hooks/useTypingEngine.js
   Design
   export function useTypingEngine(target) {
   const [input, setInput] = useState("");
   const [startTime, setStartTime] = useState(null);

const onType = (char) => {
if (!startTime) setStartTime(Date.now());
setInput(prev => prev + char);
};

const stats = useMemo(() => {
if (!startTime) return null;

    const time = Date.now() - startTime;

    return calculateStats(input, target, time);

}, [input]);

return { input, onType, stats };
} 3. Avoid Common Mistakes

❌ Don’t store every keystroke in global state
❌ Don’t recompute full stats unnecessarily
❌ Don’t mutate strings in loops

🎨 PHASE 4 — UI Integration

1. TypingGame.jsx Responsibilities
   render target text
   render user input
   highlight correctness
   handle key events
   trigger completion
2. Keyboard Overlay

Keep it simple first:

highlight current expected key
optional finger hints later 3. Result Flow

After completion:

POST /typing/complete

Then:

show modal
award shells (via existing rewards system)
🔗 PHASE 5 — Progress + Rewards Integration
DO NOT BUILD NEW SYSTEMS

You already have:

progress.py
rewards.py
achievements.py
Hook into them:

After typing result:

update_progress(user_id, game_id, stats)
award_shells(user_id, calculated_reward)
🧪 PHASE 6 — Testing (Important for You)
Backend

Add:

tests/test_typing.py

Test:

accuracy calculation
WPM calculation
edge cases (empty input, fast typing)
Frontend

Test:

correct highlighting
completion triggers
stat calculations
🚀 PHASE 7 — Data Seeding

Update your existing script:

quest-scripts/seed_enhanced_games.py

Add typing games:

{
"type": "typing",
"title": "Coconut Cove 1",
"config": {
"target": "fff jjj fff jjj",
"timeLimit": 45
}
}
🧱 PHASE 8 — Deployment Considerations
Docker

No major changes required.

Just ensure:

router is registered
migrations applied
Performance

Typing is:

CPU-light
network-light

So safe for low-end devices.

⚠️ Critical Pitfalls (Avoid These)

1. Overengineering too early

Start with:

1 island
3 lessons 2. Duplicating progress logic

Reuse existing system or you will regret it.

3. Trusting frontend stats

Always validate on backend.

4. Tight coupling UI + logic

Keep engine separate.

🧭 Final Execution Plan (Order)
Step-by-step (Do this exactly)
Add "type": "typing" to games
Build typing engine (frontend)
Build TypingGame component
Integrate into GamePlayerPage
Build backend typing_service
Add /typing/complete
Hook into progress + rewards
Seed 7 lessons
Test end-to-end
Expand content
