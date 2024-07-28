import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import DifficultyLabel from "../DifficultyLabel";

const mockDifficultyLabel = () => {
  render(<DifficultyLabel />);
};

describe("renders all elements correctly", () => {
  it("should render without crashing", () => {
    mockDifficultyLabel();
    const headerElement = screen.getByTestId("difficlty-label");
    expect(headerElement).toBeInTheDocument();
  });

  it("should have the correct dimensions for SVG", () => {
    mockDifficultyLabel();
    const svgElement = screen
      .getByTestId("difficlty-label")
      .querySelector("svg");
    expect(svgElement).toHaveAttribute("width", "83px");
    expect(svgElement).toHaveAttribute("height", "20px");
  });

  it("should render SVG paths correctly", () => {
    mockDifficultyLabel();
    const svgElement = screen
      .getByTestId("difficlty-label")
      .querySelector("svg");
    const paths = svgElement ? svgElement.querySelectorAll("path") : "";
    expect(paths.length).toBeGreaterThan(0);
  });
});
