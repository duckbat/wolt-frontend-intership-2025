import { renderHook, waitFor } from "@testing-library/react";
import { useVenueData } from "../../hooks/useVenueData";
import { fetchVenueStatic, fetchVenueDynamic } from "../../utils/api";
import { vi } from "vitest";
import { act } from "react";

// Mock the api module
vi.mock("../../utils/api", () => ({
  fetchVenueStatic: vi.fn(),
  fetchVenueDynamic: vi.fn(),
}));

describe("useVenueData", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("fetches venue data successfully", async () => {
    // Mock successful responses for static and dynamic data
    const mockStaticData = {
      venue_raw: {
        location: {
          coordinates: [24.93087, 60.17094],
        },
      },
    };
    const mockDynamicData = {
      venue_raw: {
        delivery_specs: {
          order_minimum_no_surcharge: 1000,
          delivery_pricing: {
            base_price: 199,
            distance_ranges: [
              {
                min: 0,
                max: 500,
                a: 0,
                b: 0,
                flag: null,
              },
            ],
          },
        },
      },
    };
    (fetchVenueStatic as jest.Mock).mockResolvedValue(mockStaticData);
    (fetchVenueDynamic as jest.Mock).mockResolvedValue(mockDynamicData);

    const { result } = renderHook(() => useVenueData());

    // Call the fetchVenueData function
    await act(async () => {
      result.current.fetchVenueData("home-assignment-venue-helsinki");
    });

    // Wait for the state to update
    await waitFor(() => {
      expect(result.current.venueData).toEqual({
        location: [24.93087, 60.17094],
        orderMinimumNoSurcharge: 1000,
        basePrice: 199,
        distanceRanges: [
          {
            min: 0,
            max: 500,
            a: 0,
            b: 0,
            flag: null,
          },
        ],
      });
      expect(result.current.error).toBeNull();
    });
  });

  it("handles errors when fetching venue data", async () => {
    // Mock an error response for fetchVenueStatic
    (fetchVenueStatic as jest.Mock).mockRejectedValue(new Error("Failed to fetch data"));

    const { result } = renderHook(() => useVenueData());

    // Call the fetchVenueData function
    await act(async () => {
      result.current.fetchVenueData("home-assignment-venue-helsinki");
    });

    // Wait for the state to update
    await waitFor(() => {
      expect(result.current.venueData).toBeNull();
      expect(result.current.error).toBe(
        "Failed to fetch venue data."
      );
    });
  });

  it("trims the venueSlug before fetching data", async () => {
    // Mock successful responses for static and dynamic data
    const mockStaticData = {
      venue_raw: {
        location: {
          coordinates: [24.93087, 60.17094],
        },
      },
    };
    const mockDynamicData = {
      venue_raw: {
        delivery_specs: {
          order_minimum_no_surcharge: 1000,
          delivery_pricing: {
            base_price: 199,
            distance_ranges: [
              {
                min: 0,
                max: 500,
                a: 0,
                b: 0,
                flag: null,
              },
            ],
          },
        },
      },
    };
    (fetchVenueStatic as jest.Mock).mockResolvedValue(mockStaticData);
    (fetchVenueDynamic as jest.Mock).mockResolvedValue(mockDynamicData);

    const { result } = renderHook(() => useVenueData());

    // Call the fetchVenueData function with a venueSlug that has leading/trailing spaces
    await act(async () => {
      result.current.fetchVenueData("  home-assignment-venue-helsinki  ");
    });

    // Wait for the state to update
    await waitFor(() => {
      expect(result.current.venueData).toEqual({
        location: [24.93087, 60.17094],
        orderMinimumNoSurcharge: 1000,
        basePrice: 199,
        distanceRanges: [
          {
            min: 0,
            max: 500,
            a: 0,
            b: 0,
            flag: null,
          },
        ],
      });
      expect(result.current.error).toBeNull();
    });

    // Verify that the venueSlug was trimmed before being passed to the API functions
    expect(fetchVenueStatic).toHaveBeenCalledWith("home-assignment-venue-helsinki");
    expect(fetchVenueDynamic).toHaveBeenCalledWith("home-assignment-venue-helsinki");
  });
});