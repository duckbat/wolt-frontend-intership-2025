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

  // Convert cents to euros for output
  const cartValueEur = (cartValue / 100).toFixed(2);
  const deliveryFeeEur = (deliveryFee / 100).toFixed(2);
  const surchargeEur = (smallOrderSurcharge / 100).toFixed(2);
  const totalPriceEur = (totalPrice / 100).toFixed(2);

  return (
    <div className="px-8 pb-20 sm:text-xl text-left">
      <hr className="pt-3" />
      <div className="space-y-2">
        <h3 className="font-bold text-xl sm:text-2xl">Price Breakdown</h3>
        <div className="flex justify-between">
          <p className="text-left">Cart Value:</p>
          <p className="text-right" data-raw-value={cartValue}>
            {cartValueEur} EUR
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-left">Delivery Fee:</p>
          <p className="text-right" data-raw-value={deliveryFee}>
            {deliveryFeeEur} EUR
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-left">Delivery Distance:</p>
          <p className="text-right" data-raw-value={deliveryDistance}>
            {deliveryDistance} m
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-left">Small Order Surcharge:</p>
          <p className="text-right" data-raw-value={smallOrderSurcharge}>
            {surchargeEur} EUR
          </p>
        </div>
        <div className="flex justify-between font-bold">
          <p className="text-left">Total Price:</p>
          <p className="text-right" data-raw-value={totalPrice}>
            {totalPriceEur} EUR
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
