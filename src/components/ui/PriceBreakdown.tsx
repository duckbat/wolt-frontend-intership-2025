import React from "react";
import { CalculationResult } from "../../types";

interface PriceBreakdownProps {
  result: CalculationResult;
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ result }) => {
  const {
    cartValue,
    deliveryFee,
    deliveryDistance,
    smallOrderSurcharge,
    totalPrice,
  } = result;

  const cartValueEur = (cartValue / 100).toFixed(2);
  const deliveryFeeEur = (deliveryFee / 100).toFixed(2);
  const surchargeEur = (smallOrderSurcharge / 100).toFixed(2);
  const totalPriceEur = (totalPrice / 100).toFixed(2);

  return (
    <div className="p-8 font-medium text-left">
      <h3 className="font-bold">Price Breakdown</h3>
      <p data-raw-value={cartValue}>Cart Value: {cartValueEur} EUR</p>
      <p data-raw-value={deliveryFee}>Delivery Fee: {deliveryFeeEur} EUR</p>
      <p data-raw-value={deliveryDistance}>Delivery Distance: {deliveryDistance} meters</p>
      <p data-raw-value={smallOrderSurcharge}>Small Order Surcharge: {surchargeEur} EUR</p>
      <p data-raw-value={totalPrice}>Total Price: {totalPriceEur} EUR</p>
    </div>
  );
};

export default PriceBreakdown;
