# The Bell Beneath Ash — Prototype 0.1 · V29

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite. The first playable campaign is **The Ashen Marches**.

## Current core loop

Expeditions / contracts / guild wars → earn Coin, Iron, Salvage and equipment → reclaim Enclave land → choose permanent district buildings → upgrade those buildings → gain kingdom-wide combat/economy/war bonuses → expand farther → defeat regional threats and improve the guild.

This is the intended Kingdoms-at-War-style foundation: the Enclave is persistent strategic territory, not merely a menu hub.

## Major playable systems

- Vanguard, Duelist and Physician Hunters with XP, equipment and tactical doctrines
- four-region Ashen Marches campaign
- field-discovery events and formation combat
- Tactical Pause, targeting, Resolve and status effects
- crafting, salvage, equipment rarity/affixes and item sets
- Penitent Warden regional boss
- three repeatable post-Warden Hunt Board contracts
- Last Toll mastery boss hunt
- Guild Hall, seven-member prototype roster and persistent local guild progression
- simulated Guild War: Preparation → War → Results
- three War Table objectives and three coordinated attacks
- permanent guild win/loss and contribution records

## Kingdom / Enclave progression — V27/V28

The Enclave contains six sequential land districts: Inner Ward, Ash Court, West Rampart, Lower Foundry, Cinder Quarter and Outer Bailey.

Land reclamation becomes progressively more expensive. Every reclaimed district becomes a construction plot. The player chooses one of four permanent specializations:

- **Bastion** — Hunter HP and Guild War defense
- **Arsenal** — Hunter ATK and Guild War strike power
- **Foundry** — increased expedition resource recovery
- **Vigil Shrine** — increased starting Resolve

Buildings upgrade through three tiers and bonuses stack across the kingdom. V28 makes this progression visible on the main Enclave scene: ruins become reclaimed wards, building types receive distinct silhouettes, higher tiers become larger/more complex, and the settlement moves from a small hold to a six-ward fortress.

## Interaction / accessibility polish — V29

V29 leaves the validated V28 game mechanics intact and adds a dedicated presentation/interaction layer:

- tactile pressed states and short action feedback for touch controls
- subtle screen-entry and resource-change feedback
- improved combat emphasis for critical-health units and focused targets
- explicit button types, accessible names and disabled-state semantics
- live screen announcements for assistive technology
- modal dialog semantics for sheets and overlays
- automatic keyboard focus into newly opened dialogs
- Escape-to-close behavior with focus restoration
- fixed-position overlay visibility handling
- coarse-pointer minimum touch targets
- reduced-motion support
- mobile dialog scroll containment and continued horizontal-overflow protection

The V29 regression gate caught and fixed a real accessibility issue in the new focus manager: fixed-position overlays can have `offsetParent === null`, so visibility is now determined from rendered client rectangles and computed visibility instead.

## Presentation layers

The live entry point is `index.html`. Major current layers include:

- `guild-v23.js/css` — Guild Hall and simulated Guild Wars
- `ui-v24.js/css` + fixes — production UI language and 44px mobile interaction standard
- `polish-v25.js/css` — earlier interaction/accessibility polish
- `enclave-v26.js/css` — illustrated Enclave environment rebuild
- `kingdom-v27.js/css` — land reclamation, construction, tiers and permanent kingdom bonuses
- `kingdom-v28.js/css` — dynamic settlement growth on the main Enclave scene
- `polish-v29.js/css` — current interaction feedback, modal focus, accessibility and combat-readability pass

Earlier campaign/combat/facility layers remain active and are validated by the regression suite.

## Validation

V29 passes the complete **390×844 mobile Chromium regression gate**, including:

- main campaign
- Causeway, Chapel and Penitent Warden
- Storehouse / Forge
- Infirmary / Scout Tower
- Hunter progression
- Tactical Pause
- March intelligence
- Hunt Board
- Last Toll
- Guild Hall / Guild War
- production UI checks
- V27 kingdom expansion mechanics
- V28 dynamic Enclave visual-growth comparison
- V29 interaction/accessibility smoke test
- standard 1,000-playthrough progression audit
- audit-evidence packaging
- deployable-source packaging

The V29-specific gate verifies button semantics and accessible names, mobile overflow, dialog semantics, automatic modal focus, Escape dismissal, disabled-state semantics and the live announcement region.

### 10,000-profile background-mechanics stress gate

The background game systems remain covered by the validated **10,000-profile V28 stress gate**, split into ten isolated 1,000-profile Chromium batches. All ten passed with no tested invariant violations, progression/combat deadlocks or browser/runtime errors.

V29 did not change background game-state mechanics, combat formulas, economy, progression, kingdom bonuses or Guild War resolution, so that stress result remains the current background-mechanics baseline. See `STRESS_10000_V28.md` for the dedicated report.

## Prototype boundary

The current build still uses local browser persistence and simulated guild opponents. It does **not** yet include production accounts/backend persistence, actual networked guild membership, real multiplayer/PvP servers, server-scheduled wars, trading, monetization or live-ops infrastructure.

The repository is the working source of truth for the playable prototype.
