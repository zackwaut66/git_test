# The Bell Beneath Ash — Prototype 0.1b Phone Playtest

**Development playtest:**

https://raw.githack.com/zackwaut66/git_test/main/index.html

Prototype 0.1b starts from a fresh save key so the rebuilt first-session flow can be tested cleanly.

## Current intended first session

1. Read the title-screen premise and tap **BEGIN THE MARCH**.
2. Follow the single active Directive instead of reading a multi-step tutorial wall.
3. Enter the Marches and clear Forsaken Farmstead.
4. Secure the multi-item loot drop and equip one recovered item.
5. Upgrade Hunter Hall to Level 2; this unlocks Hollow Causeway and Enclave Guard support.
6. Clear Hollow Causeway, salvage unwanted gear if needed, and craft one item at the Forge.
7. Push through Saint Orra Chapel.
8. Prepare for and fight the Penitent Warden.

## What changed after the 1,000-run audit

- One-screen title/premise instead of an overlong briefing page.
- Active objective chain is tied directly to progression gates, so it cannot remain behind the player.
- Enclave is now an illustrated scene with building hotspots instead of a long stack of cards.
- Map, Hunter Hall and combat are designed to fit the phone viewport rather than becoming multi-screen pages.
- Normal victories now produce 3–4 equipment drops; the Warden produces 5.
- Two functioning equipment sets are in the loot pool: Ashen Pilgrim and Mourning Watch.
- The active application is consolidated into `app.js` + `app.css`; the old load-order override modules are no longer loaded.
- The browser CI still runs a real mobile smoke route plus 1,000 full progression simulations after changes.

## Playtest focus

Note anything that is confusing without explanation, any action that feels pointless, combat that feels trivial or unfair, loot that is uninteresting, text that is difficult to read, and any screen that still feels like a web dashboard instead of a game.
