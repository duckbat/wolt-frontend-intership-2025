import { describe, it, expect } from "vitest";
import { calculateDistance } from "../../utils/calculation";

describe("calculateDistance", () => {
  it("returns 0 for the same coordinates", () => {
    const dist = calculateDistance(60.17094, 24.93087, 60.17094, 24.93087);
    expect(dist).toBe(0);
  });

  it("returns a correct approximate distance for two close points", () => {
    const dist = calculateDistance(60.17094, 24.93087, 60.169, 24.932);
    expect(dist).toBeGreaterThan(100);
    expect(dist).toBeLessThan(500);
  });
});
