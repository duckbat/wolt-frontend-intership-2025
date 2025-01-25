import { useState, useRef, useEffect } from "react";
import { useVenueData } from "./useVenueData";
import { calculateDistance, calculateDeliveryFee } from "../utils/calculation";
import { CalculationResult } from "../types/calculationResult.types";

export function useCalculatorLogic(onPlayAnimation: () => void) {
  const [venueSlug, setVenueSlug] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cartValue, setCartValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

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
      setError("All fields are required");
      return;
    }

    const latNumber = parseFloat(latitude);
    const lonNumber = parseFloat(longitude);
    if (isNaN(latNumber) || isNaN(lonNumber)) {
      setError("Invalid latitude or longitude");
      return;
    }

    try {
      if (!venueData) {
        setError("Please, provide a valid venue slug");
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
      setError(
        "Delivery is not available. You live too far, or given location is invalid"
      );
      setResult(null);
    }
  };

  useEffect(() => {
    if (result && breakdownRef.current) {
      breakdownRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return {
    venueSlug,
    setVenueSlug,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    cartValue,
    setCartValue,
    error,
    setError,
    result,
    venueError,
    fetchVenueData,
    handleSubmit,
    handleLocationFound,
    breakdownRef,
  };
}
