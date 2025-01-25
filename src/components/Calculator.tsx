import React, { useState, useRef, useEffect } from "react";
import { useVenueData } from "../hooks/useVenueData";
import { calculateDistance, calculateDeliveryFee } from "../utils/calculation";
import GetLocationButton from "./ui/Buttons/GetLocationButton";
import VenueSlugInput from "./ui/Inputs/VenueSlugInput";
import CartValueInput from "./ui/Inputs/CartValueInput";
import GetLocationInput from "./ui/Inputs/GetLocationInput";
import PriceBreakdown from "./ui/PriceBreakdown";
import CalculateButton from "./ui/Buttons/CalculateButton";
import { CalculationResult } from "../types/calculationResult.types";


interface CalculatorProps {
  onPlayAnimation: () => void; // Provided by the parent (App)
}

// TODO: separate logic to different hooks
const Calculator: React.FC<CalculatorProps> = ({ onPlayAnimation }) => {
  const [venueSlug, setVenueSlug] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [cartValue, setCartValue] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { venueData, error: venueError, fetchVenueData } = useVenueData();
  const breakdownRef = useRef<HTMLDivElement | null>(null);

  const handleLocationFound = (lat: number, lon: number) => {
    setLatitude(lat.toString());
    setLongitude(lon.toString());
    onPlayAnimation();
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
      // await fetchVenueData(venueSlug); // fetching venue data from the button click

      if (!venueData) {
        setError("Please, provide a valid venue slug.");
        return;
      }

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
      setError(null);

      onPlayAnimation();
    } catch (err) {
      console.error("Error:", err);
      setError("Delivery is not available. You live too far, or given location is invalid.");
      setResult(null);
    }
  };

  // Scroll to the result when it's available
  useEffect(() => {
    if (result && breakdownRef.current) {
      breakdownRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const isFormValid = venueSlug && latitude && longitude && cartValue;

  return (
    <div
      data-test-id="calculator"
      className="text-left container max-w-xl mx-aut px-5"
      role="main"
    >
      <form onSubmit={handleSubmit}>
        <VenueSlugInput
          venueSlug={venueSlug}
          setVenueSlug={setVenueSlug}
          onFetch={fetchVenueData}
          error={venueError}
        />
        <CartValueInput cartValue={cartValue} setCartValue={setCartValue} />
        <GetLocationInput
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
        <div className="flex flex-col space-y-4 items-center">
          <GetLocationButton
            onLocationFound={handleLocationFound}
            onError={(error) => setError(error)}
          />
          <CalculateButton
            onClick={handleSubmit}
            disabled={!isFormValid}
            error={error}
          />
        </div>
      </form>
      <div ref={breakdownRef} className="mt-6">
        {result && <PriceBreakdown result={result} />}
      </div>
    </div>
  );
};

export default Calculator;
