import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import Lottie from "lottie-react";
import SushiLottie, { SushiLottieRef } from "../../components/ui/SushiLottie";

// Mock the Lottie component
vi.mock("lottie-react", () => ({
  __esModule: true,
  default: vi.fn(() => null),
}));

describe("SushiLottie", () => {
  it("calls goToAndPlay on the Lottie component when playAnimation is called", () => {
    // Create a mock for the goToAndPlay method
    const goToAndPlayMock = vi.fn();
    (Lottie as unknown as jest.Mock).mockImplementation(({ lottieRef }) => {
      if (lottieRef) {
        lottieRef.current = { goToAndPlay: goToAndPlayMock };
      }
      return null;
    });

    // Create a ref to pass to the SushiLottie component
    const ref = { current: null } as React.RefObject<SushiLottieRef>;

    // Render the SushiLottie component
    render(<SushiLottie ref={ref} />);

    // Call the playAnimation method through the ref
    ref.current?.playAnimation();

    // Verify if goToAndPlay was called on the Lottie component
    expect(goToAndPlayMock).toHaveBeenCalledWith(0, true);
  });
});