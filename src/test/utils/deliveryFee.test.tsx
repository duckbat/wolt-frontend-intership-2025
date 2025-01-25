import { describe, it, expect } from "vitest";
import { calculateDeliveryFee } from "../../utils/calculation";
import { VenueData } from "../../types";

// Mock ranges
const mockDistanceRanges: VenueData["distanceRanges"] = [
  { min: 0, max: 500, a: 0, b: 0 },
  { min: 500, max: 1000, a: 100, b: 1 },
  { min: 1000, max: 0, a: 0, b: 0 }, // 0 = no delivery after 1000m
];

const basePrice = 190;

describe("calculateDeliveryFee", () => {
  // Test to check if the function calculates the delivery fee correctly for the first range
  it("calculates fee for distance in the first range", () => {
    const fee = calculateDeliveryFee(400, mockDistanceRanges, basePrice);
    expect(fee).toBe(190); // basePrice + a + b*(distance/10) = 190
  });

  // Test to check if the function calculates the delivery fee correctly for the second range
  it("calculates fee for distance in the second range", () => {
    const fee = calculateDeliveryFee(600, mockDistanceRanges, basePrice);
    expect(fee).toBe(190 + 100 + Math.round((1 * 600) / 10)); //  // basePrice(190) + a(100) + b(1)*(distance/10) = 350
  });

  // Test to check if the function throws an error for a distance exceeding the maximum range
  it("throws an error for distance exceeding maximum range", () => {
    expect(() =>
      calculateDeliveryFee(1500, mockDistanceRanges, basePrice)
    ).toThrow(/delivery is not available/i);
  });

  // Test to check if the function throws an error for a distance that falls outside all ranges
  it("throws an error for a distance that falls outside all ranges", () => {
    const emptyRanges: VenueData["distanceRanges"] = [];
    expect(() => calculateDeliveryFee(200, emptyRanges, basePrice)).toThrow(
      /delivery is not available/i
    );
  });
});
