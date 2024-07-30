import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Min from "../Min";

const mockMin = () => {
  render(<Min />);
};

describe("renders all elements correctly", () => {
  it("should render without crashing", () => {
    mockMin();
    const headerElement = screen.getByTitle("min-icon");
    expect(headerElement).toBeInTheDocument();
  });

  it("should have the correct dimensions for SVG", () => {
    mockMin();
    const svgElement = screen.getByTitle("min-icon").querySelector("svg");
    expect(svgElement).toHaveAttribute("width", "40px");
    expect(svgElement).toHaveAttribute("height", "20px");
  });

  it("should render SVG paths correctly", () => {
    mockMin();
    const svgElement = screen.getByTitle("min-icon").querySelector("svg");
    const paths = svgElement ? svgElement.querySelectorAll("path") : "";
    expect(paths.length).toBeGreaterThan(0);
  });
});
