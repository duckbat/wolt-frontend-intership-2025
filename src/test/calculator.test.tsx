import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import Calculator from "../components/Calculator";
import { useVenueData } from "../hooks/useVenueData";

vi.mock("../hooks/useVenueData", () => ({
  useVenueData: vi.fn(),
}));

vi.mock("../utils/calculation", () => ({
  calculateDistance: vi.fn(() => 177),
  calculateDeliveryFee: vi.fn(() => 190),
}));

describe("Calculator Initial Test Case", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useVenueData as Mock).mockReturnValue({
      venueData: {
        location: [24.93087, 60.17094],
        distanceRanges: [100, 200, 300, 700],
        basePrice: 100,
        orderMinimumNoSurcharge: 1000,
      },
      error: null,
      fetchVenueData: vi.fn(),
    });
  });

  it("should complete the user flow and display the correct price breakdown", async () => {
    render(<Calculator />);

    const venueSlugInput = screen.getByTestId("venueSlug");
    fireEvent.change(venueSlugInput, {
      target: { value: "home-assigment-venue-helsinki" },
    });

    const cartValueInput = screen.getByTestId("cartValue");
    fireEvent.change(cartValueInput, { target: { value: "10" } });

    const latitudeInput = screen.getByTestId("userLatitude");
    fireEvent.change(latitudeInput, { target: { value: "60.17094" } });

    const longitudeInput = screen.getByTestId("userLongitude");
    fireEvent.change(longitudeInput, { target: { value: "24.93087" } });

    const calculateButton = screen.getByTestId("calculateButton");
    fireEvent.click(calculateButton);

    expect(await screen.findByText(/cart value:/i)).toHaveTextContent(
      "10.00 EUR"
    );
    expect(screen.getByText(/delivery fee:/i)).toHaveTextContent("1.90 EUR");
    expect(screen.getByText(/delivery distance:/i)).toHaveTextContent("177 m");
    expect(screen.getByText(/small order surcharge:/i)).toHaveTextContent(
      "0.00 EUR"
    );
    expect(screen.getByText(/total price:/i)).toHaveTextContent("11.90 EUR");
  });
});
