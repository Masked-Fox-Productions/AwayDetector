import { world } from "@minecraft/server";
import { COMPONENT_ID } from "./util/Constants.js";
import { detectorComponent } from "./components/DetectorComponent.js";

world.beforeEvents.worldInitialize.subscribe((event) => {
  event.blockComponentRegistry.registerCustomComponent(
    COMPONENT_ID,
    detectorComponent
  );
});

console.warn("[awaydetector] Component registered");
