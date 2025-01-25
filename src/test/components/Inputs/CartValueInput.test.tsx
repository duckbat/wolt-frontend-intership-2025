import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CartValueInput from "../../../components/ui/Inputs/CartValueInput";

describe("CartValueInput", () => {
  // Tests if the input renders correctly
  it("renders the input with a placeholder", () => {
    const { getByPlaceholderText } = render(
      <CartValueInput cartValue="" setCartValue={vi.fn()} />
    );
    const input = getByPlaceholderText("16.12") as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  // Tests if the input calls setCartValue with the correct value
  it("calls setCartValue for valid numeric input (up to 2 decimals)", () => {
    const mockSetCartValue = vi.fn();
    render(<CartValueInput cartValue="" setCartValue={mockSetCartValue} />);

    const input = screen.getByTestId("cartValue") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "12" } });
    expect(mockSetCartValue).toHaveBeenCalledWith("12");

    fireEvent.change(input, { target: { value: "12.3" } });
    expect(mockSetCartValue).toHaveBeenLastCalledWith("12.3");

    fireEvent.change(input, { target: { value: "12.34" } });
    expect(mockSetCartValue).toHaveBeenLastCalledWith("12.34");

    fireEvent.change(input, { target: { value: "12.345" } });
    expect(mockSetCartValue).toHaveBeenLastCalledWith("12.34");
  });

  // Tests if user leaves the input empty, it shows an error
  it("shows an error if the user blurs empty input", () => {
    const { getByText } = render(
      <CartValueInput cartValue="" setCartValue={vi.fn()} />
    );

    const input = screen.getByTestId("cartValue");
    fireEvent.blur(input);

    const errorMessage = getByText("Cart value is required");
    expect(errorMessage).toBeInTheDocument();
  });

  // Tests if user types something valid after leaving it empty, it clears the "onBlur" error
  it("clears error if user types something valid after leaving it empty", () => {
    const { getByText, queryByText } = render(
      <CartValueInput cartValue="" setCartValue={vi.fn()} />
    );

    const input = screen.getByTestId("cartValue");

    fireEvent.blur(input);
    const errorMessage = getByText("Cart value is required");
    expect(errorMessage).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "12" } });

    const removedError = queryByText("Cart value is required");
    expect(removedError).not.toBeInTheDocument();
  });

  // Tests if the input shows a type error for invalid input and clears it after 3 seconds
  it("calls onBlur if provided, when the user blurs a non-empty input", () => {
    const mockOnBlur = vi.fn();
    render(
      <CartValueInput
        cartValue="16.12"
        setCartValue={vi.fn()}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByTestId("cartValue");
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  // Tests if the input doesn't call onBlur if the input is empty
  it("doesn't call onBlur if the input is empty", () => {
    const mockOnBlur = vi.fn();
    render(
      <CartValueInput cartValue="" setCartValue={vi.fn()} onBlur={mockOnBlur} />
    );

    const input = screen.getByTestId("cartValue");
    fireEvent.blur(input);

    expect(mockOnBlur).not.toHaveBeenCalled();
  });

  // Tests if the input shows a type error for invalid input and clears it after 2.5 seconds
  it("shows a type error for invalid input and clears it after 3 seconds", async () => {
    render(<CartValueInput cartValue="" setCartValue={vi.fn()} />);

    const input = screen.getByTestId("cartValue");

    fireEvent.change(input, { target: { value: "invalid" } });

    const errorMessage = screen.getByText(
      "Please try to enter a valid cart number"
    );
    expect(errorMessage).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.queryByText("Please try to enter a valid cart number")
        ).not.toBeInTheDocument();
      },
      { timeout: 3500 } // Allow 3.5 seconds to ensure it clears after 2.5 seconds
    );
  });

  // Tests if the input shows an error for a cart value of 0 on blur
  it("shows an error for a cart value of 0 on blur", async () => {
    const mockSetCartValue = vi.fn();
    render(<CartValueInput cartValue="0" setCartValue={mockSetCartValue} />);

    const input = screen.getByTestId("cartValue") as HTMLInputElement;

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText("Cart value cannot be 0")).toBeInTheDocument();
    });
  });
});
