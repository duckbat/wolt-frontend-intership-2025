import React, { useState, useRef, useEffect } from "react";

interface CartValueInputProps {
  cartValue: string;
  setCartValue: (value: string) => void;
  onBlur?: () => void;
}

const CART_VALUE_REGEXP = /^\d*\.?\d{0,2}$/;

const CartValueInput: React.FC<CartValueInputProps> = ({
  cartValue,
  setCartValue,
  onBlur,
}) => {
  const [error, setError] = useState<string>("");
  const [typeError, setTypeError] = useState<string | null>(null);
  const isInputFocused = useRef<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (CART_VALUE_REGEXP.test(value)) {
      setCartValue(value);
      setError("");
      setTypeError(null);
    } else {
      setTypeError("Please try to enter a valid cart number.");

      // Timeout for the error message
      if (debounceTimeout.current){
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        setTypeError(null);
      }, 2500);
    }
  };

  const handleBlur = () => {
    isInputFocused.current = false;
    if (!cartValue.trim()) {
      setError("Cart value is required.");
    } else if (onBlur) {
      onBlur();
    }
  };

  const handleFocus = () => {
    isInputFocused.current = true;
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

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
            type="text"
            value={cartValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="16.12"
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
            color: error || typeError ? "red" : "transparent",
          }}
        >
          {error || typeError || " "}
        </div>
      </div>
    </div>
  );
};

export default CartValueInput;
