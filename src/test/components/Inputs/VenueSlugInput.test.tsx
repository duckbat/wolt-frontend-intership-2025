import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VenueSlugInput from "../../../components/ui/Inputs/VenueSlugInput";

//TODO: fill the coverage for this test
describe("VenueSlugInput", () => {
  // Mocks for the tests
  let mockOnFetch: ReturnType<typeof vi.fn>;
  let mockSetVenueSlug: ReturnType<typeof vi.fn>;

  // Mock hooks and utility functions
  beforeEach(() => {
    vi.useFakeTimers();
    mockOnFetch = vi.fn().mockResolvedValue(true);
    mockSetVenueSlug = vi.fn();
  });

  // Clear mocks and timers after each test
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // Tests if the VenueSlugInput renders correctly
  it("renders the input and label correctly", () => {
    render(
      <VenueSlugInput
        venueSlug=""
        setVenueSlug={mockSetVenueSlug}
        onFetch={mockOnFetch}
      />
    );

    const inputElement = screen.getByTestId("venueSlug");
    const labelElement = screen.getByLabelText("Venue Slug");

    expect(inputElement).toBeInTheDocument();
    expect(labelElement).toBeInTheDocument();
  });

  // Tests if the input calls setVenueSlug with the correct value
  it("updates setVenueSlug on user typing", () => {
    render(
      <VenueSlugInput
        venueSlug=""
        setVenueSlug={mockSetVenueSlug}
        onFetch={mockOnFetch}
      />
    );

    const input = screen.getByTestId("venueSlug") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "venue" } });
    expect(mockSetVenueSlug).toHaveBeenCalledWith("venue");
  });

  // Tests if the input displays an error if the user types an invalid venue slug
  //TODO: check this test up
  it("displays prop-level error if provided", () => {
    render(
      <VenueSlugInput
        venueSlug="example"
        setVenueSlug={mockSetVenueSlug}
        onFetch={mockOnFetch}
        error="Prop-level error message"
      />
    );

    expect(screen.getByText("Prop-level error message")).toBeInTheDocument();
  });
});
