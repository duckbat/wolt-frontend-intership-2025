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
  const isInputFocused = useRef<boolean>(false); // Tracks input focus state
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // Tracks debounce timer
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null); // Tracks inactivity timer

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVenueSlug(value);

    // Reset local error when typing
    if (localError) setLocalError("");

    // Clear inactivity timer if user is typing
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    // Set inactivity timer
    inactivityTimeout.current = setTimeout(() => {
      console.log("Stopping fetch attempts after 3 seconds of inactivity");
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    }, 3000); // 3 seconds
  };

  const handleBlur = async () => {
    isInputFocused.current = false; // Mark input as not focused
    if (!venueSlug.trim()) {
      setLocalError("Venue slug is required.");
      return;
    }

    const success = await onFetch(venueSlug.trim());
    if (!success) {
      setLocalError("Failed to fetch venue data.");
    }
  };

  const handleFocus = () => {
    isInputFocused.current = true;
  };

  useEffect(() => {
    if (!venueSlug.trim() || !isInputFocused.current) return;

    debounceTimeout.current = setTimeout(async () => {
      const success = await onFetch(venueSlug.trim());
      if (!success) {
        setLocalError("Failed to fetch venue data.");
      }
    }, 700); // Timeout for debounce

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [venueSlug, onFetch]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
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
