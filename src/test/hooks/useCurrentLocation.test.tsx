import { renderHook } from "@testing-library/react";
import { useGeolocated } from "react-geolocated";
import { vi } from "vitest";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";

vi.mock("react-geolocated", () => ({
  useGeolocated: vi.fn(),
}));

describe("useCurrentLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test to check if the hook returns the correct location values
  it("returns latitude and longitude when geolocation is available and enabled", () => {
    // Mock useGeolocated to return coordinates
    (useGeolocated as jest.Mock).mockReturnValue({
      coords: { latitude: 60.167888, longitude: 24.932295 },
      isGeolocationAvailable: true,
      isGeolocationEnabled: true,
      getPosition: vi.fn(),
      positionError: null,
    });

    const { result } = renderHook(() => useCurrentLocation());

    expect(result.current.latitude).toBe(60.167888);
    expect(result.current.longitude).toBe(24.932295);
    expect(result.current.isGeolocationAvailable).toBe(true);
    expect(result.current.isGeolocationEnabled).toBe(true);
    expect(result.current.error).toBeNull();
  });

  // Test to check if the hook returns null for latitude and longitude when geolocation is not available
  it("returns null for latitude and longitude when geolocation is not available", () => {
    // Mock useGeolocated to indicate geolocation is not available
    (useGeolocated as jest.Mock).mockReturnValue({
      coords: null,
      isGeolocationAvailable: false,
      isGeolocationEnabled: false,
      getPosition: vi.fn(),
      positionError: null,
    });

    const { result } = renderHook(() => useCurrentLocation());

    expect(result.current.latitude).toBeNull();
    expect(result.current.longitude).toBeNull();
    expect(result.current.isGeolocationAvailable).toBe(false);
    expect(result.current.isGeolocationEnabled).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // Test to check if the hook returns null for latitude and longitude when geolocation is not enabled
  it("returns null for latitude and longitude when geolocation is not enabled", () => {
    // Mock useGeolocated to indicate geolocation is not enabled
    (useGeolocated as jest.Mock).mockReturnValue({
      coords: null,
      isGeolocationAvailable: true,
      isGeolocationEnabled: false,
      getPosition: vi.fn(),
      positionError: null,
    });

    const { result } = renderHook(() => useCurrentLocation());

    expect(result.current.latitude).toBeNull();
    expect(result.current.longitude).toBeNull();
    expect(result.current.isGeolocationAvailable).toBe(true);
    expect(result.current.isGeolocationEnabled).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // Test to check if the hook returns an error when geolocation fails
  it("returns an error when permission is denied", () => {
    // Mock useGeolocated to return a permission denied error
    const mockError = {
      code: 1, // PERMISSION_DENIED
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };
    (useGeolocated as jest.Mock).mockReturnValue({
      coords: null,
      isGeolocationAvailable: true,
      isGeolocationEnabled: false,
      getPosition: vi.fn(),
      positionError: mockError,
    });

    const { result } = renderHook(() => useCurrentLocation());

    expect(result.current.error).toBe("Permission denied. Please enable location access.");
  });

  // Test to check if the hook returns an error when location is unavailable
  it("returns an error when location is unavailable", () => {
    // Mock useGeolocated to return a location unavailable error
    const mockError = {
      code: 2, // POSITION_UNAVAILABLE
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };
    (useGeolocated as jest.Mock).mockReturnValue({
      coords: null,
      isGeolocationAvailable: true,
      isGeolocationEnabled: false,
      getPosition: vi.fn(),
      positionError: mockError,
    });

    const { result } = renderHook(() => useCurrentLocation());

    expect(result.current.error).toBe("Location information is unavailable.");
  });

  // Test to check if the hook returns an error when the request times out
  it("returns an error when the request times out", () => {
    // Mock useGeolocated to return a timeout error
    const mockError = {
      code: 3, // TIMEOUT
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };
    (useGeolocated as jest.Mock).mockReturnValue({
      coords: null,
      isGeolocationAvailable: true,
      isGeolocationEnabled: false,
      getPosition: vi.fn(),
      positionError: mockError,
    });

    const { result } = renderHook(() => useCurrentLocation());

    expect(result.current.error).toBe("The request to get location timed out.");
  });

  // Test to check if the hook returns an error for unknown errors
  it("returns an error for unknown errors", () => {
    // Mock useGeolocated to return an unknown error
    const mockError = {
      code: 0, // Unknown error
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };
    (useGeolocated as jest.Mock).mockReturnValue({
      coords: null,
      isGeolocationAvailable: true,
      isGeolocationEnabled: false,
      getPosition: vi.fn(),
      positionError: mockError,
    });

    const { result } = renderHook(() => useCurrentLocation());

    expect(result.current.error).toBe("An unknown error occurred.");
  });
});