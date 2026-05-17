export const BLOCK_ID = "awaydetector:awaydetector_block";
export const COMPONENT_ID = "awaydetector:detector";
export const SCRIPT_EVENT_ID = "awaydetector:chunk_returned";

export const TICK_INTERVAL = 20;
export const GAP_THRESHOLD = 40;

export const PULSE_DURATION = 20;

// Logarithmic breakpoints: index = signal strength (1-15), value = minimum ticks away
export const REDSTONE_BREAKPOINTS = [
  0,      // 0: unused (no signal)
  20,     // 1: ~1 second
  60,     // 2: ~3 seconds
  200,    // 3: ~10 seconds
  600,    // 4: ~30 seconds
  1200,   // 5: ~1 minute
  2400,   // 6: ~2 minutes
  6000,   // 7: ~5 minutes
  12000,  // 8: ~10 minutes
  24000,  // 9: ~20 minutes
  36000,  // 10: ~30 minutes
  48000,  // 11: ~40 minutes
  60000,  // 12: ~50 minutes
  72000,  // 13: ~1 hour
  108000, // 14: ~1.5 hours
  144000, // 15: ~2+ hours
];
