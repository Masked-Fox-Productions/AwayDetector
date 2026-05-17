# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

AwayDetector is a Minecraft Bedrock add-on (with future Java/Fabric parity) that detects how long a chunk was unloaded and reports the duration via script events and redstone output. It ships a standalone custom block and a copyable block custom component that other mods can integrate.

- `awaydetector_bp/` — behavior pack: block JSON, recipe, and the script bundle entered at `scripts/main.js`.
- `awaydetector_rp/` — resource pack: lang strings and textures.
- `java-awaydetector/` — Fabric mod: Gradle-based Java project (Bedrock-first, Java port follows).

The Bedrock Script API target is `@minecraft/server` 2.3.0 against `min_engine_version` 1.20.0. Scripts are ESM (`"type": "module"` at the repo root).

## Commands

```bash
# Bedrock tests
npm test                                                              # run all unit tests
node --import ./tests/register-hooks.mjs --test tests/*.test.mjs      # all test files
node --import ./tests/register-hooks.mjs --test --test-name-pattern "computeGap" tests/*.test.mjs  # filter by name

# Java tests
cd java-awaydetector && ./gradlew test                                # run all Java tests
cd java-awaydetector && ./gradlew build                               # build mod JAR
cd java-awaydetector && ./gradlew deployToMods                        # build and deploy to .minecraft/mods
```

The `--import ./tests/register-hooks.mjs` flag is required for Bedrock tests: it installs a Node loader hook that redirects `@minecraft/server` to `tests/stubs/minecraft-server.mjs`.

There is no build step, no linter, and no package install for the Bedrock side — zero runtime dependencies.

## Architecture

AwayDetector uses **block custom components** — a different pattern from manager/subsystem architectures.

**Block custom component (`scripts/components/DetectorComponent.js`)** — registers `awaydetector:detector` via the startup event. Provides `onTick` and `onPlace` handlers. The `onTick` handler stores `system.currentTick` in a block dynamic property and compares it on the next tick to detect gaps (chunk was unloaded). Pure detection logic is extracted into a testable `computeGap()` function.

**Constants (`scripts/util/Constants.js`)** — all magic numbers: tick interval, gap threshold, redstone breakpoints, event IDs.

**Entry point (`scripts/main.js`)** — registers the block custom component. Minimal wiring.

### How detection works

The block uses `minecraft:tick` with a fixed `[20, 20]` interval (1 second). Each tick, it stores `system.currentTick` in a block dynamic property. On the next tick, if `currentTick - lastStoredTick > GAP_THRESHOLD`, the chunk was unloaded for that many ticks. The block fires an `awaydetector:chunk_returned` script event and (if supported) emits a redstone pulse.

### Reuse model

Cross-addon custom components are not supported in Bedrock. Other mods reuse AwayDetector by copying `DetectorComponent.js` into their own behavior pack and registering it in their startup event. The component name stays `awaydetector:detector`.

## Conventions

- **All magic numbers go in `scripts/util/Constants.js`.** Tick intervals, thresholds, breakpoints, event IDs.
- **Block identifiers are namespaced `awaydetector:`** (e.g. `awaydetector:awaydetector_block`).
- **Detection logic is pure and testable.** `computeGap()` has no Bedrock imports.
- **Gap threshold is exclusive.** Gap fires when `delta > GAP_THRESHOLD`, not `>=`.

## Tests

Tests live in `tests/*.test.mjs` and use `node:test` + `node:assert/strict`. The loader hook in `tests/hooks.mjs` rewrites `@minecraft/server` to the stub at `tests/stubs/minecraft-server.mjs`.

Java tests live in `java-awaydetector/src/test/` and use JUnit 5.
