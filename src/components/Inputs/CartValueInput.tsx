import React from "react";

interface CartValueInputProps {
  cartValue: string;
  setCartValue: (value: string) => void;
}

const CartValueInput: React.FC<CartValueInputProps> = ({ cartValue, setCartValue }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCartValue(value);
  };

  return (
    <div className="p-4 space-y-4">
      <label htmlFor="cartValue">
        Cart Value (EUR)
      </label>
      <input
        id="cartValue"
        name="cartValue"
        value={cartValue}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter cart value"
        data-test-id="cartValue"
      />
    </div>
  );
};

export default CartValueInput;
