# Prototype 0.1 — 1,000-Playthrough Audit

Audit date: 2026-08-16

## Method

The current main branch was loaded in headless Chromium at a 390×844 mobile viewport. A real browser smoke route exercised briefing → Enclave → map → combat → result → loot → Hunter Hall → Forge → inventory. Then 1,000 complete vertical-slice simulations were run inside the loaded application using the actual live game functions/state, split evenly across four behavior profiles: aggressive, conservative, optimizer, and casual. The audit also captured full-page screenshots of the briefing, Enclave, map, combat, result, and inventory.

This is separate from `balance-test.js`; that older Monte Carlo test is an independent combat approximation rather than a run through the actual browser game state.

## Technical result

- 1,000 / 1,000 runs defeated the Penitent Warden within the retry cap.
- 0 browser console/page errors.
- 0 combat-loop stalls.
- 0 tested state-invariant failures (negative resources, missing equipped inventory items, duplicate equipment keys, invalid reveal range).
- Existing mobile browser smoke test also passed.

## Actual progression/difficulty observed

Across all 1,000 runs:

| Region | Wins | Attempts | Win rate per audited attempt |
|---|---:|---:|---:|
| Forsaken Farmstead | 1,000 | 1,383 | 72.3% |
| Hollow Causeway | 1,000 | 1,015 | 98.5% |
| Saint Orra Chapel | 1,000 | 1,026 | 97.5% |
| Penitent Warden | 1,000 | 1,000 | 100.0% |

The practical difficulty curve is therefore backwards under the audited progression path: the opening Farmstead is substantially more punishing than later encounters, while the Warden is effectively guaranteed once the player reaches it.

This conflicts with the older hard-coded balance smoke reference, which reports Farmstead as the easiest and Warden as the hardest. The old balance test should not be treated as authoritative for the real build.

## Strategy results

| Strategy | Completion | Defeats | Avg attempts / full run | 4pc set by end | Guided objectives completed |
|---|---:|---:|---:|---:|---:|
| Aggressive | 100% | 151 | 4.60 | 70.0% | 41.2% |
| Conservative | 100% | 25 | 4.10 | 56.4% | 1.6% |
| Optimizer | 100% | 122 | 4.49 | 72.0% | 35.2% |
| Casual | 100% | 126 | 4.50 | 64.4% | 18.4% |

## Economy / loot outcome

Averaged across all runs at the end of the Warden path:

- ~437 Coin remaining
- ~52 Iron remaining
- ~12.6 Salvage remaining
- ~5.2 items in inventory
- ~3.9 equipped Ashen Pilgrim pieces
- 100% of runs had the 2-piece Ashen Pilgrim bonus
- 65.7% had the 4-piece bonus
- Core Hunters averaged level 2
- Only 24.1% completed the full six-step guided objective chain even though 100% defeated the Warden

## Critical findings

### 1. Difficulty curve is reversed

Farmstead is the largest failure point. Once the player gains Hall support, gear, levels, and Resolve options, Causeway/Chapel become nearly automatic and the Warden was defeated on the first audited attempt in every run. The boss is not functioning as the intended first build/formation test.

### 2. The existing 100,000-expedition balance test is misleading

`balance-test.js` does not play the actual application. It hard-codes region-specific party bonuses, Hall levels, enemies, and tactical behavior. Its reference percentages do not match the live progression path. The new browser-connected audit should become the higher-priority progression test.

### 3. Guided objectives are desynchronized from real progression

The player can defeat the Warden while still failing to complete earlier guided objectives, especially `Arm the March` (craft one item). Conservative play completed the full guided chain only 1.6% of the time. This means the onboarding/objective system can tell a player to perform early-game tasks after the vertical slice is already complete.

### 4. It is not yet loot-heavy in moment-to-moment play

A normal path gives one equipment item per successful encounter plus possible crafting. The full four-region vertical slice ends with only about five items on average. That is too sparse for a game whose loot chase is meant to be a primary pillar.

### 5. Set completion is too fast relative to the amount of loot

Despite receiving only ~5 items, every audited run activated the 2-piece bonus and roughly two-thirds activated the 4-piece bonus. Ashen Pilgrim therefore behaves more like a guaranteed tutorial set than a meaningful collection chase. That can be acceptable for a starter set, but it should not be used as evidence that the long-term set chase works.

### 6. Economy lacks pressure

Players finish the short slice with substantially more Coin and Iron than they start with, while there are few compelling sinks. This makes Enclave preparation/upgrades feel less like decisions and more like boxes to buy when convenient.

### 7. Mobile presentation is too tall and text/card heavy

Full-page mobile capture heights at 390px width:

- Briefing: 1,033px
- Enclave: 1,800px
- Map: 976px
- Combat: 1,097px
- Result: 869px
- Inventory: 865px

The 844px-tall test viewport cannot show the briefing's `ENTER THE ENCLAVE` button without scrolling. Combat also extends beyond one viewport. The Enclave is over two phone screens tall before accounting for normal interaction.

### 8. The visual layer still reads as a UI prototype, not the target 2D game

The Enclave is primarily bordered cards; the map is a dark panel with labeled nodes; Hunters/enemies are silhouette stand-ins; combat is small unit cards over a CSS backdrop. The build is technically coherent but does not yet deliver the intended illustrated gothic post-apocalyptic world or a distinct premium mobile-game identity.

### 9. Onboarding is informative but not guided enough

The briefing explains four concepts at once in static text, with the action button below the first viewport. The objective system then presents tasks, but the game does not walk the player through one immediate action at a time with contextual highlighting. A player can still understand the words but not know what to press next.

### 10. Code organization is becoming fragile

The prototype is composed of many classic scripts that repeatedly wrap/reassign global functions (`view`, `enclave`, `start`, `win`, `combat`, `tick`, etc.) based on load order. It works now and passed the audit, but every added feature increases the chance that a later module silently overrides behavior from an earlier module. This should be consolidated before the project grows substantially.

## What passed

The build is not broken. Core save/state plumbing, navigation, map → combat → results → loot flow, equipment assignment, Forge crafting, objective tracking, and repeated full completion remained technically stable under the audit. The current problem is primarily game balance, onboarding, loot pacing, presentation, and maintainability rather than basic runtime reliability.

## Priority order from this audit

1. Redesign first-session UX and mobile information hierarchy.
2. Rebalance Farmstead → Causeway → Chapel → Warden using the actual browser progression harness.
3. Synchronize objective gating with progression so the tutorial cannot fall behind the player.
4. Increase meaningful loot frequency while preventing the starter set from completing automatically.
5. Rework Enclave/map/combat presentation toward illustrated 2D scenes instead of bordered-card UI.
6. Add stronger resource sinks and clearer upgrade tradeoffs.
7. Consolidate game-state/combat/module architecture before adding multiplayer-scale systems.

The automated `audit-1000.mjs` harness and captured screenshots are now retained with the project CI so future balance/UI changes can be regression-tested against the real browser build.