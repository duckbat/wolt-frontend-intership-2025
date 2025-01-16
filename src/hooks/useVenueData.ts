import { useState } from "react";
import { fetchVenueStatic, fetchVenueDynamic } from "../utils/api";
import { VenueData } from "../types";

// Custom hook to fetch venue aka. potential store data
export const useVenueData = () => {
    const [venueData, setVenueData] = useState<VenueData | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    const fetchVenueData = async (venueSlug: string) => {
      try {
        console.log("Fetching static data for:", venueSlug);
        const staticData = await fetchVenueStatic(venueSlug.trim());
        console.log("Static data:", staticData);
  
        console.log("Fetching dynamic data for:", venueSlug);
        const dynamicData = await fetchVenueDynamic(venueSlug.trim());
        console.log("Dynamic data:", dynamicData);
  
        const venueData: VenueData = {
          location: staticData.venue_raw.location.coordinates,
          orderMinimumNoSurcharge:
            dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge,
          basePrice: dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price,
          distanceRanges:
            dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges,
        };
  
        setVenueData(venueData);
        setError(null);
      } catch (err) {
        console.error("Error fetching venue data or it doesnt exist", err);
        setError("Failed to fetch venue data or this venue slug does not exist ;(");
        setVenueData(null);
      }
    };
  
    return { venueData, error, fetchVenueData };
  };