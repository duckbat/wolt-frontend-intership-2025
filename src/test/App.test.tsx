import { render, screen } from "@testing-library/react";
import { describe, it, beforeEach, vi } from "vitest";
import App from "../App";

vi.mock("../components/ui/SushiLottie.tsx", () => ({
  __esModule: true,
  default: () => <div data-test-id="mock-sushi-lottie" />,
}));

describe("App", () => {
  beforeEach(() => {
    // Render <App /> once before each test
    render(<App />);
  });

  it("renders the heading with 'Wolt Calculator'", () => {
    const heading = screen.getByRole("heading", { name: /wolt calculator/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("font-bold");
  });

  it("renders the Calculator component", () => {
    const calculator = screen.getByTestId("calculator");
    expect(calculator).toBeInTheDocument();
  });

  it("renders the footer", () => {
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();

    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year}`)).toBeInTheDocument();
    expect(screen.getByText("Khai's Wolt assignment")).toBeInTheDocument();
  });

  it("renders the mocked SushiLottie animation", () => {
    const mockAnimation = screen.getByTestId("mock-sushi-lottie");
    expect(mockAnimation).toBeInTheDocument();
  });
});
