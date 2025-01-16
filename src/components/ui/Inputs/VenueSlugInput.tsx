import React, { useState } from "react";

interface VenueSlugInputProps {
  venueSlug: string;
  setVenueSlug: (value: string) => void;
  onBlur?: () => void; // onBlur prop to fetch API data when venue slug is entered
}

// This component is used to render the input field for the venue slug
const VenueSlugInput: React.FC<VenueSlugInputProps> = ({
  venueSlug,
  setVenueSlug,
  onBlur,
}) => {
  const [isEmpty, setIsEmpty] = useState<boolean>(false);


  // This function is used to handle the input change event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVenueSlug(value);
    setIsEmpty(value.trim() === "");
  };

  const handleBlur = () => {
    if (venueSlug.trim() === "") {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="input-with-placeholder">
        <label htmlFor="venueSlug" className="block text-sm font-medium">
          Venue Slug
        </label>
        <input
          id="venueSlug"
          name="venueSlug"
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full p-2 border ${
            isEmpty ? "border-red-500" : "border-gray-300"
          } rounded`}
          placeholder="home-assignment-venue-helsinki"
          value={venueSlug}
          data-test-id="venueSlug"
        />
        {isEmpty && (
          <p className="text-red-500 text-sm mt-1">Please provide a venue slug.</p>
        )}
      </div>
    </div>
  );
};

export default VenueSlugInput;