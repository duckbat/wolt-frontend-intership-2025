import React, { useState, useRef, useEffect } from "react";

interface GetLocationInputProps {
  latitude: string;
  longitude: string;
  setLatitude: (latitude: string) => void;
  setLongitude: (longitude: string) => void;
}

const LOCATION_REGEXP = /^-?\d*[.,]?\d*$/;

const GetLocationInput: React.FC<GetLocationInputProps> = ({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) => {
  const [latitudeError, setLatitudeError] = useState<string | null>(null);
  const [longitudeError, setLongitudeError] = useState<string | null>(null);
  const latitudeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longitudeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    // Only allow numbers and decimal points
    if (LOCATION_REGEXP.test(value)) {
      setLatitude(value);
      setLatitudeError(null);
    } else {
      setLatitudeError("Invalid latitude");

      // Timeout for the error message
      if (latitudeTimeoutRef.current) {
        clearTimeout(latitudeTimeoutRef.current);
      }

      latitudeTimeoutRef.current = setTimeout(() => {
        setLatitudeError(null);
      }, 2500);
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    // Only allow numbers and decimal points
    if (LOCATION_REGEXP.test(value)) {
      setLongitude(value);
      setLongitudeError(null);
    } else {
      setLongitudeError("Invalid longitude");

      // Timeout for the error message
      if (longitudeTimeoutRef.current) {
        clearTimeout(longitudeTimeoutRef.current);
      }

      longitudeTimeoutRef.current = setTimeout(() => {
        setLongitudeError(null);
      }, 2500);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup timeouts
      if (latitudeTimeoutRef.current) {
        clearTimeout(latitudeTimeoutRef.current);
      }
      if (longitudeTimeoutRef.current) {
        clearTimeout(longitudeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {/* Latitude Input */}
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
          <div
            className="text-sm transition-all duration-300 ease-in-out pl-4"
            style={{
              minHeight: "20px",
              color: latitudeError ? "red" : "transparent",
            }}
          >
            {latitudeError || " "}
          </div>
        </div>
      </div>

      {/* Longitude Input */}
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
          <div
            className="text-sm transition-all duration-300 ease-in-out pl-4"
            style={{
              minHeight: "20px",
              color: longitudeError ? "red" : "transparent",
            }}
          >
            {longitudeError || " "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetLocationInput;
