import React from "react";

interface GetLocationInputProps {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (latitude: number) => void;
  setLongitude: (longitude: number) => void;
}

const GetLocationInput: React.FC<GetLocationInputProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) => {
  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(Number(e.target.value));
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(Number(e.target.value));
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
          value={latitude ?? ""}
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
          value={longitude ?? ""}
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
