# Ashen Marches — Prototype 0.1

Persistent mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite vertical slice.

## Fixed playable loop

Enclave → Hunter Hall / loadout → Ashen Marches → fog-of-war exploration → field discovery → formation combat → loot → equip / compare / salvage / craft → stronger Hunters and Enclave → deeper Marches → Penitent Warden.

## Implemented

- Persistent local browser save
- Installable/offline-capable PWA shell
- Mobile-first dark iron/slate interface
- Enclave hub: Hunter Hall, Forge, Infirmary, Storehouse, Scout Tower; Guild Hall remains future-facing/locked
- Core Hunters: Vanguard, Duelist, Physician
- Hunter Hall progression expands expedition formation from 3 to 5 using Enclave Guard and March Scout support
- Hunter XP and leveling
- Four-node Ashen Marches map with progressive fog reveal
- Scout Tower intelligence and improved field-discovery outcomes
- Three expedition discovery events with risk/reward decisions
- Formation combat with front/back rows, focus targeting and multiple hostiles
- Automatic basic attacks and shared Resolve
- Focus Strike, Sever, Brace and Field Treatment interventions
- Bleed, Marked, Broken, Guard and Dread combat states
- Distinct encounter formations for Farmstead, Causeway, Chapel and Warden
- Retreat, failure and victory states
- Penitent Warden vertical-slice boss completion scene
- Common, uncommon, rare and relic loot
- Weapon, Head, Armor and Charm slots
- Deliberate Hunter assignment and loadout comparison
- Random gear affixes
- Ashen Pilgrim set: 2pc +5 total Hunter ATK; 4pc +15 starting Resolve
- Forge crafting, reforge and salvage loops
- Coin, Iron and Salvage economy
- Building upgrades with gameplay effects
- Offline asset cache and custom app icon
- Automated syntax/file validation in GitHub Actions
- Automated 100,000-expedition Monte Carlo balance smoke test on each validation run

## Current balance reference

Expected vertical-slice progression under automated tactical play currently produces approximately:

- Forsaken Farmstead: 94.7% win rate
- Hollow Causeway: 84.2%
- Saint Orra Chapel: 70.3%
- Penitent Warden: 57.9%

These are smoke-test targets, not final difficulty promises; live player testing still decides final tuning.

## Still ahead for Prototype 0.1 polish

- Replace CSS/silhouette stand-ins with final distinct illustrated 2D environment, Hunter and enemy assets
- More encounter/event variation where it materially improves replayability
- Mobile playtest fixes and UX polish
- Final economy/progression tuning from real play
- Stable public deployment URL
- Audio pass if time/resources justify it

## Explicitly later — not Prototype 0.1

Real accounts/backend persistence, multiplayer/PvP servers, real guild membership, functioning Guild Wars, territory seasons, trading, monetization, ads and live-ops content volume.

The repository is the working source of truth for Prototype 0.1.