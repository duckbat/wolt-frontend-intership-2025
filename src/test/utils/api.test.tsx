import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchVenueStatic, fetchVenueDynamic } from "../../utils/api";

describe("API Functions", () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    // Create a new instance of axios mock adapter
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset the mock adapter after each test
    mockAxios.reset();
  });

  // Test if the fetchVenueStatic function fetches static data correctly
  it("fetchVenueStatic - successfully fetches static data", async () => {
    // Mock successful response for static data
    const mockData = {
      venue_raw: {
        location: {
          coordinates: [24.93087, 60.17094],
        },
      },
    };
    mockAxios
      .onGet(
        "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/static"
      )
      .reply(200, mockData);

    const result = await fetchVenueStatic("home-assignment-venue-helsinki");
    expect(result).toEqual(mockData);
  });

  // Test if the fetchVenueStatic function handles errors correctly
  it("fetchVenueStatic - handles errors when fetching static data", async () => {
    // Mock error response for static data
    mockAxios
      .onGet(
        "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/static"
      )
      .reply(500);

    // Check on console.error to verify it's called
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      fetchVenueStatic("home-assignment-venue-helsinki")
    ).rejects.toThrow("Failed to fetch venue static data");

    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching venue static data:",
      expect.anything()
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  // Test if the fetchVenueDynamic function fetches dynamic data correctly
  it("fetchVenueDynamic - successfully fetches dynamic data", async () => {
    // Mock successful response for dynamic data
    const mockData = {
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
    mockAxios
      .onGet(
        "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/dynamic"
      )
      .reply(200, mockData);

    const result = await fetchVenueDynamic("home-assignment-venue-helsinki");
    expect(result).toEqual(mockData);
  });

  // Test if the fetchVenueDynamic function handles errors correctly
  it("fetchVenueDynamic - handles errors when fetching dynamic data", async () => {
    // Mock error response for dynamic data
    mockAxios
      .onGet(
        "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues/home-assignment-venue-helsinki/dynamic"
      )
      .reply(500);

    // Check on console.error to verify it's called
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(
      fetchVenueDynamic("home-assignment-venue-helsinki")
    ).rejects.toThrow("Failed to fetch venue dynamic data");

    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching venue dynamic data:",
      expect.anything()
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
