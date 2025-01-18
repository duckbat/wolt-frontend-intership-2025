import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GetLocationInput from "../../../components/ui/Inputs/GetLocationInput";

describe("GetLocationInput", () => {
  it("renders latitude and longitude inputs with placeholders", () => {
    const mockSetLatitude = vi.fn();
    const mockSetLongitude = vi.fn();

    render(
      <GetLocationInput
        latitude=""
        longitude=""
        setLatitude={mockSetLatitude}
        setLongitude={mockSetLongitude}
      />
    );

    const latInput = screen.getByPlaceholderText("60.17094");
    const lonInput = screen.getByPlaceholderText("24.93087");

    expect(latInput).toBeInTheDocument();
    expect(lonInput).toBeInTheDocument();
  });

  it("calls setLatitude and setLongitude with valid numeric input", () => {
    const mockSetLatitude = vi.fn();
    const mockSetLongitude = vi.fn();

    render(
      <GetLocationInput
        latitude=""
        longitude=""
        setLatitude={mockSetLatitude}
        setLongitude={mockSetLongitude}
      />
    );

    const latInput = screen.getByTestId("userLatitude") as HTMLInputElement;
    const lonInput = screen.getByTestId("userLongitude") as HTMLInputElement;

    // Type valid numeric input for latitude
    fireEvent.change(latInput, { target: { value: "60.167888" } });
    expect(mockSetLatitude).toHaveBeenLastCalledWith("60.167888");

    // Type valid numeric input for longitude
    fireEvent.change(lonInput, { target: { value: "24.932295" } });
    expect(mockSetLongitude).toHaveBeenLastCalledWith("24.932295");
  });

  it("does NOT call setLatitude or setLongitude if user types invalid input", () => {
    const mockSetLatitude = vi.fn();
    const mockSetLongitude = vi.fn();

    render(
      <GetLocationInput
        latitude=""
        longitude=""
        setLatitude={mockSetLatitude}
        setLongitude={mockSetLongitude}
      />
    );

    const latInput = screen.getByTestId("userLatitude") as HTMLInputElement;
    const lonInput = screen.getByTestId("userLongitude") as HTMLInputElement;

    // Type invalid input for latitude
    fireEvent.change(latInput, { target: { value: "abc" } });
    // Because the regex fails, it won't call setLatitude
    expect(mockSetLatitude).not.toHaveBeenCalled();

    // Type invalid input for longitude
    fireEvent.change(lonInput, { target: { value: "24.93xyz" } });
    expect(mockSetLongitude).not.toHaveBeenCalled();
  });

  it("accepts negative coordinates (e.g., for Western Hemisphere or S latitude)", () => {
    const mockSetLatitude = vi.fn();
    const mockSetLongitude = vi.fn();

    render(
      <GetLocationInput
        latitude=""
        longitude=""
        setLatitude={mockSetLatitude}
        setLongitude={mockSetLongitude}
      />
    );

    const latInput = screen.getByTestId("userLatitude") as HTMLInputElement;
    const lonInput = screen.getByTestId("userLongitude") as HTMLInputElement;

    // Negative latitude
    fireEvent.change(latInput, { target: { value: "-60.1234" } });
    expect(mockSetLatitude).toHaveBeenLastCalledWith("-60.1234");

    // Negative longitude
    fireEvent.change(lonInput, { target: { value: "-24.5678" } });
    expect(mockSetLongitude).toHaveBeenLastCalledWith("-24.5678");
  });
});
