# The Bell Beneath Ash — Prototype 0.1 Final

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite vertical slice. The first playable region is **The Ashen Marches**.

## Playable loop

Enclave → prepare Hunters → fog-covered Marches → field discovery → formation combat → multi-item loot → compare / equip / salvage / craft → strengthen Hunters and Enclave → unlock deeper territory → Penitent Warden.

## Prototype status

**Prototype 0.1 is feature-frozen and has passed its final stress-validation gate.**

The playable application is consolidated into:

- `index.html`
- `app.js`
- `app.css`
- `sw.js`
- `manifest.webmanifest`

Older Prototype 0.1 module files remain in the repository for development history but are no longer loaded by the live application.

## Implemented in Prototype 0.1 Final

- One-screen title/premise and mobile-first first-session flow
- Persistent local browser save while preserving the validated Prototype 0.1 save key
- Installable/offline-capable PWA shell
- Spatial Enclave scene with Hunter Hall, Forge, Infirmary, Storehouse, Scout Tower and locked future Guild Hall
- State-derived Directive system tied directly to progression gates
- Vanguard, Duelist and Physician core Hunters
- Hunter Hall upgrades adding Enclave Guard and March Scout support
- Hunter XP and leveling
- Four-node Ashen Marches progression with fog/locking
- Forsaken Farmstead, Hollow Causeway, Saint Orra Chapel and Penitent Warden
- Nine field-discovery risk/reward events across the three non-boss locations
- Three tested combat-roster signatures per encounter: base plus two alternates
- Front/back formation combat with automatic basic attacks
- Focus targeting and shared Resolve
- Focus, Sever, Brace and Field Treatment tactical interventions
- Bleed, Marked, Broken, Guard and Dread states
- Field-kit preparation
- 3–4 equipment drops from normal victories; 5 from the Warden
- Common, uncommon, rare and relic equipment
- Weapon, Head, Armor and Charm slots
- 33 tested equipment names including the Warden relic
- 12 randomized affixes
- Ashen Pilgrim set: 2pc attack bonus / 4pc starting Resolve bonus
- Mourning Watch set: 2pc HP bonus / 4pc incoming-damage reduction
- Direct per-Hunter loot comparison against the currently equipped same-slot item
- Explicit ATK/HP deltas rather than a hidden generic power score
- New-drop marking on freshly recovered equipment
- Four-pip visual progress for both functioning equipment sets
- Forge crafting and salvage economy
- Coin, Iron and Salvage resources
- Building upgrades with gameplay effects
- Detailed vector prototype scenes for the Enclave, Farmstead, Causeway, Chapel, Warden and Marches map
- Distinct Hunter/support silhouettes and differentiated enemy silhouettes, including a quadruped Ash Hound and enlarged Warden
- Combat-state callouts, selected-target reticle, Hunter/Threat meters and readable ability intent labels
- Front/back-row visual depth in combat composition
- Contextual victory art using the cleared encounter environment

## Final stress validation

The release gate ran **10,000 complete progression profiles** in real Chromium at a 390×844 mobile viewport, plus **500 inventory/economy mutation cycles**, **75 persistence reloads**, and **600 real DOM navigation clicks**.

Final result:

- Browser/page errors: **0**
- Tested state-invariant failures: **0**
- Progression/combat-loop deadlocks: **0**
- Persistence failures: **0 / 75**
- Field-discovery coverage: **9 / 9**
- Encounter-roster coverage: **3 / 3 for every encounter**
- Equipment-name coverage: **33**
- Affix coverage: **12 / 12**
- Penitent Warden defeated within the stress retry cap: **9,663 / 10,000 profiles**
- Final stress gate: **PASS**

Encounter win rates per attempt in the final 10,000-profile run:

- Forsaken Farmstead: **99.69%**
- Hollow Causeway: **68.00%**
- Saint Orra Chapel: **72.67%**
- Penitent Warden: **58.88%**

See `FINAL_STRESS_P01.md` for the full release validation. Earlier `AUDIT_1000_*` files are retained as tuning history.

## Current development playtest

`https://raw.githack.com/zackwaut66/git_test/main/index.html`

See `PLAYTEST.md` for the intended first-session route.

## Next development stage

Prototype 0.1 should no longer expand in scope. The next stage can concentrate on human mobile playtesting, stronger distinctive illustrated assets, additional PvE depth, and preparation for the later persistence/backend phase without destabilizing the validated vertical slice.

## Explicitly later — not Prototype 0.1

Production accounts/backend persistence, real multiplayer/PvP servers, guild membership, scheduled Guild Wars, territory seasons, trading, monetization, ads and live-ops content volume.

The repository is the working source of truth for **Prototype 0.1 Final**.
