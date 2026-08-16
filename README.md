# The Bell Beneath Ash — Prototype 0.1 · V17

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite vertical slice. The first playable campaign is **The Ashen Marches**.

## Play now

Development build:

`https://raw.githack.com/zackwaut66/git_test/main/index.html`

Immutable validated V17 runtime snapshot:

`https://rawcdn.githack.com/zackwaut66/git_test/4e7c8b3dec93671bef9b59a6a2a46699323fad7f/index.html`

## Core loop

Enclave → prepare Hunters → Ashen Marches → field discovery → formation combat → loot → compare / equip / salvage / craft → strengthen Hunters and Enclave → unlock deeper territory → defeat the Penitent Warden.

## Current playable build

The live entry point is `index.html`. It loads the validated gameplay core plus the current presentation layers:

- `app.js` / `app.css` — game state, progression, combat, loot, buildings, persistence and base UI
- `v7.js` / `v7.css` / `v7-art-polish.css` — illustrated Hunter Hall and generated Hunter art
- `combat-v8.js` / `combat-v8.css` — illustrated formation combat
- `map-v9.css` — Ashen Marches map presentation
- `enclave-v10.css` — Enclave presentation
- `result-v11.css` — victory and recovered-loot presentation
- `title-v12.css` — title screen presentation
- `causeway-v13.css` — Hollow Causeway presentation
- `chapel-v14.css` — Saint Orra Chapel presentation
- `warden-v15.css` — Penitent Warden arena, boss and victory presentation
- `storehouse-v16.css` — Storehouse, equipment comparison and Forge cohesion pass
- `facilities-v17.js` / `facilities-v17.css` — Infirmary medical-readiness and Scout Tower field-intelligence presentation
- `assets/` — environments, enemy illustrations and Hunter-art runtime payloads

## Implemented

- Vanguard, Duelist and Physician core Hunters
- Hunter Hall upgrades adding Enclave Guard and March Scout support
- Hunter XP and leveling
- Four-node Ashen Marches progression with fog/locking
- Forsaken Farmstead
- Hollow Causeway
- Saint Orra Chapel
- Penitent Warden boss encounter
- Nine field-discovery risk/reward events
- Front/back formation combat with automatic basic attacks
- Focus targeting and shared Resolve
- Focus, Sever, Brace and Field Treatment tactical interventions
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
- Scout Tower intelligence readout exposing discovery chance, risky-field success chance and opening expedition advantage by facility level
- Locked/future-facing Guild Hall
- Local browser persistence
- Illustrated title, Enclave, Hunter Hall, Marches, Farmstead, Causeway, Chapel and Warden presentation
- Illustrated encounter enemies and Penitent Warden boss/support units
- Contextual victory screens
- Mobile-sized combat and management controls

## Validation

The V17 browser gate passed in real Chromium at a 390×844 mobile viewport. It includes:

- main mobile campaign smoke test
- Hollow Causeway visual/gameplay smoke test
- Saint Orra Chapel visual/gameplay smoke test
- Penitent Warden boss smoke test
- Storehouse and Forge smoke test
- Infirmary Field Kit functional test
- Scout Tower intelligence and upgrade functional test
- 1,000-playthrough automated progression audit
- deployable-source packaging

The V17 facility gate verified that the Infirmary consumes the expected 18 Coin for a prepared Field Kit, that the Scout Tower upgrades from Lv1 to Lv2 for 20 Iron, that the displayed scouting values refresh after upgrading, and that the new facility controls meet the mobile interaction target used by the test suite.

Earlier large stress testing also exercised 10,000 complete progression profiles, inventory/economy mutation cycles, persistence reloads and real DOM navigation. See `FINAL_STRESS_P01.md` and the `AUDIT_1000_*` files for the retained validation history.

## Prototype boundary

Prototype 0.1 deliberately does **not** yet include production accounts/backend persistence, real multiplayer/PvP servers, guild functionality, scheduled Guild Wars, trading, monetization, ads or live-ops content volume.

The repository is the working source of truth for the playable Prototype 0.1 vertical slice.