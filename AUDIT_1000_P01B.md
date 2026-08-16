# The Bell Beneath Ash — Prototype 0.1b Audit

Audit date: 2026-08-16

## Result

Prototype 0.1b passed the mobile browser smoke route and a 1,000-playthrough live-state progression audit in Chromium at a 390×844 viewport.

- Browser smoke: PASS
- 1,000 simulated full progression runs completed without a combat-loop stall
- Browser/page errors: 0
- State invariant failures: 0
- Progression deadlocks: 0
- 936 / 1,000 profiles defeated the Penitent Warden within the 12-attempt-per-region audit cap

The 64 incomplete runs were difficulty failures rather than broken progression or runtime failures.

## Live encounter difficulty

| Encounter | Wins | Attempts | Win rate per attempt |
|---|---:|---:|---:|
| Forsaken Farmstead | 1,000 | 1,001 | 99.9% |
| Hollow Causeway | 1,000 | 1,489 | 67.2% |
| Saint Orra Chapel | 978 | 1,564 | 62.5% |
| Penitent Warden | 936 | 1,743 | 53.7% |

The previous backwards curve is fixed. Farmstead is now effectively a tutorial encounter, Causeway and Chapel provide the mid-slice resistance, and the Warden is the hardest encounter.

## Behavioral profiles

| Profile | Completion | Avg full-run attempts | Avg items retained | 2pc set | 4pc set |
|---|---:|---:|---:|---:|---:|
| Aggressive | 78.8% | 8.46 | 11.2 | 77.2% | 23.6% |
| Conservative | 99.6% | 4.57 | 12.1 | 86.8% | 27.2% |
| Optimizer | 98.4% | 4.90 | 11.8 | 91.6% | 29.2% |
| Casual | 97.6% | 5.25 | 15.8 | 88.8% | 22.8% |

The aggressive profile is deliberately punished for taking every field risk and spending fewer resources on defensive preparation. Conservative and optimizer behavior is rewarded without making the boss automatic.

## Loot and sets

The previous build averaged only about five items and completed its starter set too automatically. Prototype 0.1b now drops 3–4 items on ordinary victories and five on the Warden, has two functioning set families, and produces roughly 11–16 retained items by the end depending on salvage behavior.

The 4-piece set completion rate is now approximately 23–29% by profile rather than being obtained by most runs. This makes set assembly a chase rather than a nearly guaranteed tutorial outcome.

## Progression/onboarding

The detached claim-based objective list was removed. The active Directive is now derived from the same state used to gate the map:

1. Clear Forsaken Farmstead.
2. Equip recovered gear.
3. Upgrade Hunter Hall to Level 2.
4. Clear Hollow Causeway.
5. Craft one item.
6. Clear Saint Orra Chapel.
7. Defeat the Penitent Warden.

The Warden therefore cannot be reached while the guided progression is still asking for an earlier required action. The 1,000-run audit reported zero progression deadlocks and zero cases where a completed Warden path retained an earlier Directive.

## Mobile presentation audit

Viewport screenshots were captured for title, Enclave, map, combat, result and inventory. The active screens now fit the 390×844 mobile viewport instead of producing the previous 1,000–1,800px full-page layouts.

Current visual strengths:

- title premise and primary action are visible together;
- Enclave is a spatial scene with building hotspots rather than a long building-card list;
- map, combat HUD, result rewards and bottom navigation are visible without vertical page scrolling;
- multi-drop results and inventory comparison are readable in one mobile layout.

Current visual limitation: environments and characters are still deliberately lightweight vector/CSS prototype art. The interface now behaves like a game screen rather than a dashboard, but the next art pass should replace the geometric stand-ins with distinctive illustrated 2D assets.

## Architecture

The active application has been consolidated into `app.js` and `app.css`; the legacy load-order monkey-patch scripts remain in repository history but are no longer loaded by `index.html`.

The CI path now tests the active build directly:

- syntax/source validation;
- Playwright mobile smoke route;
- 1,000 live-state progression simulations;
- screenshot + JSON audit artifact.

This audit supersedes the old detached `balance-test.js` percentages for live Prototype 0.1b tuning.