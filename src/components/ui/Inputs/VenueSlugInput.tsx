import React, { useState } from "react";

interface VenueSlugInputProps {
  venueSlug: string;
  setVenueSlug: (value: string) => void;
  onBlur?: () => void; // onBlur prop to fetch API data when venue slug is entered
}

const VenueSlugInput: React.FC<VenueSlugInputProps> = ({
  venueSlug,
  setVenueSlug,
  onBlur,
}) => {
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVenueSlug(value);

    // Reset error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleBlur = () => {
    // Set error if venueSlug is empty
    if (!venueSlug.trim()) {
      setError("Venue slug is required.");
    } else if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="input-with-placeholder">
        <label htmlFor="venueSlug">Venue Slug</label>
        <div className="relative w-full">
          <input
            id="venueSlug"
            name="venueSlug"
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder=" " // For floated label
            value={venueSlug}
            data-test-id="venueSlug"
            className={`peer block w-full rounded-xl border-2 p-3 pt-4 pb-1 text-sm 
              ${error ? "border-gray-300" : "border-gray-300"} 
              focus:outline-none focus:ring-[#009DE0] focus:ring-[1px] 
              focus:border-[#009DE0] focus:border-[2px] hover:border-[#009DE0] 
              transition-all`}
          />
          <label
            htmlFor="venueSlug"
            className={`absolute left-4 transition-all text-gray-400 text-sm 
              ${
                venueSlug
                  ? "top-1 text-xs"
                  : "top-3 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm"
              } 
              peer-focus:top-1 peer-focus:text-xs`}
          >
            home-assignment-venue-helsinki
          </label>
        </div>
        <div
          className="text-sm transition-all duration-300 ease-in-out"
          style={{
            minHeight: "20px", // Reserve space for the error message
            color: error ? "red" : "transparent", // Show error message in red, or hide it
          }}
        >
          {error || " "} {/* Empty string to avoid collapsing */}
        </div>
      </div>
    </div>
  );
};

export default VenueSlugInput;
