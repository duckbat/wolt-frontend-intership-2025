export interface VenueData {
  location: [number, number];
  orderMinimumNoSurcharge: number;
  basePrice: number;
  distanceRanges: {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: any;
  }[];
}

export interface CalculationResult {
  cartValue: number;
  smallOrderSurcharge: number;
  deliveryFee: number;
  deliveryDistance: number;
  totalPrice: number;
}