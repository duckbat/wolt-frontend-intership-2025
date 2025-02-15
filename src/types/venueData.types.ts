export interface VenueData {
    location: [number, number];
    orderMinimumNoSurcharge: number;
    basePrice: number;
    distanceRanges: {
      min: number;
      max: number;
      a: number;
      b: number;
      flag?: any;
    }[];
  }