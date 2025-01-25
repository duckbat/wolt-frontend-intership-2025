import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import GetLocationButton from "../../../components/ui/Buttons/GetLocationButton";

describe("GetLocationButton", () => {
  // Test if the button renders correctly
  it("renders the button", () => {
    render(<GetLocationButton onLocationFound={vi.fn()} onError={vi.fn()} />);
    const button = screen.getByTestId("getLocation");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Get Location");
  });

  // Test if the button click if geoLocation is not supported
  it("calls onError when geolocation is not supported", () => {
    const onError = vi.fn();
    (navigator as any).geolocation = undefined;
    render(<GetLocationButton onLocationFound={vi.fn()} onError={onError} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onError).toHaveBeenCalledWith(
      "Geolocation is not supported by your browser"
    );
  });

  // Test if it finds the location when geolocation is supported
  it("calls onLocationFound when geolocation succeeds", () => {
    const onLocationFound = vi.fn();
    (navigator as any).geolocation = {
      getCurrentPosition: (success: (pos: any) => void) => {
        success({ coords: { latitude: 60.17, longitude: 24.93 } });
      },
    };
    render(
      <GetLocationButton onLocationFound={onLocationFound} onError={vi.fn()} />
    );
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onLocationFound).toHaveBeenCalledWith(60.17, 24.93);
  });

  // Test if error is called when getting geolocation fails or is denied
  it("calls onError with correct message if permission is denied", () => {
    const onError = vi.fn();
    (navigator as any).geolocation = {
      getCurrentPosition: (_success: any, error: (err: any) => void) => {
        error({ code: 1 });
      },
    };
    render(<GetLocationButton onLocationFound={vi.fn()} onError={onError} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onError).toHaveBeenCalledWith(
      "Permission denied. Please enable location access"
    );
  });
  // Test if error is called when location information is unavailable
  it("calls onError with correct message if location information is unavailable", () => {
    const onError = vi.fn();
    (navigator as any).geolocation = {
      getCurrentPosition: (_success: any, error: (err: any) => void) => {
        error({ code: 2 });
      },
    };
    render(<GetLocationButton onLocationFound={vi.fn()} onError={onError} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onError).toHaveBeenCalledWith(
      "Location information is unavailable"
    );
  });

  // Test if error is called when the request to get location timed out
  it("calls onError with correct message if the request to get location timed out", () => {
    const onError = vi.fn();
    (navigator as any).geolocation = {
      getCurrentPosition: (_success: any, error: (err: any) => void) => {
        error({ code: 3 });
      },
    };
    render(<GetLocationButton onLocationFound={vi.fn()} onError={onError} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onError).toHaveBeenCalledWith(
      "The request to get location timed out"
    );
  });

  // Test if error is called when an unknown error occurs
  it("calls onError with correct message if an unknown error occurs", () => {
    const onError = vi.fn();
    (navigator as any).geolocation = {
      getCurrentPosition: (_success: any, error: (err: any) => void) => {
        error({ code: 999 });
      },
    };
    render(<GetLocationButton onLocationFound={vi.fn()} onError={onError} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onError).toHaveBeenCalledWith("An unknown error occurred");
  });
});
