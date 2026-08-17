# The Bell Beneath Ash — Prototype 0.1 · V30

Mobile-first 2D gothic post-apocalyptic strategy RPG/MMO-lite. The first playable campaign is **The Ashen Marches**.

## Current core loop

Expeditions / contracts / wars → earn Coin, Iron, Salvage and equipment → reclaim Enclave land → choose permanent district buildings → upgrade buildings and train the War Host → gain kingdom-wide combat/economy/war bonuses → climb regional standings → challenge rival powers in scheduled wars → expand farther and strengthen the realm.

The Enclave is persistent strategic territory rather than only a menu hub, and V30 makes the Realm/war layer a visible primary game system.

## Major playable systems

- Vanguard, Duelist and Physician Hunters with XP, equipment and tactical doctrines
- stable SVG Hunter rendering in the Hall and combat; the mobile-corrupting WebP runtime path has been removed
- four-region Ashen Marches campaign
- field-discovery events and formation combat
- Tactical Pause, targeting, Resolve and status effects
- crafting, salvage, equipment rarity/affixes and item sets
- Penitent Warden regional boss
- three repeatable post-Warden Hunt Board contracts
- Last Toll mastery boss hunt
- six-district Enclave land-reclamation and construction system
- four permanent building specializations with three tiers
- visibly growing Enclave settlement
- Guild Hall and persistent local guild progression
- dedicated **Realm** navigation and Enclave Realm summary
- persistent **War Host** with Levy, Guard and Scouts
- troop training, army capacity and permanent war power
- five simulated rival powers
- regional prestige rankings and realm tiers
- influence-based realm standing
- scheduled Realm Wars: **Preparation → War → Results**
- three assigned Hunter strike teams and three coordinated war objectives
- Kingdom and Guild bonuses feeding directly into Realm War resolution
- persistent war score, prestige, influence, win/loss record and war rewards

## Kingdom / Enclave progression

The Enclave contains six sequential land districts: Inner Ward, Ash Court, West Rampart, Lower Foundry, Cinder Quarter and Outer Bailey. Reclaimed districts become construction plots. The player chooses a permanent specialization:

- **Bastion** — Hunter HP and war defense
- **Arsenal** — Hunter ATK and war strike power
- **Foundry** — increased expedition resource recovery
- **Vigil Shrine** — increased starting Resolve

Buildings upgrade through three tiers and bonuses stack across the kingdom. V28 makes this progression physically visible on the main Enclave scene.

## Realm strategy — V30

V30 adds the missing persistent strategy backbone on top of the Enclave and Guild systems.

The player now maintains a persistent War Host, increases army capacity through settlement/Hall growth, trains troop classes using normal game resources, earns Prestige and Influence, advances Realm standing/tier, sees a regional ladder, and declares wars against simulated rival powers.

Realm Wars use a timed Preparation phase, assignment of Vanguard/Duelist/Physician to Outer Gate, Signal Tower and War Keep objectives, a limited coordinated-attack War phase, enemy counter-scoring, and a persistent Results phase with rewards and rating/standing changes.

This remains a **local multiplayer simulation prototype**. Rival powers and rankings are simulated until production backend/network play is implemented.

## Presentation / interaction

Major current layers include:

- `v7.js` / `combat-v8.js` — stable vector Hunter art path
- `guild-v23.js/css` — Guild Hall and prototype Guild Wars
- `ui-v24.js/css` + fixes — production UI language and 44px mobile interaction standard
- `polish-v25.js/css` — interaction/accessibility polish
- `enclave-v26.js/css` — illustrated Enclave environment
- `kingdom-v27.js/css` — land, construction, tiers and permanent bonuses
- `kingdom-v28.js/css` — dynamic settlement growth
- `polish-v29.js/css` — modal focus, accessibility and combat readability
- `strategy-v30.js/css` — Realm, War Host, rivals, rankings and scheduled Realm Wars

## Validation

V30 passes the complete **390×844 mobile Chromium regression gate**, including all campaign, combat, equipment, facility, Hunt Board, mastery, Guild, UI, Kingdom and dynamic-Enclave tests plus the V30 Realm strategy test and standard **1,000-playthrough audit**.

The V30 strategy gate verifies stable SVG Hunter rendering, visible Realm access, War Host training, army-power growth, rival selection, scheduled-war preparation, Hunter assignments, coordinated attacks, persistent war record, Prestige, Influence, rankings and reward claiming.

### 10,000-profile mechanics stress gate

V30 also passes a dedicated **10,000-profile stress gate**, split into ten isolated 1,000-profile Chromium batches. Each batch includes the established full campaign/Kingdom/Guild stress profiles and additional V30 Realm-state profiles covering persistence, army-power invariants, ranking order, war phases, assignments, scoring and state bounds. All ten batches passed.

## Playable deployment

GitHub Pages publishes the complete playable source and verifies referenced assets plus key live runtime files after deployment.

`https://zackwaut66.github.io/git_test/`

## Prototype boundary

The current build uses local browser persistence and simulated rival/guild powers. It does **not** yet include production accounts/backend persistence, actual networked guild membership, real player-vs-player servers, server-authoritative scheduled wars, trading, monetization or live-ops infrastructure.

The repository is the working source of truth for the playable prototype.
