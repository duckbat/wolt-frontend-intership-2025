import React from "react";
import { useGeolocated } from "react-geolocated"; // TODO: For third party libraries it is better to create an abstraction

interface UseCurrentLocationReturn {
  latitude: number | null;
  longitude: number | null;
  isGeolocationAvailable: boolean;
  isGeolocationEnabled: boolean;
  getPosition: () => void;
  error: string | null;
}

// Custom hook to get the current location of the user
export const useCurrentLocation = (): UseCurrentLocationReturn => {
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    getPosition,
    positionError,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000, // 10 seconds
  });

  // Map the error code to a user-friendly message
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
