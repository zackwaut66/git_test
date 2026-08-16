# The Bell Beneath Ash — Prototype 0.1b

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite vertical slice. The first playable region is **The Ashen Marches**.

## Playable loop

Enclave → prepare Hunters → fog-covered Marches → field discovery → formation combat → multi-item loot → equip / salvage / craft → strengthen Hunters and Enclave → unlock deeper territory → Penitent Warden.

## Active build

The playable application is now consolidated into:

- `index.html`
- `app.js`
- `app.css`
- `sw.js`
- `manifest.webmanifest`

Older Prototype 0.1 module files remain in the repository for history but are no longer loaded by the live application.

## Implemented in 0.1b

- One-screen title/premise and mobile-first first-session flow
- Persistent local browser save using a fresh 0.1b save version
- Installable/offline-capable PWA shell
- Spatial Enclave scene with Hunter Hall, Forge, Infirmary, Storehouse, Scout Tower and locked future Guild Hall
- State-derived Directive system tied directly to progression gates
- Vanguard, Duelist and Physician core Hunters
- Hunter Hall upgrades adding Enclave Guard and March Scout support
- Hunter XP and leveling
- Four-node Ashen Marches progression with fog/locking
- Forsaken Farmstead, Hollow Causeway, Saint Orra Chapel and Penitent Warden
- Field discovery risk/reward events
- Front/back formation combat with automatic basic attacks
- Focus targeting and shared Resolve
- Focus, Sever, Brace and Field Treatment tactical interventions
- Bleed, Marked, Broken, Guard and Dread states
- Field-kit preparation
- 3–4 equipment drops from normal victories; 5 from the Warden
- Common, uncommon, rare and relic equipment
- Weapon, Head, Armor and Charm slots
- Random affixes
- Ashen Pilgrim set: 2pc attack bonus / 4pc starting Resolve bonus
- Mourning Watch set: 2pc HP bonus / 4pc incoming-damage reduction
- Forge crafting and salvage economy
- Coin, Iron and Salvage resources
- Building upgrades with gameplay effects
- Mobile smoke testing and real-browser 1,000-playthrough audit in GitHub Actions

## Current audited difficulty

The latest successful 1,000-run browser-connected audit produced:

- Forsaken Farmstead: **99.9%** wins per attempt
- Hollow Causeway: **67.2%**
- Saint Orra Chapel: **62.5%**
- Penitent Warden: **53.7%**

Across four automated behavior profiles, 936 / 1,000 complete progression runs defeated the Warden within the audit retry cap. The run recorded zero browser errors, zero tested state-invariant failures, and zero progression deadlocks.

See `AUDIT_1000_P01B.md` for the full audit.

## Current development playtest

`https://raw.githack.com/zackwaut66/git_test/main/index.html`

See `PLAYTEST.md` for the intended first-session route.

## Still ahead for Prototype 0.1 polish

- Replace geometric/vector prototype stand-ins with distinctive illustrated 2D environments, Hunters and enemies
- Continue tuning combat feel from human mobile play rather than simulation alone
- Expand enemy/event/loot variety where it materially improves replayability
- Refine equipment comparison and set-chase presentation
- Establish a stable first-party deployment URL rather than the development raw.githack route
- Audio pass if justified by the prototype

## Explicitly later — not Prototype 0.1

Production accounts/backend persistence, real multiplayer/PvP servers, guild membership, scheduled Guild Wars, territory seasons, trading, monetization, ads and live-ops content volume.

The repository is the working source of truth for Prototype 0.1b.