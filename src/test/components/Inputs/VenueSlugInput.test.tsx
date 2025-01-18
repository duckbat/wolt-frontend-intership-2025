import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VenueSlugInput from "../../../components/ui/Inputs/VenueSlugInput";

describe("VenueSlugInput", () => {
  let mockOnFetch: ReturnType<typeof vi.fn>;
  let mockSetVenueSlug: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnFetch = vi.fn().mockResolvedValue(true);
    mockSetVenueSlug = vi.fn();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

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

  it("updates setVenueSlug on user typing", () => {
    render(
      <VenueSlugInput
        venueSlug=""
        setVenueSlug={mockSetVenueSlug}
        onFetch={mockOnFetch}
      />
    );

    const input = screen.getByTestId("venueSlug") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "new-slug" } });
    expect(mockSetVenueSlug).toHaveBeenCalledWith("new-slug");
  });

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