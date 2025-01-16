import React from "react";

interface GetLocationButtonProps {
  onLocationFound: (lat: number, lon: number) => void;
  onError?: (error: string) => void;
}

// Button to get user's location
const GetLocationButton: React.FC<GetLocationButtonProps> = ({
  onLocationFound,
  onError,
}) => {
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      onError?.("Geolocation is not supported by your browser.");
      return;
    }

    // Ask for permission and fetch location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound(latitude, longitude);
      },
      (error) => {
        // Use numeric codes directly:
        // 1 = PERMISSION_DENIED
        // 2 = POSITION_UNAVAILABLE
        // 3 = TIMEOUT
        let errorMessage = "Unable to get your location.";
        switch (error.code) {
          case 1:
            errorMessage = "Permission denied. Please enable location access.";
            break;
          case 2:
            errorMessage = "Location information is unavailable.";
            break;
          case 3:
            errorMessage = "The request to get location timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }
        onError?.(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // 10 seconds
    );
  };

  return (
    <button
      type="button"
      onClick={handleGetLocation}
      className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      data-test-id="getLocation"
    >
      Get Location
    </button>
  );
};

export default GetLocationButton;
