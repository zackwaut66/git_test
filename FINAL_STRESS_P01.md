# The Bell Beneath Ash — Prototype 0.1 Final Stress Validation

Validation date: 2026-08-16

## Release gate

**PASS**

Prototype 0.1 Final completed the release stress gate in a real Chromium browser using a 390×844 mobile viewport.

The final gate combined:

- **10,000** complete progression profiles across five behavior styles
- **500** dense inventory/economy mutation cycles
- **75** full browser reload persistence checks
- **600** real DOM navigation clicks
- explicit authored-content coverage checks for field discoveries, encounter rosters, equipment names and affixes

## Stability result

- Browser/page errors: **0**
- Tested state-invariant failures: **0**
- Progression/combat-loop deadlocks: **0**
- Persistence failures across 75 reloads: **0**
- Final stress gate: **PASS**

## 10,000-run progression result

| Encounter | Wins | Attempts | Win rate per attempt |
|---|---:|---:|---:|
| Forsaken Farmstead | 10,000 | 10,031 | **99.69%** |
| Hollow Causeway | 10,000 | 14,705 | **68.00%** |
| Saint Orra Chapel | 9,926 | 13,659 | **72.67%** |
| Penitent Warden | 9,663 | 16,410 | **58.88%** |

**9,663 / 10,000 progression profiles defeated the Penitent Warden within the stress retry cap.**

## Behavior profiles

| Profile | Completed | Completion rate | Avg attempts | 2pc set rate | 4pc set rate |
|---|---:|---:|---:|---:|---:|
| Aggressive | 1,726 / 2,000 | 86.30% | 8.34 | 79.85% | 24.30% |
| Conservative | 1,998 / 2,000 | 99.90% | 4.31 | 90.00% | 22.80% |
| Optimizer | 1,980 / 2,000 | 99.00% | 4.93 | 94.35% | 32.95% |
| Casual | 1,976 / 2,000 | 98.80% | 4.97 | 89.80% | 25.30% |
| Hoarder | 1,983 / 2,000 | 99.15% | 4.85 | 91.00% | 28.70% |

The aggressive profile intentionally takes every risky field-discovery option and uses a less defensive combat pattern, so its lower completion rate is expected behavior rather than a progression lock.

## Authored-content coverage

The stress run verified that randomized systems were actually reachable rather than merely present in source code.

### Field discoveries

**9 / 9 discovered:**

- The Buried House
- The Cinder Well
- The Empty Table
- The Hanging Bus
- The Toll Keeper
- The Sunken Convoy
- The Unlit Shrine
- The Choir Door
- The Bone Censer

### Encounter rosters

Each of the four encounters exposed **3 / 3 distinct tested roster signatures**, including the base roster and two alternates.

### Loot generation

- Distinct equipment-name coverage: **33**
- Random affix coverage: **12 / 12**
- Both functioning four-piece set families remained reachable across all tested behavior profiles.

## Mutation and persistence torture

The additional mutation pass repeatedly created dense inventories, equipped and replaced items, salvaged unequipped gear, crafted equipment, upgraded facilities, saved state and revalidated equipment ownership mappings. Across **500** cycles it produced **0** tested invariant failures.

A nontrivial save containing resources, progression, inventory and equipped gear was then reloaded **75 consecutive times**. The persisted fingerprint matched every time.

The mobile UI was also driven through **600 real navigation clicks** before entering live combat. No browser errors were recorded, and the final 390×844 combat screenshot rendered the encounter, formation, targeting state, meters, Resolve abilities and retreat control without a tested navigation failure.

## Final status

Prototype 0.1 is **feature-frozen and stress-validated** for its intended vertical-slice scope. Further work should begin as the next development stage rather than continue expanding the Prototype 0.1 release gate.
