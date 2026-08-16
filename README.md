# The Bell Beneath Ash — Prototype 0.1 · V21

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite vertical slice. The first playable campaign is **The Ashen Marches**.

## Play now

Development build:

`https://raw.githack.com/zackwaut66/git_test/main/index.html`

Immutable validated V21 snapshot:

`https://rawcdn.githack.com/zackwaut66/git_test/b5249ec8f504b58045659af647a17926e02f479c/index.html`

## Core loop

Enclave → prepare Hunters → inspect March intelligence → expedition / field discovery → formation combat → loot → compare / equip / salvage / craft → strengthen Hunters and Enclave → unlock deeper territory → defeat the Penitent Warden → take repeatable Hunt Board contracts.

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
- `assets/` — environments, enemy illustrations and Hunter-art runtime payloads

## Implemented

- Vanguard, Duelist and Physician core Hunters
- Hunter Hall upgrades adding Enclave Guard and March Scout support
- Hunter XP and leveling with visible XP-to-next-level progression
- Per-Hunter tactical doctrine readout for Brace, Sever and Field Treatment
- Four-node Ashen Marches progression with fog/locking
- Forsaken Farmstead
- Hollow Causeway
- Saint Orra Chapel
- Penitent Warden boss encounter
- Nine field-discovery risk/reward events
- Scout Tower regional intelligence showing threat profiles and base expedition rewards
- Front/back formation combat with automatic basic attacks
- Focus targeting and shared Resolve
- Focus, Sever, Brace and Field Treatment tactical interventions
- Tactical Pause that freezes automatic combat while preserving target selection and ability planning
- Focused-threat combat intelligence describing enemy roles and active status effects
- Bleed, Marked, Broken, Guard and Dread states
- Field-kit preparation
- Common, uncommon, rare and relic equipment
- Weapon, Head, Armor and Charm slots
- Randomized equipment affixes
- Ashen Pilgrim and Mourning Watch equipment sets
- Direct per-Hunter equipment comparison with ATK/HP deltas
- New-drop marking and set-progress indicators
- Forge crafting and salvage economy
- Coin, Iron and Salvage resources
- Hunter Hall, Forge, Infirmary, Storehouse and Scout Tower
- Infirmary readiness readout exposing treatment strength, passive triage, field-risk injury reduction and prepared-kit benefit
- Scout Tower facility readout exposing discovery chance, risky-field success chance and opening expedition advantage by level
- Post-Warden Hunt Board replacing the completed Directive area on the Enclave screen
- Three repeatable Hunt Board contracts: Cinder Pack, Blackroad Tithe and Echo Choir
- Contract-specific enemy HP/ATK scaling and starting Resolve pressure
- Contract bonus resources, bonus equipment and persistent completion counts
- Locked/future-facing Guild Hall
- Local browser persistence
- Illustrated title, Enclave, Hunter Hall, Marches, Farmstead, Causeway, Chapel and Warden presentation
- Illustrated encounter enemies and Penitent Warden boss/support units
- Contextual victory and contract-reward screens
- Mobile-sized combat and management controls

## Validation

The V21 browser gate passed in real Chromium at a 390×844 mobile viewport. It includes:

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
- 1,000-playthrough automated progression audit
- audit-evidence packaging
- deployable-source packaging

The V21 Hunt Board gate verifies that contracts are actually playable after the Warden, enemy difficulty modifiers apply, contract combat can resolve through the normal battle system, bonus resources and equipment are awarded, completion counts persist, and the Hunt Board remains tappable within the existing phone-sized Enclave layout.

The validator and GitHub Pages deployment are also green for the validated V21 snapshot.

Earlier large stress testing exercised 10,000 complete progression profiles, inventory/economy mutation cycles, persistence reloads and real DOM navigation. See `FINAL_STRESS_P01.md` and the `AUDIT_1000_*` files for retained validation history.

## Prototype boundary

Prototype 0.1 deliberately does **not** yet include production accounts/backend persistence, real multiplayer/PvP servers, guild membership, scheduled Guild Wars, trading, monetization, ads or full live-ops content volume.

The repository is the working source of truth for the playable Prototype 0.1 vertical slice.