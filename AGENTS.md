# Repository Guidelines

## Project Structure & Module Organization

Mew Quest is a dependency-free browser platformer using HTML, CSS, Canvas, and JavaScript ES modules. `dist/` contains the editable application source, not generated build output. `dist/game.mjs` coordinates input and rendering; `engine.mjs` handles simulation; `friends.mjs` defines encounters and greetings. Character, viewport, touch, music, and pickup-effect modules keep their responsibilities separate.

Store images and audio in `dist/assets/`. Tests live in `tests/`, design notes in `docs/superpowers/`, and soundtrack generation in `scripts/compose-soundtrack.py`. `output/` contains exports and design artifacts.

## Build, Test, and Development Commands

- `npm start`: serve `dist/` at `http://localhost:4173` using Python 3.
- `npm test`: run the complete suite with Node’s built-in test runner; use Node 22 or newer.
- `node --test tests/touch-controls.test.mjs`: run one focused test file.
- `node --check dist/game.mjs`: check JavaScript syntax.
- `python3 scripts/compose-soundtrack.py`: regenerate the bundled soundtrack WAV.

No installation or build step is required. Serve files over HTTP because the game uses module imports.

## Coding Style & Naming Conventions

Use `.mjs` modules with explicit relative import extensions. Name functions and variables in `camelCase`, constants in `UPPER_SNAKE_CASE`, and files in `kebab-case`. Use two-space indentation for new multiline JavaScript; preserve surrounding style when editing compact modules. Avoid unrelated reformatting. No formatter or linter is currently configured.

## Testing Guidelines

Name tests `tests/<feature>.test.mjs` and use `node:test` with `node:assert/strict`. Test observable behavior: collision, reachable platforms, greeting progress, checkpoint recovery, touch cancellation, and pause timing. Add regression tests for gameplay bugs. There is no numerical coverage threshold. Run the full suite before submitting; manually check desktop and phone layouts when browser access is available, and report verification limits.

## Commit & Pull Request Guidelines

History includes automated `Update Site source` commits and descriptive imperative subjects. Prefer concise, specific subjects such as `Improve mobile jump controls`; no conventional-commit prefix is required. PRs should explain behavior changes, link relevant issues, list validation, and include screenshots for visual changes.

## Gameplay & Configuration Constraints

Preserve gentle, harm-free resets, capitalised greetings, keyboard and touch controls, and reduced-motion support. Keep credentials out of source and exports. Preserve `.openai/hosting.json` project identity and the Site’s audience unless explicitly instructed otherwise.
