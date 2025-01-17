import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, Mock } from "vitest";
import Calculator from "../../components/Calculator";
import { useVenueData } from "../../hooks/useVenueData";

// Mock hooks and utility functions
vi.mock("../../hooks/useVenueData", () => ({
  useVenueData: vi.fn(),
}));

vi.mock("../../utils/calculation", () => ({
  calculateDistance: vi.fn((lat1, lon1, lat2, lon2) => {
    if (lat1 === 60.17094 && lon1 === 24.93087 && lat2 === 60.17094 && lon2 === 24.93087) {
      return 177;
    }
    if (lat1 === 60.17332568937988 && lon1 === 24.938220606032882 && lat2 === 60.17094 && lon2 === 24.93087) {
      return 659;
    }
    return 0;
  }),
  calculateDeliveryFee: vi.fn((distance) => {
    if (distance === 177) {
      return 190;
    }
    if (distance === 659) {
      return 290;
    }
    throw new Error("Invalid distance");
  }),
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe("Calculator Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useVenueData as Mock).mockReturnValue({
      venueData: {
        location: [24.93087, 60.17094],
        distanceRanges: [
          { min: 0, max: 200, a: 50, b: 10 },
          { min: 200, max: 500, a: 100, b: 15 },
          { min: 500, max: 1000, a: 150, b: 20 },
        ],
        basePrice: 100,
        orderMinimumNoSurcharge: 1000,
      },
      error: null,
      fetchVenueData: vi.fn(),
    });
  });

  it("should complete the user flow and display the correct price breakdown", async () => {
    render(<Calculator />);

    // Input venue slug
    fireEvent.change(screen.getByTestId("venueSlug"), {
      target: { value: "home-assignment-venue-helsinki" },
    });

    // Input cart value
    fireEvent.change(screen.getByTestId("cartValue"), {
      target: { value: "10" },
    });

    // Input latitude and longitude
    fireEvent.change(screen.getByTestId("userLatitude"), {
      target: { value: "60.17094" },
    });
    fireEvent.change(screen.getByTestId("userLongitude"), {
      target: { value: "24.93087" },
    });

    // Click calculate button
    fireEvent.click(screen.getByTestId("calculateButton"));

    // Wait for PriceBreakdown to render
    await waitFor(() => expect(screen.queryByText(/Total Price:/i)).toBeInTheDocument());

    // Assert the price breakdown
    expect(screen.getByText(/Cart Value:/i)).toHaveTextContent("10.00 EUR");
    expect(screen.getByText(/Delivery Fee:/i)).toHaveTextContent("1.90 EUR");
    expect(screen.getByText(/Delivery Distance:/i)).toHaveTextContent("177 meters");
    expect(screen.getByText(/Small Order Surcharge:/i)).toHaveTextContent("0.00 EUR");
    expect(screen.getByText(/Total Price:/i)).toHaveTextContent("11.90 EUR");
  });

  it("should handle additional test case and display the correct price breakdown", async () => {
    render(<Calculator />);

    // Input venue slug
    fireEvent.change(screen.getByTestId("venueSlug"), {
      target: { value: "home-assignment-venue-helsinki" },
    });

    // Input cart value
    fireEvent.change(screen.getByTestId("cartValue"), {
      target: { value: "9" },
    });

    // Input latitude and longitude
    fireEvent.change(screen.getByTestId("userLatitude"), {
      target: { value: "60.17332568937988" },
    });
    fireEvent.change(screen.getByTestId("userLongitude"), {
      target: { value: "24.938220606032882" },
    });

    // Click calculate button
    fireEvent.click(screen.getByTestId("calculateButton"));

    // Wait for PriceBreakdown to render
    await waitFor(() => expect(screen.queryByText(/Total Price:/i)).toBeInTheDocument());

    // Assert the price breakdown
    expect(screen.getByText(/Cart Value:/i)).toHaveTextContent("9.00 EUR");
    expect(screen.getByText(/Delivery Fee:/i)).toHaveTextContent("2.90 EUR");
    expect(screen.getByText(/Delivery Distance:/i)).toHaveTextContent("659 meters");
    expect(screen.getByText(/Small Order Surcharge:/i)).toHaveTextContent("1.00 EUR");
    expect(screen.getByText(/Total Price:/i)).toHaveTextContent("12.90 EUR");
  });
});
