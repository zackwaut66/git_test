# The Bell Beneath Ash — Prototype 0.1 · V24

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite vertical slice. The first playable campaign is **The Ashen Marches**.

## Play now

Development build:

`https://raw.githack.com/zackwaut66/git_test/main/index.html`

Immutable validated V24 gameplay/UI snapshot:

`https://rawcdn.githack.com/zackwaut66/git_test/40ed99233ef245ee45eb076257c2c83b931007cf/index.html`

## Core loop

Enclave → prepare Hunters → inspect March intelligence → expedition / field discovery → formation combat → loot → compare / equip / salvage / craft → strengthen Hunters and Enclave → defeat the Penitent Warden → Hunt Board contracts → Last Toll mastery hunt → Guild Hall → prepare coordinated Guild War strikes → war results and guild progression.

## Current playable build

The live entry point is `index.html`. It loads the validated gameplay core plus the current presentation/gameplay layers:

- `app.js` / `app.css` — game state, progression, combat, loot, buildings, persistence and base UI
- `v7.js` / `v7.css` / `v7-art-polish.css` — illustrated Hunter Hall and Hunter art
- `combat-v8.js` / `combat-v8.css` — illustrated formation combat
- `map-v9.css` — Ashen Marches map presentation
- `enclave-v10.css` — Enclave presentation
- `result-v11.css` — victory and recovered-loot presentation
- `title-v12.css` — title screen presentation
- `causeway-v13.css` — Hollow Causeway presentation
- `chapel-v14.css` — Saint Orra Chapel presentation
- `warden-v15.css` — Penitent Warden arena, boss and victory presentation
- `storehouse-v16.css` — Storehouse, equipment comparison and Forge cohesion pass
- `facilities-v17.js` / `facilities-v17.css` — Infirmary readiness and Scout Tower field intelligence
- `hunters-v18.js` / `hunters-v18.css` — selected-Hunter XP dossier and tactical doctrine readout
- `combat-v19.js` / `combat-v19.css` — focused-threat intelligence and Tactical Pause
- `map-v20.js` / `map-v20.css` — regional threat/reward intelligence dossiers
- `contracts-v21.js` / `contracts-v21.css` — post-Warden Hunt Board and repeatable harder contracts
- `huntmaster-v22.js` / `huntmaster-v22.css` — gated Last Toll mastery boss hunt
- `guild-v23.js` / `guild-v23.css` — local Guild Hall, guild progression and simulated Guild War vertical slice
- `ui-v24.js` / `ui-v24.css` / `ui-v24-fixes.css` — locked production visual language, navigation, panel/button system, accessibility metadata and mobile touch-target standards
- `assets/` — environments, enemy illustrations and Hunter-art runtime payloads

## Implemented

### PvE / Hunters

- Vanguard, Duelist and Physician core Hunters
- Hunter XP and leveling with visible XP-to-next-level progression
- Per-Hunter tactical doctrine readout for Brace, Sever and Field Treatment
- Front/back formation combat with automatic basic attacks
- Focus targeting and shared Resolve
- Focus, Sever, Brace and Field Treatment tactical interventions
- Tactical Pause that freezes automatic combat while preserving target selection and ability planning
- Focused-threat combat intelligence describing enemy roles and active status effects
- Bleed, Marked, Broken, Guard and Dread states
- Field-kit preparation

### Campaign / Endgame

- Four-node Ashen Marches progression with fog/locking
- Forsaken Farmstead
- Hollow Causeway
- Saint Orra Chapel
- Penitent Warden boss encounter
- Nine field-discovery risk/reward events
- Scout Tower regional intelligence showing threat profiles and base expedition rewards
- Three repeatable Hunt Board contracts: Cinder Pack, Blackroad Tithe and Echo Choir
- Contract-specific enemy HP/ATK scaling and starting Resolve pressure
- Contract bonus resources, bonus equipment and persistent completion counts
- Last Toll mastery hunt gated behind one completion of all three standard contracts
- Empowered Warden Echo and Servitor scaling with additional Resolve/Dread pressure
- Last Toll mastery bounty, guaranteed additional relic and persistent mastery completion count

### Equipment / Enclave

- Common, uncommon, rare and relic equipment
- Weapon, Head, Armor and Charm slots
- Randomized equipment affixes
- Ashen Pilgrim and Mourning Watch equipment sets
- Direct per-Hunter equipment comparison with ATK/HP deltas
- New-drop marking and set-progress indicators
- Forge crafting and salvage economy
- Coin, Iron and Salvage resources
- Hunter Hall, Forge, Infirmary, Storehouse and Scout Tower
- Hunter Hall upgrades adding Enclave Guard and March Scout support
- Infirmary readiness readout exposing treatment strength, passive triage, field-risk injury reduction and prepared-kit benefit
- Scout Tower facility readout exposing discovery chance, risky-field success chance and opening expedition advantage by level

### Guild / Strategy Layer — V23

- Guild Hall unlocked as a playable system
- Local guild formation with persistent guild name
- Guild XP, guild level, PvE contribution and persistent war record
- Seven-member prototype roster: three player Hunters plus four simulated allied members
- Simulated enemy guild: Order of Cinders
- Guild War flow: Preparation → War → Results
- Three War Table objectives: Ash Gate, Bell Tower and Black Reliquary
- Hunter-to-objective preparation assignments
- Three limited coordinated attacks per war
- Objective defense, strike-power and war-score resolution
- Enemy-guild counter-scoring
- Victory/defeat results and persistent win/loss record
- Guild XP plus Coin/Iron/Salvage war rewards

### Finalized Visual / UI System — V24

V24 is the production visual-language lock. Future screens should conform to this system rather than introducing a new visual direction.

- Unified ash-black / aged-gold material and color language
- Locked serif/display hierarchy for major game identity and headings
- Standardized muted body/secondary text hierarchy
- Standardized panels, sheets, borders, shadows and cards
- Standardized primary/secondary button treatment
- Standardized HUD and resource presentation
- Standardized bottom navigation and active-state treatment
- Standardized Enclave hotspots, March nodes and Hunter-selection states
- Production treatment applied to Guild Hall and War Table
- Consistent focus-visible keyboard/accessibility states
- Automatic button `type` and accessible-label decoration where missing
- 44px minimum mobile interaction target enforced for critical controls
- Horizontal-overflow checks across major 390px-wide phone screens
- Explicit combat retreat-control correction after the V24 gate detected its previous 34px height

## Validation

The final V24 browser gate passed in real Chromium at a **390×844 mobile viewport**. It includes:

- main mobile campaign smoke test
- Hollow Causeway visual/gameplay smoke test
- Saint Orra Chapel visual/gameplay smoke test
- Penitent Warden boss smoke test
- Storehouse and Forge smoke test
- Infirmary and Scout Tower functional test
- Hunter progression/dossier test
- Tactical Pause, paused targeting and automatic-resume combat test
- March threat/reward intelligence test
- post-Warden Hunt Board contract test
- Last Toll mastery unlock/boss/reward test
- Guild Hall formation/progression test
- Guild War preparation, coordinated attacks, scoring, rewards and persistence test
- production UI system test across title, Enclave, Hunters, Marches, inventory, Guild Hall and combat
- mobile touch-target checks
- horizontal-overflow checks
- 1,000-playthrough automated progression audit
- audit-evidence packaging
- deployable-source packaging

The V23 Guild War gate verifies local guild formation, a seven-member roster, PvE contribution, three-objective preparation, three coordinated attacks, simulated enemy scoring, war victory rewards and persistent war records.

The V24 production-UI gate initially caught the combat **Retreat from the March** control at only 34px high. The production CSS was corrected to enforce a 44px minimum target, and the complete V24 gate then passed, including the 1,000-playthrough audit and deployable-source package.

Earlier large stress testing exercised 10,000 complete progression profiles, inventory/economy mutation cycles, persistence reloads and real DOM navigation. See `FINAL_STRESS_P01.md` and the `AUDIT_1000_*` files for retained validation history.

## Prototype boundary

Prototype 0.1 still does **not** include production accounts/backend persistence, real networked guild membership, real multiplayer/PvP servers, server-scheduled Guild Wars, trading, monetization, ads or full live-ops content volume. V23 intentionally proves the Guild War gameplay loop locally before backend/network architecture is introduced.

## Next production phase

**V25 is the final interaction/polish pass**: transitions, feedback states, combat readability, loading/empty/locked states, accessibility/touch refinement and remaining cross-screen visual consistency. Backend/accounts/real multiplayer infrastructure follows after that polish pass.

The repository is the working source of truth for the playable Prototype 0.1 vertical slice.