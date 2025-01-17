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
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLatitude(value);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value)) {
      setLongitude(value);
    }
  };

  return (
    <div className="flex space-x-4 p-4">
      {/* Latitude Input */}
      <div className="flex-1 input-with-placeholder">
        <label htmlFor="latitude" className="block mb-1">
          Latitude
        </label>
        <input
          id="latitude"
          name="latitude"
          type="text"
          value={latitude}
          onChange={handleLatitudeChange}
          placeholder="60.17094"
          data-test-id="userLatitude"
          className="w-full p-2"
        />
      </div>

      {/* Longitude Input */}
      <div className="flex-1 input-with-placeholder">
        <label htmlFor="longitude" className="block mb-1">
          Longitude
        </label>
        <input
          id="longitude"
          name="longitude"
          type="text"
          value={longitude}
          onChange={handleLongitudeChange}
          placeholder="24.93087"
          data-test-id="userLongitude"
          className="w-full p-2 borde"
        />
      </div>
    </div>
  );
};

export default GetLocationInput;
