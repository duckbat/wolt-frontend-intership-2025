import React, { useState, useEffect } from "react";

interface VenueSlugInputProps {
  venueSlug: string;
  setVenueSlug: (value: string) => void;
  onFetch: (value: string) => Promise<boolean>; // Updated signature
  error?: string | null;
}

const VenueSlugInput: React.FC<VenueSlugInputProps> = ({
  venueSlug,
  setVenueSlug,
  onFetch,
  error,
}) => {
  const [localError, setLocalError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVenueSlug(value);

    // Reset local error when typing
    if (localError) setLocalError("");
  };

  const handleBlur = async () => {
    if (!venueSlug.trim()) {
      setLocalError("Venue slug is required.");
      return;
    }

    const success = await onFetch(venueSlug.trim());
    if (!success) {
      setLocalError("Failed to fetch venue data.");
    }
  };

  // Debounced fetch when typing
  useEffect(() => {
    if (!venueSlug.trim()) return;

    const debounceFetch = setTimeout(async () => {
      const success = await onFetch(venueSlug.trim());
      if (!success) {
        setLocalError("Failed to fetch venue data.");
      }
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [venueSlug, onFetch]);

  return (
    <div className="px-4 pb-1 pt-6">
      <div className="input-with-placeholder">
        <label htmlFor="venueSlug">Venue Slug</label>
        <div className="relative w-full">
          <input
            id="venueSlug"
            name="venueSlug"
            value={venueSlug}
            onChange={handleInputChange}
            onBlur={handleBlur}
            data-test-id="venueSlug"
            placeholder=" "
            className={`peer block w-full rounded-xl border-2 p-3 pt-4 pb-1 text-sm 
              border-gray-300 
              focus:outline-none focus:ring-[#009DE0] focus:ring-[1px] 
              focus:border-[#009DE0] focus:border-[2px] hover:border-[#009DE0] 
              transition-[color,box-shadow]`}
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
          className="text-sm transition-all duration-300 ease-in-out pl-4"
          style={{
            minHeight: "20px",
            color: localError || error ? "red" : "transparent",
          }}
        >
          {localError || error || " "}
        </div>
      </div>
    </div>
  );
};

export default VenueSlugInput;
