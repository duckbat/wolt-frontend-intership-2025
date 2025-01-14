import React from "react";

interface GetLocationInputProps {
  latitude: string; // Change to string
  longitude: string; // Change to string
  setLatitude: (latitude: string) => void; // Change to string
  setLongitude: (longitude: string) => void; // Change to string
}

const GetLocationInput: React.FC<GetLocationInputProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) => {
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setLatitude(value);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setLongitude(value);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label htmlFor="latitude" className="block text-sm font-medium">
          Latitude
        </label>
        <input
          id="latitude"
          name="latitude"
          type="text" // Use type="text"
          value={latitude}
          onChange={handleLatitudeChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Your latitude"
          data-test-id="userLatitude"
        />
      </div>

      <div>
        <label htmlFor="longitude" className="block text-sm font-medium">
          Longitude
        </label>
        <input
          id="longitude"
          name="longitude"
          type="text" // Use type="text"
          value={longitude}
          onChange={handleLongitudeChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Your longitude"
          data-test-id="userLongitude"
        />
      </div>
    </div>
  );
};

export default GetLocationInput;