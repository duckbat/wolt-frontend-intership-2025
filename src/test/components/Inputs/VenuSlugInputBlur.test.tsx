import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import VenueSlugInput from "../../../components/ui/Inputs/VenueSlugInput";

// Mocks for the tests
const mockOnFetch = vi.fn(async (slug: string) => {
  return slug === "home-assignment-venue-helsinki" || slug === "venue";
});

describe("VenueSlugInput with real check for correct venue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test if it calls onFetch after onBlur with the correct slug
  it("succeeds onBlur if slug is 'home-assignment-venue-helsinki' or 'venue'", async () => {
    render(
      <VenueSlugInput
        venueSlug="home-assignment-venue-helsinki"
        setVenueSlug={() => {}}
        onFetch={mockOnFetch}
      />
    );

    fireEvent.blur(screen.getByTestId("venueSlug"));

    await waitFor(() => {
      expect(mockOnFetch).toHaveBeenCalledWith(
        "home-assignment-venue-helsinki"
      );
    });

    // Should NOT see local error because it succeeded
    expect(
      screen.queryByText("Failed to fetch venue data.")
    ).not.toBeInTheDocument();
  });

  // Test if it can call onFetch after onBlur with the incorrect slug
  it("fails onBlur if slug is anything else", async () => {
    render(
      <VenueSlugInput
        venueSlug="blablabla"
        setVenueSlug={() => {}}
        onFetch={mockOnFetch}
      />
    );

    fireEvent.blur(screen.getByTestId("venueSlug"));

    await waitFor(() => {
      expect(mockOnFetch).toHaveBeenCalledWith("blablabla");
    });

    expect(screen.getByText("Failed to fetch venue data")).toBeInTheDocument();
  });
});
