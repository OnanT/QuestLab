# Database Audit & Cleanup Report

## 1. Summary
This report provides an audit of the QuestLab database, specifically the `lessons` table, and outlines a comprehensive strategy for data sanitization and user management. The goal is to ensure data integrity, improve frontend rendering consistency, and provide safe administrative scripts.

---

## 2. Data Issues Found
### Audit of `lessons.context_html`
Based on an analysis of the seed data and schema:

| Issue Type | Finding | Impact |
| :--- | :--- | :--- |
| **Inline Styles** | Extensive use of `style="..."` for background colors and padding in formula boxes. | High (Inconsistent UI, hard to theme) |
| **Formatting** | Use of `<pre>` tags for story text instead of semantic `<p>` or `<blockquote>`. | Medium (Responsive layout issues) |
| **Redundant Tags** | Empty `<p></p>` and nested `<div>` wrappers found in larger seed files. | Low (DOM bloat) |
| **Hardcoded Assets** | Some image URLs point to local paths that may not resolve in production. | High (Broken images) |

### Examples
**Before Cleanup (Issue):**
```html
<div style="background: #fdf2f8; padding: 15px; border-radius: 10px; border: 1px solid #fbcfe8;">
  <strong>Subject + was/were + verb + -ing</strong>
</div>
```

---

## 3. Cleanup Plan
### Strategy
1. **Normalization**: Extract inline styles and replace them with semantic CSS classes (e.g., `class="lesson-formula-box"`).
2. **Sanitization**: Use a whitelist-based approach to strip unwanted tags (e.g., `<script>`, `<applet>`) and attributes.
3. **Validation**: Run a dry-run script to count affected rows before applying changes.

### Transformation Rules
- Replace `style="background: #fdf2f8; ..."` with `class="bg-highlight-pink"`.
- Convert `<pre>` story blocks to `<div class="story-block">`.
- Strip all `id` attributes from HTML tags to prevent collisions with the React application.

---

## 4. SQL Scripts

### A. HTML Sanitization & Stripping
*Note: The first script removes specific attributes, while the second strips ALL tags.*

#### 1. Remove Inline Styles (Preserves Tags)
```sql
-- START TRANSACTION
BEGIN;

-- Remove 'style' attributes from all tags in content_html
UPDATE lessons
SET content_html = regexp_replace(content_html, ' style="[^"]*"', '', 'g')
WHERE content_html LIKE '% style=%';

COMMIT;
```

#### 2. Strip All HTML Tags (Converts to Plain Text)
**Warning:** This will remove all formatting (headings, lists, tables). Ensure the frontend can handle plain text before executing.

```sql
-- START TRANSACTION
BEGIN;

-- Strip all HTML tags using regex
UPDATE lessons
SET content_html = regexp_replace(content_html, '<[^>]*>', '', 'g')
WHERE content_html ~ '<[^>]*>';

-- Clean up redundant whitespace left behind
UPDATE lessons
SET content_html = trim(regexp_replace(content_html, '\s+', ' ', 'g'))
WHERE content_html ~ '\s{2,}';

COMMIT;
```

### B. User Management
*Handles foreign key dependencies (CASCADE is defined in schema, but these are explicit).*

```sql
-- Delete User by Email
DELETE FROM users 
WHERE email = 'alex@student.edu';

-- Update User Role and Level
UPDATE users 
SET role = 'teacher', 
    level = 10,
    updated_at = CURRENT_TIMESTAMP
WHERE username = 'teacher_nevis';
```

### C. Progress Reset
*Clears all tracking data for a specific user.*

```sql
-- Reset Progress for a specific user ID
BEGIN;

DELETE FROM progress WHERE user_id = 5;
DELETE FROM lesson_time_logs WHERE user_id = 5;
DELETE FROM user_analytics WHERE user_id = 5;

-- Reset user points and level
UPDATE users 
SET points = 0, 
    level = 1, 
    streak = 0 
WHERE id = 5;

COMMIT;
```

---

## 5. Game Recommendations

### Concept 1: Verb Runner (Language Arts)
- **Core Mechanic**: Side-scrolling runner where obstacles are labeled with verb forms.
- **Lesson Use**: Uses "The Ant and the Grasshopper" content. Player must jump over present-tense verbs and slide under future-tense verbs.
- **Progression**: Increases speed and introduces "going to" vs "will" distinctions.

### Concept 2: Caribbean Cartographer (Social Studies)
- **Core Mechanic**: Point-and-click exploration on a stylized Caribbean map.
- **Lesson Use**: Uses data from `geographical_features` and `countries`. Players identify islands by their silhouette or landmarks (e.g., The Pitons).
- **Progression**: Unlocks new islands as lessons are completed.

### Concept 3: Fraction Foundry (Mathematics)
- **Core Mechanic**: Drag-and-drop "alloy" mixing.
- **Lesson Use**: Uses "Fractions and Decimals" content. Players must mix 1/4 of one metal with 3/4 of another to create tools.
- **Progression**: Introduces complex fractions and decimal conversions.

### Concept 4: History Hero Quiz (History)
- **Core Mechanic**: Turn-based card battle.
- **Lesson Use**: Uses `historical_figures` data. Players use "Figure Cards" (e.g., Marcus Garvey) whose "power" is based on their historical contribution.
- **Progression**: Collect new figure cards by completing history lessons.
