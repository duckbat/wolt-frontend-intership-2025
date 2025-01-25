import { useState } from "react";
import { fetchVenueStatic, fetchVenueDynamic } from "../utils/api";
import { VenueData } from "../types/venueData.types";

export const useVenueData = () => {
  const [venueData, setVenueData] = useState<VenueData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetches the static and dynamic data for a venue
  const fetchVenueData = async (venueSlug: string): Promise<boolean> => {
    try {
      console.log("Fetching static data for:", venueSlug);
      const staticData = await fetchVenueStatic(venueSlug.trim());
      console.log("Static data:", staticData);

      console.log("Fetching dynamic data for:", venueSlug);
      const dynamicData = await fetchVenueDynamic(venueSlug.trim());
      console.log("Dynamic data:", dynamicData);

      // Extract the needed data for the calculator
      const venueData: VenueData = {
        location: staticData.venue_raw.location.coordinates,
        orderMinimumNoSurcharge:
          dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge,
        basePrice:
          dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price,
        distanceRanges:
          dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges,
      };

      setVenueData(venueData);
      setError(null);
      return true; // success
    } catch (err) {
      console.error("Failed to fetch venue data", err);
      setError("Failed to fetch venue data");
      setVenueData(null);
      return false; // failure
    }
  };

  return { venueData, error, fetchVenueData };
};
