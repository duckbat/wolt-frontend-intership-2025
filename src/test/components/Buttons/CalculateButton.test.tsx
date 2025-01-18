import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CalculateButton from "../../../components/ui/Buttons/CalculateButton";

describe("CalculateButton", () => {
  it("renders the button with correct text", () => {
    render(<CalculateButton onClick={vi.fn()} />);
    const button = screen.getByTestId("calculateButton");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Calculate delivery price");
  });

  it("calls onClick handler when clicked and not disabled", () => {
    const handleClick = vi.fn();
    render(<CalculateButton onClick={handleClick} disabled={false} />);

    const button = screen.getByTestId("calculateButton");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("doesn't call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<CalculateButton onClick={handleClick} disabled={true} />);

    const button = screen.getByTestId("calculateButton");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
