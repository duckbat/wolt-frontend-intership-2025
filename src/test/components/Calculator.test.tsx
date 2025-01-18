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

    // By default, the fetchVenueData is successful
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

  /**
   * Helper to fill the form and click "calculateButton".
   */
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

  /**
   * Helper to check the price breakdown lines in the UI.
   */
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

  it("should complete user flow #1 (177m, cart=10EUR)", async () => {
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

  it("should complete user flow #2 (659m, cart=9EUR)", async () => {
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

  it("should display error if fetchVenueData returns false (invalid slug)", async () => {
    (useVenueData as Mock).mockReturnValue({
      venueData: null,
      error: null,
      fetchVenueData: vi.fn().mockResolvedValue(false),
    });

    await fillFormAndSubmit({
      slug: "invalid-slug",
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

  it("should handle distance error (e.g., out of range)", async () => {
    await fillFormAndSubmit({
      slug: "home-assignment-venue-helsinki",
      cartValue: "10",
      lat: "99", // triggers throw new Error("Distance too far")
      lng: "24.93087",
    });

    await waitFor(() => {
      expect(
        screen.getByText("Delivery is not available, you live too far.")
      ).toBeInTheDocument();
    });

    expect(mockOnPlayAnimation).not.toHaveBeenCalled();
  });
});
