import React, { useState, useEffect, useRef } from "react";

interface VenueSlugInputProps {
  venueSlug: string;
  setVenueSlug: (value: string) => void;
  onFetch: (value: string) => Promise<boolean>;
  error?: string | null;
}

const VenueSlugInput: React.FC<VenueSlugInputProps> = ({
  venueSlug,
  setVenueSlug,
  onFetch,
  error,
}) => {
  const [localError, setLocalError] = useState<string>("");
  const isInputFocused = useRef<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVenueSlug(value);

    if (localError) setLocalError("");

    // Debounce the fetch call
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (value.trim() && isInputFocused.current) {
        const success = await onFetch(value.trim());
        if (!success) {
          setLocalError("Failed to fetch venue data.");
        }
      }
    }, 500); // Increased debounce timeout to 0.5 second
  };

  // Function triggers when unfocusing from the input
  const handleBlur = async () => {
    isInputFocused.current = false;
    if (!venueSlug.trim()) {
      setLocalError("Venue slug is required.");
      return;
    }

    // When unfocusing from the input it fetches the data. Made for accessibility purposes like Tab control
    const success = await onFetch(venueSlug.trim());
    if (!success) {
      setLocalError("Failed to fetch venue data.");
    }
  };

  // Function triggers when focusing on the input
  const handleFocus = () => {
    isInputFocused.current = true;
  };

  // Cleanup the debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

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
            onFocus={handleFocus}
            data-test-id="venueSlug"
            placeholder=" "
            className={`peer block w-full rounded-xl border-2 p-3 pt-4 pb-1 text-sm 
              border-gray-300 
              focus:outline-none focus:ring-[#009DE0] focus:ring-[1px] 
              focus:border-[#009DE0] focus:border-[2px] hover:border-[#009DE0] 
              transition-[color,box-shadow]`}
          />
          {/* Animated placeholder */}
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
            venue-helsinki
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
