import React from "react";

interface GetLocationInputProps {
  latitude: string;
  longitude: string;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
}

// Input fields for latitude and longitude
const GetLocationInput: React.FC<GetLocationInputProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) => {
  // Handle latitude input change
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLatitude(value);
    }
  };

  // Handle longitude input change
  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value)) {
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
          type="text"
          value={latitude}
          onChange={handleLatitudeChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="60.17094"
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
          type="text"
          value={longitude}
          onChange={handleLongitudeChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="24.93087"
          data-test-id="userLongitude"
        />
      </div>
    </div>
  );
};

export default GetLocationInput;