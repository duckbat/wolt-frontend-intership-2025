import React from "react";
import { CalculationResult } from "../../types";

interface PriceBreakdownProps {
  result: CalculationResult;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ result }) => {
  return (
    <div className="p-4 mt-4 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-bold">Price Breakdown</h3>
      <p>Cart Value: {(result.cartValue / 100).toFixed(2)} EUR</p>
      <p>Delivery Fee: {(result.deliveryFee / 100).toFixed(2)} EUR</p>
      <p>Delivery Distance: {result.deliveryDistance} meters</p>
      <p>
        Small Order Surcharge: {(result.smallOrderSurcharge / 100).toFixed(2)}{" "}
        EUR
      </p>
      <p>Total Price: {(result.totalPrice / 100).toFixed(2)} EUR</p>
    </div>
  );
};

export default PriceBreakdown;
