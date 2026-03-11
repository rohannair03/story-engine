# VALDRIS — AI-Powered Interactive Story Engine

> *Seven years of rain. One impossible climb. No way back.*

A browser-based interactive fiction engine built on the Claude API, set in the dark-fantasy world of Valdris. The project doubles as a QA engineering portfolio piece, demonstrating real-world test strategy across unit, integration, and end-to-end layers with full CI/CD automation.

---

## ✦ Live Demo

| Layer | URL |
|---|---|
| Dev server | `http://localhost:5173` |
| CI pipeline | GitHub Actions → see **Actions** tab |

---

## ✦ What It Does

Players navigate a branching narrative as **Kennit**, a 31-year-old ex-soldier climbing the cliffs outside Mirileth — the last city under Valdris's permanent rain — on a mission the king won't name aloud. The engine:

- Generates contextually coherent story beats via the Claude API (Haiku 3.5)
- Presents three choices after every beat, parsed from the model's response
- Maintains full conversation history so the narrative remembers what happened
- Injects persistent world lore into every prompt to keep Valdris consistent
- Runs a **Score Companion** sidebar that analyzes each story beat's mood and pacing, then recommends a matching classical piece from a curated database of 20 works

---

## ✦ Stack

```
Frontend        React 18 + Vite
AI              Anthropic Claude API (claude-haiku-3-5 for story and music analysis)
Styling         Vanilla CSS-in-JS, Valdris dark theme tokens
Unit tests      Jest + jsdom + React Testing Library
E2E tests       Cypress
CI/CD           GitHub Actions
Coverage        Jest --coverage (lcov + text summary) — 98.97% statements
```

---

## ✦ Architecture

```
src/
├── App.jsx                   Main story engine + layout
├── components/
│   └── MusicBrief.jsx        Score Companion sidebar
└── utils/
    ├── api.js                Claude API wrapper (story generation)
    ├── musicAnalyzer.js      Haiku: extracts mood + pacing tags from story text
    ├── musicMatcher.js       Weighted scoring algorithm → best-fit piece
    ├── musicDatabase.js      20 classical pieces with mood/pacing metadata
    └── lore.js               Valdris world lore injected into every prompt

tests/
├── unit/
│   ├── App.test.jsx          React Testing Library — 20 tests, full interaction flow
│   ├── MusicBrief.test.jsx   React Testing Library — 11 tests, all render states
│   ├── parseResponse.test.js
│   ├── musicMatcher.test.js
│   └── musicAnalyzer.test.js
└── integration/
    └── api.test.js           Live API call tests (7 tests, gated by env var)

cypress/e2e/
└── storyEngine.cy.js         22 E2E tests covering full user journeys
```

---

## ✦ Testing Strategy

This project was designed to demonstrate layered QA thinking, not just "tests exist."

### The challenge: testing AI outputs

Non-deterministic LLM responses break conventional assertion patterns. The strategy here:

| Problem | Solution |
|---|---|
| Output varies per run | Assert on **structure** (choice count, format) not exact text |
| Prompt quality is hard to test | Unit-test the **lore injection** and **history assembly** separately from the API call |
| Music analysis depends on LLM | Test the **scoring algorithm** in isolation with fixed mock inputs |
| CI can't afford real API calls on every push | Integration tests are **opt-in** via `RUN_INTEGRATION_TESTS=true` env var |

### Test layers

**Unit (Jest) — 44 tests**
- `App.jsx`: full interaction flow via React Testing Library — initial render, choice clicks, loading states, error handling, music sidebar integration. API and music utilities fully mocked.
- `MusicBrief.jsx`: all three render states (loading, empty/error, populated) — mood tags, pacing tags, piece titles, YouTube/Spotify links
- `parseResponse`: choice extraction regex, pipe-format parsing, edge cases including fewer than 3 choices returned by the model
- `musicMatcher`: weighted scoring algorithm with fixed inputs — rank order, tie-breaking, empty database edge cases
- `musicAnalyzer`: prompt construction and response parsing, mocked API call

**Integration (Jest) — 7 tests**
- Live Claude API calls (gated behind env var in CI)
- Verifies the API returns parseable choices in expected format
- Verifies lore is reflected in response content
- Verifies conversation history is maintained across turns

**E2E (Cypress) — 22 tests**
- Full user journeys: see initial choices → click → see story → see new choices
- Loading state visibility
- Error state handling (mocked network failure)
- Score Companion renders after first story beat
- Responsive layout at mobile viewport

**Total: 66 tests | All passing in CI**

---

## ✦ Coverage

```
Statements : 98.97%
Branches   : 84.44%
Functions  : 100%
Lines      : 98.91%
```

Run locally:

```bash
npm run test:coverage
```

Coverage is also generated in CI on every push to `main`. The lcov report is uploaded as a workflow artifact — see the Actions tab to download it.

---

## ✦ Bugs Caught Through Testing

A log of real issues found during development — included here because catching bugs is the point.

| Bug | How caught | Fix |
|---|---|---|
| `MusicBrief` always showed "No score available" | Manual playtesting | New `App.jsx` was passing `storyText` prop; component expected `brief/loading/error` |
| Choices never updated after first beat | Manual playtesting | Inline `parseChoices` in new `App.jsx` expected newline-separated choices; lore prompt specifies pipe format |
| `parseResponse` silently returned 0 choices for 2-choice responses | Unit test (new edge case) | Regex required two pipes; fixed to require one or more |

---

## ✦ Getting Started

### Prerequisites

- Node 18+
- An Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### Install

```bash
git clone https://github.com/<your-username>/story-engine
cd story-engine
npm install
```

### Configure

```bash
cp .env.example .env
# Add your key:
# VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### Run

```bash
npm run dev            # Dev server at localhost:5173
npm test               # Jest unit + integration
npm run test:coverage  # Jest with coverage report
npm run cypress:open   # Cypress (requires dev server running)
npm run cypress:run    # Cypress headless
```

---

## ✦ CI Pipeline

Every push to `main` and every pull request runs:

```yaml
jobs:
  test:
    - Install dependencies
    - Run Jest (unit tests)
    - Run Jest with coverage → upload lcov artifact
    - Print coverage summary to Actions job summary
    - Run Cypress E2E
    - Upload screenshots on failure
```

Integration tests (live API) are skipped in CI by default to avoid rate limits and key exposure. To run them locally: `RUN_INTEGRATION_TESTS=true npm test`.

---

## ✦ AI-Specific QA Considerations

Working with an LLM as the core engine surfaces testing problems that don't appear in conventional software:

1. **Prompt regression** — A prompt change can silently degrade output quality without breaking any assertion. Mitigation: pin the system prompt in version control and review diffs carefully.

2. **Structural vs. semantic correctness** — Tests can verify the response *format* but not whether the *story* is good. Mitigation: manual playtesting as a complementary check.

3. **Rate limits and latency** — API calls are slow and fallible in ways local code isn't. Mitigation: mock the API in unit/component tests; only hit the real endpoint in gated integration tests.

4. **Model drift** — The same prompt may yield different results after an Anthropic model update. Mitigation: pin model version strings (`claude-haiku-3-5`) in the API wrapper.

5. **Context window management** — Conversation history grows unbounded. Mitigation: test that history assembly logic doesn't drop the most recent turn.

6. **Prompt/parser contract** — The output format is defined in the lore prompt, but parsers are written separately. If they drift apart, tests pass but the app silently breaks. Mitigation: integration tests that run the full prompt → parse pipeline end to end.

---

## ✦ World Context

**Valdris** is a dark-fantasy world under permanent rain — seven years and counting. **Mirileth**, the last standing city, clings to the base of a cliff range no one has ever climbed. The protagonist, **Kennit** (31, ex-soldier, bad knees, worse memories), is halfway up those cliffs on orders from a king who won't say why. The tone draws from Joe Abercrombie's grit and Patrick Rothfuss's sensory density.

---

## ✦ Roadmap

- [x] Phase 1 — Story engine foundation (Vite + React, Claude API, lore system)
- [x] Phase 2 — Narrative depth (conversation history, choices, story log)
- [x] Phase 3 — QA infrastructure (Jest + Cypress + GitHub Actions)
- [x] Phase 4 — Score Companion (mood/pacing analysis, classical music sidebar)
- [x] Phase 8 — Polish & portfolio prep (theme, README, coverage reporting, component tests)
- [ ] Phase 5 — Music layer depth (adaptive layering, transitions)
- [ ] Phase 6 — Image generation (scene illustration per beat)

---

## ✦ License

MIT
