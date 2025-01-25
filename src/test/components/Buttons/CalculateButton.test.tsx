import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CalculateButton from "../../../components/ui/Buttons/CalculateButton";

describe("CalculateButton", () => {
  // Test if the button renders correctly
  it("renders the button with correct text", () => {
    render(<CalculateButton onClick={vi.fn()} />);
    const button = screen.getByTestId("calculateButton");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Calculate delivery price");
  });

  // Test if the button clicks when not disabled
  it("calls onClick handler when clicked and not disabled", () => {
    const handleClick = vi.fn();
    render(<CalculateButton onClick={handleClick} disabled={false} />);

    const button = screen.getByTestId("calculateButton");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Test if the button clicks when disabled
  it("doesn't call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<CalculateButton onClick={handleClick} disabled={true} />);

    const button = screen.getByTestId("calculateButton");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
