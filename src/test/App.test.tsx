import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the heading", () => {
    render(<App />);

    // Heading render
    const heading = screen.getByRole("heading", { name: "Wolt Calculator" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("font-bold");
  });

  it("renders the Calculator component", () => {
    render(<App />);

    // Main component render
    const calculator = screen.getByTestId("calculator");
    expect(calculator).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<App />);

    // Footer render
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    // Check footer content
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year}`)).toBeInTheDocument();
    expect(screen.getByText("Khai's Wolt assignment")).toBeInTheDocument();
  });
});