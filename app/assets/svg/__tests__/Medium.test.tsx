import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Medium from "../Medium";

const mockMedium = () => {
  render(<Medium />);
};

describe("renders all elements correctly", () => {
  it("should render without crashing", () => {
    mockMedium();
    const headerElement = screen.getByTestId("medium-svg");
    expect(headerElement).toBeInTheDocument();
  });

  it("should have the correct dimensions for SVG", () => {
    mockMedium();
    const svgElement = screen.getByTestId("medium-svg").querySelector("svg");
    expect(svgElement).toHaveAttribute("width", "60px");
    expect(svgElement).toHaveAttribute("height", "22px");
  });

  it("should render SVG paths correctly", () => {
    mockMedium();
    const svgElement = screen.getByTestId("medium-svg").querySelector("svg");
    const paths = svgElement ? svgElement.querySelectorAll("path") : "";
    expect(paths.length).toBeGreaterThan(0);
  });
});
