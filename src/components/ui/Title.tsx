import React from "react";

const Title: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="font-bold mb-2">Wolt Calculator</h1>
      <h2 className="break-words">
        This is my solution to the Wolt 2025 Frontend Engineering Internship
        assignment. Purpose of this app is to calculate the delivery fee with
        the given instructions based on the cart value and delivery distance.
      </h2>
    </div>
  );
};

export default Title;
