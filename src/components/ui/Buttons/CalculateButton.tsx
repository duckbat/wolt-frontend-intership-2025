import React from "react";

interface CalculateButtonProps {
  onClick: (e: React.FormEvent) => void;
  disabled?: boolean;
  error?: string | null; // Optional error message
}

const CalculateButton: React.FC<CalculateButtonProps> = ({ onClick, disabled, error }) => {
  return (
    <div className="text-center p-4 w-full">
      <button
        type="submit"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 w-full bg-blue text-white ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        data-test-id="calculateButton"
      >
        Calculate delivery price
      </button>
      <div
        className="mt-2 text-sm transition-all duration-100 ease-in-out"
        style={{
          minHeight: "20px", // Reserve space for the error message
          color: error ? "red" : "transparent", // Show error in red or hide
        }}
      >
        {error || " "} {/* Prevent collapsing */}
      </div>
    </div>
  );
};

export default CalculateButton;
