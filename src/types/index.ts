// src/types/index.ts

/**
 * The raw input data from the user form,
 * typically in EUR/meters or plain strings before parsing.
 */
export interface CalculatorFormData {
    /** Slug for the venue, e.g. 'home-assignment-venue-helsinki' */
    venueSlug: string;
    /** Cart value as a string (e.g. "10", "10.55"). You can parse to number later. */
    cartValue: string;
    /** User's latitude as a string, e.g. "60.17094". */
    userLatitude: string;
    /** User's longitude as a string, e.g. "24.93087". */
    userLongitude: string;
  }
  
  /**
   * API response from /<VENUE SLUG>/static
   */
  export interface VenueStaticResponse {
    venue_raw: {
      location: {
        /**
         * Coordinates in [longitude, latitude] format.
         * For example: [24.93087, 60.17094].
         */
        coordinates: [number, number];
      };
      // Other fields may be present but are not relevant for this assignment.
    };
  }
  
  /**
   * Each distance range for computing delivery fee.
   *   min / max = lower/upper bound (in meters).
   *   a = constant surcharge in cents.
   *   b = multiplier for (distance / 10).
   *   flag is irrelevant per spec, but present in the JSON.
   */
  export interface DistanceRange {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: string | null;
  }
  
  /**
   * Delivery pricing details from /<VENUE SLUG>/dynamic
   */
  export interface DeliveryPricing {
    base_price: number;
    distance_ranges: DistanceRange[];
  }
  
  /**
   * Delivery specs from /<VENUE SLUG>/dynamic
   */
  export interface DeliverySpecs {
    order_minimum_no_surcharge: number;
    delivery_pricing: DeliveryPricing;
  }
  
  /**
   * API response from /<VENUE SLUG>/dynamic
   */
  export interface VenueDynamicResponse {
    venue_raw: {
      delivery_specs: DeliverySpecs;
      // Other fields may be present but are not relevant for this assignment.
    };
  }
  
  /**
   * Final calculation result after applying:
   * - small order surcharge
   * - distance-based fee
   * - base delivery fee
   * - total price
   */
  export interface DeliveryCalculationResult {
    /** The cart value in cents. */
    cartValue: number;
    /** The surcharge if the cartValue < order_minimum_no_surcharge. */
    smallOrderSurcharge: number;
    /** The total computed delivery fee (in cents). */
    deliveryFee: number;
    /** The distance in meters (straight line) between user & venue. */
    deliveryDistance: number;
    /** The sum of cartValue, surcharge, and deliveryFee. (in cents) */
    totalPrice: number;
  }
  