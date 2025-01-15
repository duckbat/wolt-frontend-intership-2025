import React from "react";

interface VenueSlugInputProps {
  venueSlug: string;
  setVenueSlug: (value: string) => void;
  onBlur?: () => void; // Add optional onBlur prop
}

const VenueSlugInput: React.FC<VenueSlugInputProps> = ({
  venueSlug,
  setVenueSlug,
  onBlur,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenueSlug(e.target.value);
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
          value={venueSlug}
          onChange={handleInputChange}
          onBlur={onBlur} // Pass onBlur prop to the input
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Venue Slug"
          data-test-id="venueSlug"
        />
      </div>
    </div>
  );
};

export default VenueSlugInput;