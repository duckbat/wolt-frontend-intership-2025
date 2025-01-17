import React, { useState } from "react";

interface CartValueInputProps {
  cartValue: string;
  setCartValue: (value: string) => void;
  onBlur?: () => void;
}

const CartValueInput: React.FC<CartValueInputProps> = ({
  cartValue,
  setCartValue,
  onBlur,
}) => {
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCartValue(value);

      // Reset error when user starts typing
      if (error) {
        setError("");
      }
    }
  };

  const handleBlur = () => {
    if (!cartValue.trim()) {
      setError("Cart value is required.");
    } else if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="input-with-placeholder">
        <label htmlFor="cartValue">Cart Value</label>
        <input
          id="cartValue"
          name="cartValue"
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="420.69"
          value={cartValue}
          data-test-id="cartValue"
          className={`block w-full rounded-xl border-2 p-3 text-sm 
            ${error ? "border-gray-300" : "border-gray-300"} 
            focus:outline-none focus:ring-[#009DE0] focus:ring-[1px] 
            focus:border-[#009DE0] focus:border-[2px] hover:border-[#009DE0] 
            transition-all`}
        />
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

export default CartValueInput;
