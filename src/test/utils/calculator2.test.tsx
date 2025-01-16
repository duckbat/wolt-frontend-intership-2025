import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi, Mock } from "vitest";
import Calculator from "../../components/Calculator";
import { useVenueData } from "../../hooks/useVenueData";

vi.mock("../../hooks/useVenueData", () => ({
  useVenueData: vi.fn(),
}));

vi.mock("../../utils/calculation", () => ({
  calculateDistance: vi.fn((lat1, lon1, lat2, lon2) => {
    if (
      lat1 === 60.17332568937988 &&
      lon1 === 24.938220606032882 &&
      lat2 === 60.17094 &&
      lon2 === 24.93087
    ) {
      return 659;
    }
    return 177;
  }),
  calculateDeliveryFee: vi.fn((distance) => {
    if (distance === 659) {
      return 290;
    }
    return 190;
  }),
}));

describe("Calculator Additional Test Case", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useVenueData as Mock).mockReturnValue({
      venueData: {
        location: [24.93087, 60.17094],
        distanceRanges: [100, 200, 300, 700],
        basePrice: 100,
        orderMinimumNoSurcharge: 1000, // in cents
      },
      error: null,
      fetchVenueData: vi.fn(),
    });
  });

  it("should complete the user flow for additional test case and display the correct price breakdown", async () => {
    render(<Calculator />);

    const venueSlugInput = screen.getByTestId("venueSlug");
    fireEvent.change(venueSlugInput, {
      target: { value: "home-assigment-venue-helsinki" },
    });

    const cartValueInput = screen.getByTestId("cartValue");
    fireEvent.change(cartValueInput, { target: { value: "9" } });

    const latitudeInput = screen.getByTestId("userLatitude");
    fireEvent.change(latitudeInput, { target: { value: "60.17332568937988" } });

    const longitudeInput = screen.getByTestId("userLongitude");
    fireEvent.change(longitudeInput, {
      target: { value: "24.938220606032882" },
    });

    const calculateButton = screen.getByTestId("calculateButton");
    fireEvent.click(calculateButton);

    expect(await screen.findByText(/cart value:/i)).toHaveTextContent(
      "9.00 EUR"
    );
    expect(screen.getByText(/delivery fee:/i)).toHaveTextContent("2.90 EUR");
    expect(screen.getByText(/delivery distance:/i)).toHaveTextContent("659 m");
    expect(screen.getByText(/small order surcharge:/i)).toHaveTextContent(
      "1.00 EUR"
    );
    expect(screen.getByText(/total price:/i)).toHaveTextContent("12.90 EUR");

    expect(
      screen.getByText(/cart value:/i).getAttribute("data-raw-value")
    ).toBe("900");
    expect(
      screen.getByText(/delivery fee:/i).getAttribute("data-raw-value")
    ).toBe("290");
    expect(
      screen.getByText(/delivery distance:/i).getAttribute("data-raw-value")
    ).toBe("659");
    expect(
      screen.getByText(/small order surcharge:/i).getAttribute("data-raw-value")
    ).toBe("100");
    expect(
      screen.getByText(/total price:/i).getAttribute("data-raw-value")
    ).toBe("1290");
  });
});
