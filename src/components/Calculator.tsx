import React, { useState } from "react";
import { fetchVenueStatic, fetchVenueDynamic } from "../utils/api";
import GetLocationButton from "./Buttons/GetLocationButton";
import VenueSlugInput from "./Inputs/VenueSlugInput";
import CartValueInput from "./Inputs/CartValueInput";
import GetLocationInput from "./Inputs/GetLocationInput";

export interface VenueData {
  location: [number, number]; // [longitude, latitude]
  orderMinimumNoSurcharge: number;
  basePrice: number;
  distanceRanges: {
    min: number;
    max: number;
    a: number;
    b: number;
    flag: any; // Ignored
  }[];
}

interface CalculationResult {
  cartValue: number;
  smallOrderSurcharge: number;
  deliveryFee: number;
  deliveryDistance: number;
  totalPrice: number;
}

const Calculator: React.FC = () => {
  const [venueSlug, setVenueSlug] = useState<string>("");
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [cartValue, setCartValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleLocationFound = (lat: number, lon: number) => {
    setLatitude(lat);
    setLongitude(lon);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInMeters = R * c;
    return distanceInMeters; // Keep the precise value for calculations
  };

  const calculateDeliveryFee = (distance: number, distanceRanges: VenueData["distanceRanges"], basePrice: number): number => {
    for (const range of distanceRanges) {
      const { min, max, a, b } = range;
      if (distance >= min && (max === 0 || distance < max)) {
        if (max === 0) {
          throw new Error("Delivery not available for this distance.");
        }
        return basePrice + a + Math.round((b * distance) / 10);
      }
    }
    throw new Error("Delivery not available for this distance.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!venueSlug || !latitude || !longitude || !cartValue) {
      setError("All fields are required.");
      return;
    }

    setError(null);
    setResult(null);

    try {
      // Fetch venue data
      const staticData = await fetchVenueStatic(venueSlug.trim());
      const dynamicData = await fetchVenueDynamic(venueSlug.trim());

      // Extract relevant fields
      const location = staticData.venue_raw.location.coordinates;
      const orderMinimumNoSurcharge =
        dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge;
      const basePrice = dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price;
      const distanceRanges = dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges;

      const venueData: VenueData = {
        location,
        orderMinimumNoSurcharge,
        basePrice,
        distanceRanges,
      };

      setVenueData(venueData);

      // Calculate distance
      const deliveryDistance = calculateDistance(latitude, longitude, venueData.location[1], venueData.location[0]);

      // Calculate delivery fee
      const deliveryFee = calculateDeliveryFee(deliveryDistance, venueData.distanceRanges, venueData.basePrice);

      // Calculate small order surcharge
      const cartValueInCents = parseFloat(cartValue) * 100;
      const smallOrderSurcharge = Math.max(venueData.orderMinimumNoSurcharge - cartValueInCents, 0);

      // Calculate total price
      const totalPrice = cartValueInCents + smallOrderSurcharge + deliveryFee;

      // Set the result
      setResult({
        cartValue: cartValueInCents,
        smallOrderSurcharge,
        deliveryFee,
        deliveryDistance,
        totalPrice,
      });
    } catch (err) {
      setError((err as Error).message || "Failed to fetch venue data.");
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <VenueSlugInput venueSlug={venueSlug} setVenueSlug={setVenueSlug} />
        <GetLocationInput latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude} />
        <GetLocationButton onLocationFound={handleLocationFound} />
        <CartValueInput cartValue={cartValue} setCartValue={setCartValue} />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="p-2 bg-green-500 text-white rounded">
          Calculate delivery price
        </button>
      </form>

      {result && (
        <div className="p-4 mt-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-bold">Price Breakdown</h3>
          <p>Cart Value: {(result.cartValue / 100).toFixed(2)} EUR</p>
          <p>Delivery Fee: {(result.deliveryFee / 100).toFixed(2)} EUR</p>
          <p>Delivery Distance: {result.deliveryDistance.toFixed(2)} meters</p>
          <p>Small Order Surcharge: {(result.smallOrderSurcharge / 100).toFixed(2)} EUR</p>
          <p>Total Price: {(result.totalPrice / 100).toFixed(2)} EUR</p>
        </div>
      )}
    </div>
  );
};

export default Calculator;