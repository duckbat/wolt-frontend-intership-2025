import { useGeolocated as useReactGeolocated } from "react-geolocated";

// Abstraction layer for the third-party react-geolocated library
export const useGeolocationService = () => {
  return useReactGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
  });
};