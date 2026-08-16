# The Bell Beneath Ash — Prototype 0.1 Final Phone Playtest

**Development playtest:**

https://raw.githack.com/zackwaut66/git_test/main/index.html

Prototype 0.1 Final intentionally preserves the validated `bell-beneath-ash-p01b` browser save key so existing stress-tested persistence behavior is not disturbed. Clear the site's local data only when a clean first-session test is specifically needed.

## Current intended first session

1. Read the title-screen premise and tap **BEGIN THE MARCH**.
2. Follow the single active Directive instead of reading a multi-step tutorial wall.
3. Enter the Marches and clear Forsaken Farmstead.
4. Secure the multi-item loot drop and equip one recovered item.
5. Upgrade Hunter Hall to Level 2; this unlocks Hollow Causeway and Enclave Guard support.
6. Clear Hollow Causeway, salvage unwanted gear if needed, and craft one item at the Forge.
7. Push through Saint Orra Chapel.
8. Prepare for and fight the Penitent Warden.

## Validated Prototype 0.1 Final changes

- One-screen title/premise instead of an overlong briefing page.
- Active objective chain is tied directly to progression gates, so it cannot remain behind the player.
- Enclave is an illustrated scene with building hotspots instead of a long stack of cards.
- Map, Hunter Hall and combat are designed to fit the phone viewport rather than becoming multi-screen pages.
- Normal victories produce 3–4 equipment drops; the Warden produces 5.
- Two functioning equipment sets are in the loot pool: Ashen Pilgrim and Mourning Watch.
- The active application is consolidated into `app.js` + `app.css`; older development modules are retained only as history.
- Automated validation includes a real mobile browser smoke route plus progression simulation after changes.

## Human playtest focus

Note anything that is confusing without explanation, any action that feels pointless, combat that feels trivial or unfair, loot that is uninteresting, text that is difficult to read, and any screen that still feels like a web dashboard instead of a game.
