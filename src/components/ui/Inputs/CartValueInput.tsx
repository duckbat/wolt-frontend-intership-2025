import React, { useState } from "react";

interface CartValueInputProps {
  cartValue: string;
  setCartValue: (value: string) => void;
  onBlur?: () => void;
}

// This component is used to render the input field for the cart value
const CartValueInput: React.FC<CartValueInputProps> = ({
  cartValue,
  setCartValue,
  onBlur,
}) => {
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  // This function is used to handle the input change event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setCartValue(value);
    }
  };
  const handleBlur = () => {
    if (cartValue.trim() === "") {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
    if (onBlur) {
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
        />
        {isEmpty && (
          <p className="text-red-500 text-sm mt-1">
            Aren't you purchasing anything ( ͡° ͜ʖ ͡° ) ?
          </p>
        )}
      </div>
    </div>
  );
};

export default CartValueInput;
