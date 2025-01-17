import React from "react";

interface GetLocationInputProps {
  latitude: string;
  longitude: string;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
}

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
    <div className="flex flex-wrap gap-4 p-4">
      <div className="flex-1 input-with-placeholder">
        <label htmlFor="latitude" className="block mb-1">
          Latitude
        </label>
        <div className="relative w-full">
          <input
            id="latitude"
            name="latitude"
            type="text"
            value={latitude}
            onChange={handleLatitudeChange}
            placeholder="60.17094"
            data-test-id="userLatitude"
            className={`peer block w-full rounded-xl border-2 p-3 text-sm 
              border-gray-300 
              focus:outline-none focus:ring-[#009DE0] focus:ring-[1px] 
              focus:border-[#009DE0] focus:border-[2px] hover:border-[#009DE0] 
              transition-[color,box-shadow]`}
          />
        </div>
      </div>
      <div className="flex-1 input-with-placeholder">
        <label htmlFor="longitude" className="block mb-1">
          Longitude
        </label>
        <div className="relative w-full">
          <input
            id="longitude"
            name="longitude"
            type="text"
            value={longitude}
            onChange={handleLongitudeChange}
            placeholder="24.93087"
            data-test-id="userLongitude"
            className={`peer block w-full rounded-xl border-2 p-3 text-sm 
              border-gray-300 
              focus:outline-none focus:ring-[#009DE0] focus:ring-[1px] 
              focus:border-[#009DE0] focus:border-[2px] hover:border-[#009DE0] 
              transition-[color,box-shadow]`}
          />
        </div>
      </div>
    </div>
  );
};

export default GetLocationInput;
