import { VenueData } from "../types";

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Haversine formula to calculate distance between two points
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusInMeters = 6371e3;

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusInMeters * c;
};

// Calculate delivery fee based on distance
export const calculateDeliveryFee = (
  distance: number,
  distanceRanges: VenueData["distanceRanges"],
  basePrice: number
): number => {
  for (const range of distanceRanges) {
    const { min, max, a, b } = range;
    if (distance >= min && (max === 0 || distance < max)) {
      if (max === 0) {
        throw new Error("Delivery is not available for this distance.");
      }
      return basePrice + a + Math.round((b * distance) / 10);
    }
  }
  throw new Error("Delivery is not available for this distance.");
};
