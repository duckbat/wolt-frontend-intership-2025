import React from "react";
import { useGeolocationService } from "../utils/geolocation";

interface UseCurrentLocationReturn {
  latitude: number | null;
  longitude: number | null;
  isGeolocationAvailable: boolean;
  isGeolocationEnabled: boolean;
  getPosition: () => void;
  error: string | null;
}

export const useCurrentLocation = (): UseCurrentLocationReturn => {
  // Use the abstracted service instead of direct import
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    getPosition,
    positionError,
  } = useGeolocationService();

  // Error handling remains in the UI-focused hook
  const error = React.useMemo(() => {
    if (positionError) {
      switch (positionError.code) {
        case positionError.PERMISSION_DENIED:
          return "Permission denied. Please enable location access";
        case positionError.POSITION_UNAVAILABLE:
          return "Location information is unavailable";
        case positionError.TIMEOUT:
          return "The request to get location timed out";
        default:
          return "An unknown error occurred";
      }
    }
    return null;
  }, [positionError]);

  return {
    latitude: coords?.latitude || null,
    longitude: coords?.longitude || null,
    isGeolocationAvailable,
    isGeolocationEnabled,
    getPosition,
    error,
  };
};