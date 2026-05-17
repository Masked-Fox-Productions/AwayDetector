# AwayDetector

A Minecraft Bedrock add-on that detects how long a chunk was unloaded and reports the duration via script events and redstone output. Think of it as a daylight detector, but for time — it senses how long the world forgot about a location.

## How It Works

The Away Detector block ticks once per second. Each tick, it records the current game tick in a block property. When the chunk unloads (because the player walked away), ticking stops. When the chunk reloads, the block compares the stored tick to the current one — any gap larger than 2 seconds means the chunk was unloaded.

On detection, the block:
1. Fires an `awaydetector:chunk_returned` script event with the location and duration
2. Emits a brief redstone pulse with signal strength proportional to the absence duration (logarithmic scale, 1 = ~1 second, 15 = ~2+ hours)

## Installation

1. Download the latest release (`.mcpack` files)
2. Double-click each `.mcpack` to import into Minecraft
3. Enable both packs (behavior + resource) on your world

## Crafting

```
     [Amethyst Shard]
[Redstone] [Quartz] [Redstone]
           [Redstone]
```

## Script Event API

Other add-ons can listen for chunk return events:

```javascript
import { system } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === "awaydetector:chunk_returned") {
    const data = JSON.parse(event.message);
    // data.x, data.y, data.z — block location
    // data.dimension — e.g. "minecraft:overworld"
    // data.ticksAway — how many ticks the chunk was unloaded
    console.warn(`Chunk at ${data.x},${data.y},${data.z} was away for ${data.ticksAway} ticks`);
  }
});
```

## Redstone Output

The block emits a brief redstone pulse (~1 second) when it detects a return. Signal strength uses a logarithmic scale:

| Signal | Duration |
|--------|----------|
| 1 | ~1 second |
| 5 | ~1 minute |
| 8 | ~10 minutes |
| 10 | ~30 minutes |
| 13 | ~1 hour |
| 15 | ~2+ hours |

## Reusing the Component in Your Mod

Bedrock does not support cross-addon custom components. To add chunk-unload detection to your own block:

1. Copy `awaydetector_bp/scripts/components/DetectorComponent.js` and `awaydetector_bp/scripts/util/Constants.js` into your behavior pack
2. Register the component in your startup/worldInitialize event:
   ```javascript
   import { detectorComponent } from "./components/DetectorComponent.js";
   
   world.beforeEvents.worldInitialize.subscribe((event) => {
     event.blockComponentRegistry.registerCustomComponent(
       "awaydetector:detector",
       detectorComponent
     );
   });
   ```
3. Add `"awaydetector:detector"` to your block JSON's `minecraft:custom_components` array
4. Add `minecraft:tick` with `interval_range: [20, 20]` and `looping: true` to your block

**Important:** If you copy the component, do not also install the standalone AwayDetector add-on — duplicate component registrations will conflict. Alternatively, rename the component to your own namespace (e.g., `yourmod:detector`).

## Limitations

- Detection granularity is ~1 second (not per-tick)
- Maximum ~100 ticking blocks per chunk — avoid placing many detectors in the same chunk
- Multiplayer: chunk load/unload depends on all players' positions, not just one

## Development

```bash
npm test    # run Bedrock-side unit tests
```

## License

MIT
