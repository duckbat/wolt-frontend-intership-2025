import React from "react";
import { useCalculatorLogic } from "../hooks/useCalculatorLogic";
import GetLocationButton from "./ui/Buttons/GetLocationButton";
import VenueSlugInput from "./ui/Inputs/VenueSlugInput";
import CartValueInput from "./ui/Inputs/CartValueInput";
import GetLocationInput from "./ui/Inputs/GetLocationInput";
import PriceBreakdown from "./ui/PriceBreakdown";
import CalculateButton from "./ui/Buttons/CalculateButton";

interface CalculatorProps {
  onPlayAnimation: () => void; // Provided by the parent (App)
}

const Calculator: React.FC<CalculatorProps> = ({ onPlayAnimation }) => {
  const {
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
    venueError,
    fetchVenueData,
    result,
    handleSubmit,
    handleLocationFound,
    breakdownRef,
  } = useCalculatorLogic(onPlayAnimation);

  const isFormValid =
    venueSlug &&
    latitude &&
    longitude &&
    cartValue &&
    parseFloat(cartValue) > 0;

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
            onError={(err) => setError(err)}
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
