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
    <div className="px-4">
      <div className="input-with-placeholder">
        <label htmlFor="cartValue" className="block mb-1">
          Cart Value
        </label>
        <div className="relative w-full">
          <input
            id="cartValue"
            name="cartValue"
            type="number"
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="16.12"
            value={cartValue}
            data-test-id="cartValue"
            className={`peer block w-full rounded-xl border-2 p-3 text-sm 
              border-gray-300 
              focus:outline-none focus:ring-[#009DE0] focus:ring-[1px] 
              focus:border-[#009DE0] focus:border-[2px] hover:border-[#009DE0] 
              transition-[color,box-shadow]`}
          />
        </div>
        <div
          className="text-sm transition-all duration-300 ease-in-out pl-4"
          style={{
            minHeight: "20px",
            color: error ? "red" : "transparent",
          }}
        >
          {error || " "}
        </div>
      </div>
    </div>
  );
};

export default CartValueInput;
