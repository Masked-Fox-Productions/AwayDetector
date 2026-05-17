import { world, system } from "@minecraft/server";

// SETUP: Replace "awaydetector" with your mod ID throughout this file
// SETUP: Import your own manager, subsystems, and handlers below

/**
 * AwayDetector — Entry Point
 *
 * Startup order matters: the manager must exist before any subsystem
 * so its reference can be shared. Subsystems register their own
 * Bedrock event hooks via .register().
 *
 * Architecture:
 *   1. Manager (data layer — must exist first)
 *   2. Subsystems (each owns one event subscription or interval)
 *   3. Block handlers (thin glue between Bedrock events and domain)
 */

console.warn("[awaydetector] === Mod initializing ==="); // SETUP: Replace "awaydetector"

// --- Manager ---
// SETUP: Create your manager instance here
// const manager = new MyManager();

// --- Persistence: load on worldInitialize ---
world.afterEvents.worldInitialize.subscribe(() => {
  console.warn("[awaydetector] worldInitialize fired — loading persistence"); // SETUP: Replace "awaydetector"
  // manager.load();
});

// --- Subsystems ---
// SETUP: Create and register your subsystems here
// const mySub = new MySubsystem(manager);
// mySub.register();

// --- Block handlers ---
// SETUP: Create and register your block handlers here
// const myHandler = new MyHandler(manager);
// myHandler.register();

// --- Fallback load ---
// Some Bedrock builds don't fire worldInitialize on script reload.
// This one-shot fallback ensures persistence is hydrated.
system.run(() => {
  console.warn("[awaydetector] Fallback load triggered"); // SETUP: Replace "awaydetector"
  // manager.load();
});

console.warn("[awaydetector] === Initialization complete ==="); // SETUP: Replace "awaydetector"
