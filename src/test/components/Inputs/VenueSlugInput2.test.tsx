import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import VenueSlugInput from "../../../components/ui/Inputs/VenueSlugInput";

const mockOnFetch = vi.fn(async (slug: string) => {
  return slug === "home-assignment-venue-helsinki";
});

describe("VenueSlugInput with real check for 'home-assignment-venue-helsinki'", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("succeeds on blur if slug is 'home-assignment-venue-helsinki'", async () => {
    render(
      <VenueSlugInput
        venueSlug="home-assignment-venue-helsinki"
        setVenueSlug={() => {}}
        onFetch={mockOnFetch}
      />
    );

    // Blur the input => tries onFetch
    fireEvent.blur(screen.getByTestId("venueSlug"));

    // Wait for the onFetch call
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

  it("fails on blur if slug is anything else", async () => {
    render(
      <VenueSlugInput
        venueSlug="some-other-slug"
        setVenueSlug={() => {}}
        onFetch={mockOnFetch}
      />
    );

    fireEvent.blur(screen.getByTestId("venueSlug"));

    await waitFor(() => {
      expect(mockOnFetch).toHaveBeenCalledWith("some-other-slug");
    });

    // Because mockOnFetch returns false for non-hel sinki slug => localError
    expect(screen.getByText("Failed to fetch venue data.")).toBeInTheDocument();
  });
});
