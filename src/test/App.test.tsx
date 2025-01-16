import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the heading", () => {
    render(<App />);

    // Verify that the heading is rendered
    const heading = screen.getByRole("heading", { name: "Wolt Assignment" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("font-mono", "font-extrabold");
  });

  it("renders the Calculator component", () => {
    render(<App />);

    // Verify that the Calculator component is rendered
    const calculator = screen.getByTestId("calculator");
    expect(calculator).toBeInTheDocument();
  });
});