import React from "react";

interface GetLocationButtonProps {
  onLocationFound: (lat: number, lon: number) => void;
}

const GetLocationButton: React.FC<GetLocationButtonProps> = ({ onLocationFound }) => {
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationFound(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGetLocation}
      className="p-2 bg-blue-500 text-white rounded"
    >
      Get Location
    </button>
  );
};

export default GetLocationButton;