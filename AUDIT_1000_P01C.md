# The Bell Beneath Ash — Prototype 0.1c Audit

Audit date: 2026-08-16

## Result

Prototype 0.1c passed the mobile browser smoke route and a 1,000-playthrough live-state progression audit in Chromium at a 390×844 viewport.

- Browser smoke: **PASS**
- Browser/page errors: **0**
- State invariant failures: **0**
- Progression deadlocks: **0**
- Combat-loop stalls: **0**
- Penitent Warden defeated within the audit cap: **946 / 1,000 profiles**

The incomplete runs were difficulty outcomes rather than runtime or progression failures.

## Live encounter difficulty

| Encounter | Wins | Attempts | Win rate per attempt |
|---|---:|---:|---:|
| Forsaken Farmstead | 1,000 | 1,004 | 99.6% |
| Hollow Causeway | 999 | 1,544 | 64.7% |
| Saint Orra Chapel | 981 | 1,504 | 65.2% |
| Penitent Warden | 946 | 1,698 | 55.7% |

The intended curve remains intact: Farmstead is the onboarding encounter, the Causeway and Chapel form the mid-slice resistance, and the Warden remains the hardest fight.

## Behavioral profiles

| Profile | Completion | Avg full-run attempts | Avg retained items | 2pc set | 4pc set |
|---|---:|---:|---:|---:|---:|
| Aggressive | 80.8% | 8.68 | 11.5 | 77.6% | 24.8% |
| Conservative | 100.0% | 4.45 | 12.2 | 86.0% | 26.8% |
| Optimizer | 98.8% | 4.87 | 11.6 | 93.6% | 28.4% |
| Casual | 98.8% | 5.00 | 16.0 | 89.6% | 22.4% |

The aggressive profile continues to pay a meaningful cost for taking every field risk. Defensive preparation and deliberate gearing remain rewarded without making the Warden automatic.

## 0.1c presentation changes validated

The automated mobile route explicitly verified that the new combat presentation renders without breaking progression:

- combat-state callout;
- Hunter and Threat health meters;
- enemy and Hunter formations;
- selected-target reticle;
- contextual result scene for the cleared encounter;
- existing loot/equip/Hunter Hall/Causeway progression route.

The screenshot artifact set was regenerated after the composition pass for title, Enclave, map, combat, result and inventory.

## Visual status

0.1c moves the prototype beyond the previous generic geometric stand-ins while remaining intentionally lightweight:

- Enclave, Farmstead, Causeway, Chapel, Warden and map scenes have additional architectural/environmental detail;
- Hunters and auxiliaries now have more distinct silhouettes;
- enemy types are more differentiated, including a quadruped Ash Hound and larger boss presentation;
- front/back combat rows now read spatially rather than as one flat line;
- victory screens retain the location the player just cleared.

These remain vector prototype assets, not the final illustrated art pipeline.

## Numerical scope

The 0.1c visual/composition changes did not intentionally alter combat math. Differences from the previous 1,000-run sample are expected from randomized combat, drops and field-event outcomes.

This audit supersedes `AUDIT_1000_P01B.md` as the current Prototype 0.1 validation reference.
