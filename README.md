# The Bell Beneath Ash — Prototype 0.1 · V28

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite. The first playable campaign is **The Ashen Marches**.

## Current core loop

Expeditions / contracts / guild wars → earn Coin, Iron, Salvage and equipment → reclaim Enclave land → choose permanent district buildings → upgrade those buildings → gain kingdom-wide combat/economy/war bonuses → expand farther → defeat regional threats and improve the guild.

This is now the intended Kingdoms-at-War-style foundation: the Enclave is not merely a menu hub; land and construction are persistent strategic progression.

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

The Enclave now contains six sequential land districts:

1. Inner Ward
2. Ash Court
3. West Rampart
4. Lower Foundry
5. Cinder Quarter
6. Outer Bailey

Land reclamation becomes progressively more expensive. Every reclaimed district becomes a construction plot. The player chooses one of four permanent specializations:

- **Bastion** — Hunter HP and Guild War defense
- **Arsenal** — Hunter ATK and Guild War strike power
- **Foundry** — increased expedition resource recovery
- **Vigil Shrine** — increased starting Resolve

Buildings upgrade through three tiers and the bonuses stack across the kingdom. These bonuses feed into live Hunter stats, expedition combat, resource recovery and Guild Wars.

### Dynamic Enclave Growth — V28

The main Enclave scene now changes with kingdom state rather than showing essentially the same settlement throughout progression.

- unreclaimed districts appear as ruined ground
- reclaimed empty wards visibly open space in the settlement
- Bastion, Arsenal, Foundry and Vigil Shrine receive different silhouettes/material cues
- building levels 1–3 visibly increase structure scale and complexity
- Foundries add furnace glow and smoke
- settlement walls, gate presence, lighting and overall footprint intensify as more land is reclaimed
- the scene moves through small → mid → large → fortress composition states
- the screen reports reclaimed wards, built structures and total building tiers

The V28 visual gate explicitly compares a fresh 1/6-ward Enclave against a fully reclaimed six-ward fortress.

## Presentation layers

The live entry point is `index.html`. Major current layers include:

- `guild-v23.js/css` — Guild Hall and simulated Guild Wars
- `ui-v24.js/css` + fixes — production UI language and 44px mobile interaction standard
- `polish-v25.js/css` — interaction/accessibility polish
- `enclave-v26.js/css` — illustrated Enclave environment rebuild
- `kingdom-v27.js/css` — land reclamation, construction, tiers and permanent kingdom bonuses
- `kingdom-v28.js/css` — dynamic settlement growth on the main Enclave scene

Earlier campaign/combat/facility layers remain active and are validated by the regression suite.

## Validation

V28 passes the complete 390×844 mobile Chromium regression gate, including:

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
- standard 1,000-playthrough progression audit
- deployable-source packaging

### 10,000-profile background-mechanics stress gate

The current background systems were additionally tested across **10,000 simulated progression profiles**, split into ten isolated 1,000-profile Chromium batches. **All ten batches passed.**

Each batch fails automatically on browser/runtime errors, tested state-invariant violations or progression/combat deadlocks. The final gate completed with no batch triggering those conditions. It covers five player strategies, the full campaign, combat/retry behavior, equipment/crafting progression, all six kingdom depths, all four kingdom specializations, building tiers 1–3, kingdom combat/economy/war bonuses, Guild persistence and Kingdom persistence.

See `STRESS_10000_V28.md` for the dedicated report. Earlier retained stress/audit history remains in `FINAL_STRESS_P01.md` and the `AUDIT_1000_*` files.

## Prototype boundary

The current build still uses local browser persistence and simulated guild opponents. It does **not** yet include production accounts/backend persistence, actual networked guild membership, real multiplayer/PvP servers, server-scheduled wars, trading, monetization or live-ops infrastructure.

The repository is the working source of truth for the playable prototype.