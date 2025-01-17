import React from "react";

interface CalculateButtonProps {
  onClick: (e: React.FormEvent) => void;
  disabled?: boolean;
}

const CalculateButton: React.FC<CalculateButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`button p-2 bg-blue text-white rounded ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      data-test-id="calculateButton"
    >
      Calculate delivery price
    </button>
  );
};

export default CalculateButton;