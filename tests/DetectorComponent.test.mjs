import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeGap, computeSignalStrength } from "../awaydetector_bp/scripts/components/DetectorComponent.js";

describe("computeGap", () => {
  it("returns the gap when chunk was unloaded", () => {
    assert.equal(computeGap(100, 6100, 40), 6000);
  });

  it("returns null for normal tick interval (no gap)", () => {
    assert.equal(computeGap(100, 120, 40), null);
  });

  it("returns null when lastTick is undefined (first tick)", () => {
    assert.equal(computeGap(undefined, 500, 40), null);
  });

  it("returns null when lastTick is null", () => {
    assert.equal(computeGap(null, 500, 40), null);
  });

  it("fires when gap strictly exceeds threshold (41 > 40)", () => {
    assert.equal(computeGap(100, 141, 40), 41);
  });

  it("does not fire when gap equals threshold (40 is not > 40)", () => {
    assert.equal(computeGap(100, 140, 40), null);
  });

  it("handles very large gaps correctly", () => {
    assert.equal(computeGap(100, 1000100, 40), 1000000);
  });

  it("returns null for negative delta (tick epoch reset)", () => {
    assert.equal(computeGap(5000, 100, 40), null);
  });

  it("returns null for zero delta", () => {
    assert.equal(computeGap(100, 100, 40), null);
  });
});

describe("computeSignalStrength", () => {
  it("returns 1 for 20 ticks (1 second)", () => {
    assert.equal(computeSignalStrength(20), 1);
  });

  it("returns 0 for ticks below minimum breakpoint", () => {
    assert.equal(computeSignalStrength(19), 0);
  });

  it("returns 7 for 6000 ticks (5 minutes)", () => {
    assert.equal(computeSignalStrength(6000), 7);
  });

  it("returns 15 for 144000+ ticks (2+ hours)", () => {
    assert.equal(computeSignalStrength(144000), 15);
    assert.equal(computeSignalStrength(999999), 15);
  });

  it("returns correct strength at exact breakpoint boundaries", () => {
    assert.equal(computeSignalStrength(60), 2);
    assert.equal(computeSignalStrength(59), 1);
    assert.equal(computeSignalStrength(200), 3);
    assert.equal(computeSignalStrength(199), 2);
  });

  it("returns 0 for zero ticks", () => {
    assert.equal(computeSignalStrength(0), 0);
  });
});
