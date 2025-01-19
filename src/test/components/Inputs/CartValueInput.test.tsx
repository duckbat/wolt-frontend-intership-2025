import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CartValueInput from "../../../components/ui/Inputs/CartValueInput";


describe("CartValueInput", () => {
  it("renders the input with a placeholder", () => {
    const { getByPlaceholderText } = render(
      <CartValueInput cartValue="" setCartValue={vi.fn()} />
    );
    const input = getByPlaceholderText("16.12") as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it("calls setCartValue for valid numeric input (up to 2 decimals)", () => {
    const mockSetCartValue = vi.fn();
    render(
      <CartValueInput
        cartValue=""
        setCartValue={mockSetCartValue}
      />
    );

    const input = screen.getByTestId("cartValue") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "12" } });
    expect(mockSetCartValue).toHaveBeenCalledWith("12");

    fireEvent.change(input, { target: { value: "12.3" } });
    expect(mockSetCartValue).toHaveBeenLastCalledWith("12.3");

    fireEvent.change(input, { target: { value: "12.34" } });
    expect(mockSetCartValue).toHaveBeenLastCalledWith("12.34");

    fireEvent.change(input, { target: { value: "12.345" } });
    expect(mockSetCartValue).toHaveBeenCalledTimes(3);
  });

  it("shows an error if the user blurs empty input", () => {
    const { getByText } = render(
      <CartValueInput cartValue="" setCartValue={vi.fn()} />
    );

    const input = screen.getByTestId("cartValue");
    fireEvent.blur(input);

    const errorMessage = getByText("Cart value is required.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("clears error if user types something valid after leaving it empty", () => {
    const { getByText, queryByText } = render(
      <CartValueInput cartValue="" setCartValue={vi.fn()} />
    );

    const input = screen.getByTestId("cartValue");

    fireEvent.blur(input);
    const errorMessage = getByText("Cart value is required.");
    expect(errorMessage).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "12" } });

    const removedError = queryByText("Cart value is required.");
    expect(removedError).not.toBeInTheDocument();
  });

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

  it("doesn't call onBlur if the input is empty", () => {
    const mockOnBlur = vi.fn();
    render(
      <CartValueInput
        cartValue=""
        setCartValue={vi.fn()}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByTestId("cartValue");
    fireEvent.blur(input);

    expect(mockOnBlur).not.toHaveBeenCalled();
  });
});
