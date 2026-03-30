# Gemini Skill Creation Guide

This guide explains how to transform complex project workflows (like GSD) and technical context into a specialized **Gemini Skill**. Use this as a blueprint for creating skills in other projects.

---

## 1. What is a Gemini Skill?

A Skill is a modular package that extends Gemini CLI's capabilities. It provides:
- **Procedural Knowledge**: Step-by-step instructions for complex tasks.
- **Domain Expertise**: Knowledge of specific libraries, architectures, or business logic.
- **Bundled Resources**: Scripts, reference docs, and templates.

---

## 2. Anatomy of a Skill

A skill directory (e.g., `.gemini/skills/my-skill/`) must contain:
1. **`SKILL.md`**: The brain of the skill (YAML frontmatter + Markdown instructions).
2. **`references/`**: (Optional) Detailed documentation (API specs, schemas).
3. **`scripts/`**: (Optional) Executable tools (Python, Node, Bash).
4. **`assets/`**: (Optional) Templates, boilerplate, or media.

---

## 3. The Creation Workflow

### Step 1: Gather Source Material
Collect all documents that define how your project should be built. For QuestLab, this included:
- **GSD Agent Roles**: (Planner, Executor, Debugger, etc.)
- **Project Context**: `GEMINI.md`, `ARCHITECTURE.md`.
- **Technical Guides**: `EMAIL_SYSTEM_GUIDE.md`, `UI_UX_Improvement.md`.

### Step 2: Initialize the Skill
Run the `init_skill.cjs` script to create the standard folder structure:
```bash
node <path-to-skill-creator>/scripts/init_skill.cjs <skill-name> --path .gemini/skills/
```

### Step 3: Define the Triggers (Frontmatter)
The `description` in your `SKILL.md` frontmatter is critical. It tells Gemini **when** to use the skill. 
- **Good**: `description: Technical orchestration for QuestLab. Use when planning phases, executing tasks, or debugging features.`
- **Bad**: `description: A developer skill.`

### Step 4: Map Workflows to Instructions
Translate your "Agent Roles" into a cohesive set of instructions. 
- Use **Imperative Form**: "Execute the plan," "Verify the goal."
- Use **Goal-Backward Logic**: Start with what must be TRUE, then define what must EXIST.
- **Progressive Disclosure**: Keep the main `SKILL.md` lean and link to deeper files in `references/`.

### Step 5: Package and Install
Once the skill is written, package it into a `.skill` file:
```bash
node <path-to-skill-creator>/scripts/package_skill.cjs .gemini/skills/<skill-name>
gemini skills install <skill-name>.skill --scope workspace
```

---

## 4. Best Practices for Developers

- **Prefer Vertical Slices**: Plan features from DB to UI in one go, rather than in horizontal layers.
- **Automate First**: If a CLI tool (Vite, Docker, Pytest) can verify a task, use it.
- **Context Efficiency**: Only add information that Gemini doesn't already know.
- **Self-Correction**: Include "Anti-Patterns" to help Gemini avoid common mistakes.

---

## 5. QuestLab Specific Example

For the `questlab-dev` skill, we combined:
- **Planner Logic**: Decomposing phases into 2-3 tasks.
- **Executor Logic**: Making atomic commits for every task.
- **Email Context**: Ensuring Celery and FastAPI-Mail are always considered.
- **Docker Context**: Assuming all services are containerized.
