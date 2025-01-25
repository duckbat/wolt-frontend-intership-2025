import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GetLocationInput from "../../../components/ui/Inputs/GetLocationInput";

describe("GetLocationInput", () => {
  // Tests if the input renders correctly
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

  // Tests if the input calls setLatitude and setLongitude with the correct given location
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

    // Valid numeric input for latitude
    fireEvent.change(latInput, { target: { value: "60.17094" } });
    expect(mockSetLatitude).toHaveBeenLastCalledWith("60.17094");

    // Valid numeric input for longitude
    fireEvent.change(lonInput, { target: { value: "24.93087" } });
    expect(mockSetLongitude).toHaveBeenLastCalledWith("24.93087");
  });

  // Test if it still will call setLatitude or setLongitude if user types an invalid one
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
    fireEvent.change(latInput, { target: { value: "hello" } });
    // Because the regex fails, it won't call setLatitude
    expect(mockSetLatitude).not.toHaveBeenCalled();

    // Type invalid input for longitude
    fireEvent.change(lonInput, { target: { value: "24.93:D" } });
    expect(mockSetLongitude).not.toHaveBeenCalled();
  });

  // Tests if the input accepts negative coordinates
  it("accepts negative coordinates", () => {
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

    fireEvent.change(latInput, { target: { value: "-60.1234" } });
    expect(mockSetLatitude).toHaveBeenLastCalledWith("-60.1234");

    fireEvent.change(lonInput, { target: { value: "-24.5678" } });
    expect(mockSetLongitude).toHaveBeenLastCalledWith("-24.5678");
  });

  // Tests if the input shows an error if the user types invalid input and clears it after
  it("shows an error for invalid input and clears it after 3 seconds", async () => {
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
    const latError = screen.getByText("Invalid latitude");
    expect(latError).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("Invalid latitude")).not.toBeInTheDocument();
      },
      { timeout: 3000 } // Allow 3 seconds to ensure it clears after 2.5 seconds
    );

    // Type invalid input for longitude
    fireEvent.change(lonInput, { target: { value: "24.93awawdwdojajd" } });
    const lonError = screen.getByText("Invalid longitude");
    expect(lonError).toBeInTheDocument();

    // Wait for the error to disappear after 3 seconds
    await waitFor(
      () => {
        expect(
          screen.queryByText("Invalid longitude")
        ).not.toBeInTheDocument();
      },
      { timeout: 3000 } // Allow 3 seconds to ensure it clears after 2.5 seconds
    );
  });
});
