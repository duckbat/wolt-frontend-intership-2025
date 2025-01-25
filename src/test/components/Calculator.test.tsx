import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi, Mock } from "vitest";
import Calculator from "../../components/Calculator";
import { useVenueData } from "../../hooks/useVenueData";

// Mock hooks and utility functions
vi.mock("../../hooks/useVenueData", () => ({
  useVenueData: vi.fn(),
}));

// Test the calculation functions
vi.mock("../../utils/calculation", () => ({
  calculateDistance: vi.fn((lat1, lon1, lat2, lon2) => {
    if (
      lat1 === 60.17094 &&
      lon1 === 24.93087 &&
      lat2 === 60.17094 &&
      lon2 === 24.93087
    ) {
      return 177;
    }
    if (
      lat1 === 60.17332568937988 &&
      lon1 === 24.938220606032882 &&
      lat2 === 60.17094 &&
      lon2 === 24.93087
    ) {
      return 659;
    }
    if (lat1 === 99) {
      throw new Error("Distance too far");
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

// scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe("Calculator Tests (refactored)", () => {
  let mockOnPlayAnimation: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the venue data
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
      fetchVenueData: vi.fn().mockResolvedValue(true),
    });

    // Stub for onPlayAnimation
    mockOnPlayAnimation = vi.fn();
  });

  // Helper function to fill the form and submit
  async function fillFormAndSubmit({
    slug,
    cartValue,
    lat,
    lng,
  }: {
    slug?: string;
    cartValue?: string;
    lat?: string;
    lng?: string;
  }) {
    render(<Calculator onPlayAnimation={mockOnPlayAnimation} />);

    if (slug !== undefined) {
      fireEvent.change(screen.getByTestId("venueSlug"), {
        target: { value: slug },
      });
    }
    if (cartValue !== undefined) {
      fireEvent.change(screen.getByTestId("cartValue"), {
        target: { value: cartValue },
      });
    }
    if (lat !== undefined) {
      fireEvent.change(screen.getByTestId("userLatitude"), {
        target: { value: lat },
      });
    }
    if (lng !== undefined) {
      fireEvent.change(screen.getByTestId("userLongitude"), {
        target: { value: lng },
      });
    }

    // Click the calculate button
    fireEvent.click(screen.getByTestId("calculateButton"));
  }

  // Helper function to assert the price breakdown
  function assertPriceBreakdown({
    expectedCartValue,
    expectedDeliveryFee,
    expectedDistance,
    expectedSmallOrderSurcharge,
    expectedTotalPrice,
  }: {
    expectedCartValue: string;
    expectedDeliveryFee: string;
    expectedDistance: string;
    expectedSmallOrderSurcharge: string;
    expectedTotalPrice: string;
  }) {
    expect(screen.getByText("Cart Value:")).toBeInTheDocument();
    expect(screen.getByText(expectedCartValue)).toBeInTheDocument();

    expect(screen.getByText("Delivery Fee:")).toBeInTheDocument();
    expect(screen.getByText(expectedDeliveryFee)).toBeInTheDocument();

    expect(screen.getByText("Delivery Distance:")).toBeInTheDocument();
    expect(screen.getByText(expectedDistance)).toBeInTheDocument();

    expect(screen.getByText("Small Order Surcharge:")).toBeInTheDocument();
    expect(screen.getByText(expectedSmallOrderSurcharge)).toBeInTheDocument();

    expect(screen.getByText("Total Price:")).toBeInTheDocument();
    expect(screen.getByText(expectedTotalPrice)).toBeInTheDocument();
  }

  // Test the Calculator's first userflow with distance < 500 and cart value 10
  it("should complete userflow #1", async () => {
    await fillFormAndSubmit({
      slug: "home-assignment-venue-helsinki",
      cartValue: "10",
      lat: "60.17094",
      lng: "24.93087",
    });

    await waitFor(() => {
      expect(screen.queryByText(/Total Price:/i)).toBeInTheDocument();
    });

    assertPriceBreakdown({
      expectedCartValue: "10.00 EUR",
      expectedDeliveryFee: "1.90 EUR",
      expectedDistance: "177 m",
      expectedSmallOrderSurcharge: "0.00 EUR",
      expectedTotalPrice: "11.90 EUR",
    });
    expect(mockOnPlayAnimation).toHaveBeenCalled();
  });

  // Test the Calculator's second userflow with distance > 500 and cart value 9
  it("should complete userflow #2", async () => {
    await fillFormAndSubmit({
      slug: "home-assignment-venue-helsinki",
      cartValue: "9",
      lat: "60.17332568937988",
      lng: "24.938220606032882",
    });

    await waitFor(() => {
      expect(screen.queryByText(/Total Price:/i)).toBeInTheDocument();
    });

    assertPriceBreakdown({
      expectedCartValue: "9.00 EUR",
      expectedDeliveryFee: "2.90 EUR",
      expectedDistance: "659 m",
      expectedSmallOrderSurcharge: "1.00 EUR",
      expectedTotalPrice: "12.90 EUR",
    });
    expect(mockOnPlayAnimation).toHaveBeenCalled();
  });

  // Test the Calculator's third userflow with invalid slug
  it("should display error for userflow #3 if fetchVenueData returns false (wrong slug)", async () => {
    (useVenueData as Mock).mockReturnValue({
      venueData: null,
      error: null,
      fetchVenueData: vi.fn().mockResolvedValue(false),
    });

    await fillFormAndSubmit({
      slug: "slurp-juice",
      cartValue: "10",
      lat: "60.17094",
      lng: "24.93087",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Please, provide a valid venue slug.")
      ).toBeInTheDocument();
    });

    expect(mockOnPlayAnimation).not.toHaveBeenCalled();
  });

  // Test the Calculator's fourth userflow with large distance
  it("should display distance error for userflow #4", async () => {
    await fillFormAndSubmit({
      slug: "home-assignment-venue-helsinki",
      cartValue: "10",
      lat: "99", // triggers throw new Error("Distance too far")
      lng: "99.93087",
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Delivery is not available. You live too far, or given location is invalid."
        )
      ).toBeInTheDocument();
    });

    expect(mockOnPlayAnimation).not.toHaveBeenCalled();
  });
});
