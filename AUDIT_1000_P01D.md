# The Bell Beneath Ash — Prototype 0.1d Audit

Audit date: 2026-08-16

## Result

Prototype 0.1d passed the mobile browser smoke route and a 1,000-playthrough live-state progression audit in Chromium at a 390×844 viewport.

- Browser smoke: **PASS**
- Browser/page errors: **0**
- State invariant failures: **0**
- Progression deadlocks: **0**
- Combat-loop stalls: **0**
- Penitent Warden defeated within the audit cap: **949 / 1,000 profiles**

## Live encounter difficulty

| Encounter | Wins | Attempts | Win rate per attempt |
|---|---:|---:|---:|
| Forsaken Farmstead | 1,000 | 1,005 | 99.5% |
| Hollow Causeway | 1,000 | 1,543 | 64.8% |
| Saint Orra Chapel | 989 | 1,469 | 67.3% |
| Penitent Warden | 949 | 1,844 | 51.5% |

The 0.1d pass did not intentionally alter combat math. Variation from the previous audit comes from randomized combat, drops and field-event outcomes.

## Behavioral profiles

| Profile | Completion | Avg full-run attempts | Avg retained items | 2pc set | 4pc set |
|---|---:|---:|---:|---:|---:|
| Aggressive | 85.6% | 8.53 | 11.7 | 79.2% | 22.4% |
| Conservative | 99.6% | 4.51 | 12.2 | 86.4% | 24.8% |
| Optimizer | 97.2% | 5.24 | 11.7 | 90.4% | 28.4% |
| Casual | 97.2% | 5.16 | 15.9 | 83.6% | 22.8% |

## Loot usability changes validated

The mobile smoke route now explicitly verifies the loot-heavy loop after the first victory:

- freshly recovered items are marked **NEW**;
- both equipment sets render four-piece progress indicators;
- every item shows a direct comparison line for the selected Hunter;
- an empty slot shows the full stat gain from equipping the item;
- an occupied slot shows explicit ATK and HP deltas against the currently equipped same-slot item;
- changing equipment immediately updates the comparison state to **CURRENTLY EQUIPPED**;
- the existing equip → Hunter Hall upgrade → Causeway unlock progression remains intact.

The comparison intentionally exposes raw stat differences instead of hiding the decision behind a single opaque power score. Set-family changes are also surfaced when a candidate item would change the equipped set.

## Mobile presentation

The regenerated inventory screenshot fits the 390×844 viewport with the two set trackers, Hunter selector, three freshly recovered items, comparison lines, equip controls, salvage controls and bottom navigation visible in the mobile layout.

This audit supersedes `AUDIT_1000_P01C.md` as the current Prototype 0.1 validation reference.
