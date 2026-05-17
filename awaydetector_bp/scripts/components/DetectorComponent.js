import { system } from "@minecraft/server";
import {
  GAP_THRESHOLD,
  SCRIPT_EVENT_ID,
  REDSTONE_BREAKPOINTS,
  PULSE_DURATION,
} from "../util/Constants.js";

const LAST_TICK_KEY = "awaydetector:lastTick";

export function computeGap(lastTick, currentTick, threshold) {
  if (lastTick === undefined || lastTick === null) return null;
  const delta = currentTick - lastTick;
  if (delta <= 0) return null;
  if (delta > threshold) return delta;
  return null;
}

export function computeSignalStrength(ticksAway) {
  let strength = 0;
  for (let i = REDSTONE_BREAKPOINTS.length - 1; i >= 1; i--) {
    if (ticksAway >= REDSTONE_BREAKPOINTS[i]) {
      strength = i;
      break;
    }
  }
  return strength;
}

function buildPayload(block, ticksAway) {
  const loc = block.location;
  return JSON.stringify({
    x: loc.x,
    y: loc.y,
    z: loc.z,
    dimension: block.dimension.id,
    ticksAway,
  });
}

export const detectorComponent = {
  onPlace(event) {
    const { block } = event;
    block.setDynamicProperty(LAST_TICK_KEY, system.currentTick);
  },

  onTick(event) {
    const { block } = event;
    const currentTick = system.currentTick;
    const lastTick = block.getDynamicProperty(LAST_TICK_KEY);

    const gap = computeGap(lastTick, currentTick, GAP_THRESHOLD);

    if (gap !== null) {
      const payload = buildPayload(block, gap);
      try {
        block.dimension.runCommand(
          `scriptevent ${SCRIPT_EVENT_ID} ${payload}`
        );
      } catch (e) {
        console.warn(`[awaydetector] Failed to fire script event: ${e}`);
      }

      const strength = computeSignalStrength(gap);
      if (strength > 0) {
        try {
          block.setPermutation(
            block.permutation.withState("awaydetector:signal_strength", strength)
          );
          system.runTimeout(() => {
            try {
              const current = block.dimension.getBlock(block.location);
              if (current?.typeId === block.typeId) {
                current.setPermutation(
                  current.permutation.withState("awaydetector:signal_strength", 0)
                );
              }
            } catch (_) {}
          }, PULSE_DURATION);
        } catch (e) {
          console.warn(`[awaydetector] Failed to set redstone signal: ${e}`);
        }
      }
    }

    block.setDynamicProperty(LAST_TICK_KEY, currentTick);
  },
};
