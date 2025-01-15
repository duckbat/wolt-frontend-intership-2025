import React from "react";

interface CalculateButtonProps {
  onClick: (e: React.FormEvent) => void; // Update to accept FormEvent
  disabled?: boolean;
}

const CalculateButton: React.FC<CalculateButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      type="submit"
      onClick={onClick} // Pass the event to the onClick handler
      disabled={disabled}
      className={`p-2 bg-green-500 text-white rounded ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      Calculate delivery price
    </button>
  );
};

export default CalculateButton;