import React, { useState } from "react";
import { useVenueData } from "../hooks/useVenueData";
import { calculateDistance, calculateDeliveryFee } from "../utils/calculation";
import GetLocationButton from "./ui/Buttons/GetLocationButton";
import VenueSlugInput from "./ui/Inputs/VenueSlugInput";
import CartValueInput from "./ui/Inputs/CartValueInput";
import GetLocationInput from "./ui/Inputs/GetLocationInput";
import PriceBreakdown from "./ui/PriceBreakdown";
import CalculateButton from "./ui/Buttons/CalculateButton";
import { CalculationResult } from "../types";

const Calculator: React.FC = () => {
  const [venueSlug, setVenueSlug] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [cartValue, setCartValue] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { venueData, error: venueError, fetchVenueData } = useVenueData();

  // Fetch venue data when the user finishes typing (on blur)
  const handleVenueSlugBlur = async () => {
    if (venueSlug) {
      console.log("Fetching venue data for slug:", venueSlug);
      await fetchVenueData(venueSlug);
    }
  };

  const handleLocationFound = (lat: number, lon: number) => {
    setLatitude(lat.toString());
    setLongitude(lon.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!venueSlug || !latitude || !longitude || !cartValue) {
      setError("All fields are required.");
      return;
    }

    const latNumber = parseFloat(latitude);
    const lonNumber = parseFloat(longitude);
    if (isNaN(latNumber) || isNaN(lonNumber)) {
      setError("Invalid latitude or longitude.");
      return;
    }

    try {
      // Check if venueData is available
      if (!venueData) {
        setError("Failed to fetch venue data.");
        return;
      }

      // Proceed with calculations
      const deliveryDistance = calculateDistance(
        latNumber,
        lonNumber,
        venueData.location[1],
        venueData.location[0]
      );

      const roundedDeliveryDistance = Math.ceil(deliveryDistance);

      const deliveryFee = calculateDeliveryFee(
        roundedDeliveryDistance,
        venueData.distanceRanges,
        venueData.basePrice
      );

      const cartValueInCents = parseFloat(cartValue) * 100;
      const smallOrderSurcharge = Math.max(
        venueData.orderMinimumNoSurcharge - cartValueInCents,
        0
      );

      const totalPrice = cartValueInCents + smallOrderSurcharge + deliveryFee;

      setResult({
        cartValue: cartValueInCents,
        smallOrderSurcharge,
        deliveryFee,
        deliveryDistance: roundedDeliveryDistance,
        totalPrice,
      });
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error:", err); // Log the error for debugging
      setError("Delivery is not available, you live too far.");
      setResult(null); // Clear the result
    }
  };

  const isFormValid = venueSlug && latitude && longitude && cartValue;

  return (
    <div className="p-4 space-y-4 bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <VenueSlugInput
          venueSlug={venueSlug}
          setVenueSlug={setVenueSlug}
          onBlur={handleVenueSlugBlur} // Fetch data on blur
        />
        <CartValueInput cartValue={cartValue} setCartValue={setCartValue} />
        <GetLocationInput
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
        <GetLocationButton onLocationFound={handleLocationFound} />
        {error && <p className="text-red-500">{error}</p>}
        {venueError && <p className="text-red-500">{venueError}</p>}
        <CalculateButton onClick={handleSubmit} disabled={!isFormValid} />
      </form>

      {result && <PriceBreakdown result={result} />}
    </div>
  );
};

export default Calculator;
