import { useState } from "react";

export const useCurrentLocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported");
      return;
    }

    setStatus("Locating...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setStatus(null);
      },
      () => {
        setStatus("Unable to get location.");
      }
    );
  };

  return { latitude, longitude, status, getLocation };
};
