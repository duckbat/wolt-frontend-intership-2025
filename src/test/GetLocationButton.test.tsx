import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import GetLocationButton from "../components/ui/Buttons/GetLocationButton"; 
// Adjust the import path based on your folder structure

describe("GetLocationButton", () => {
  it("renders the button", () => {
    render(<GetLocationButton onLocationFound={vi.fn()} onError={vi.fn()} />);
    const button = screen.getByTestId("getLocation");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Get Location");
  });

  it("calls onError when geolocation is not supported", () => {
    const onError = vi.fn();
    (navigator as any).geolocation = undefined; // Simulate no geolocation
    render(<GetLocationButton onLocationFound={vi.fn()} onError={onError} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onError).toHaveBeenCalledWith(
      "Geolocation is not supported by your browser."
    );
  });

  it("calls onLocationFound when geolocation succeeds", () => {
    const onLocationFound = vi.fn();
    (navigator as any).geolocation = {
      getCurrentPosition: (success: (pos: any) => void) => {
        success({ coords: { latitude: 60.17, longitude: 24.93 } });
      },
    };
    render(<GetLocationButton onLocationFound={onLocationFound} onError={vi.fn()} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onLocationFound).toHaveBeenCalledWith(60.17, 24.93);
  });

  it("calls onError with correct message if permission is denied", () => {
    const onError = vi.fn();
    (navigator as any).geolocation = {
      getCurrentPosition: (_success: any, error: (err: any) => void) => {
        // numeric code 1 = PERMISSION_DENIED
        error({ code: 1 });
      },
    };
    render(<GetLocationButton onLocationFound={vi.fn()} onError={onError} />);
    fireEvent.click(screen.getByTestId("getLocation"));
    expect(onError).toHaveBeenCalledWith(
      "Permission denied. Please enable location access."
    );
  });
});
