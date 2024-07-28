import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Title from "../Title";

const mockTitle = () => {
  render(<Title />);
};

describe("renders all elements correctly", () => {
  it("should render without crashing", () => {
    mockTitle();
    const headerElement = screen.getByRole("heading", {
      name: /Speed test title/i,
    });
    expect(headerElement).toBeInTheDocument();
  });

  it("should have the correct dimensions for SVG", () => {
    mockTitle();
    const svgElement = screen
      .getByRole("heading", { name: /Speed test title/i })
      .querySelector("svg");
    expect(svgElement).toHaveAttribute("width", "480px");
    expect(svgElement).toHaveAttribute("height", "40px");
  });

  it("should render SVG paths correctly", () => {
    mockTitle();
    const svgElement = screen
      .getByRole("heading", { name: /Speed test title/i })
      .querySelector("svg");
    const paths = svgElement ? svgElement.querySelectorAll("path") : "";
    expect(paths.length).toBeGreaterThan(0);
  });
});
