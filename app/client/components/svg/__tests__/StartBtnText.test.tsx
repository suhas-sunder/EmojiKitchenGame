import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import StartBtnText from "../StartBtnText";

const mockStartBtnText = () => {
  render(<StartBtnText />);
};

describe("renders all elements correctly", () => {
  it("should render without crashing", () => {
    mockStartBtnText();
    const headerElement = screen.getByTestId("start-btn-text");
    expect(headerElement).toBeInTheDocument();
  });

  it("should have the correct dimensions for SVG", () => {
    mockStartBtnText();
    const svgElement = screen
      .getByTestId("start-btn-text")
      .querySelector("svg");
    expect(svgElement).toHaveAttribute("width", "95px");
    expect(svgElement).toHaveAttribute("height", "48px");
  });

  it("should render SVG paths correctly", () => {
    mockStartBtnText();
    const svgElement = screen
      .getByTestId("start-btn-text")
      .querySelector("svg");
    const paths = svgElement ? svgElement.querySelectorAll("path") : "";
    expect(paths.length).toBeGreaterThan(0);
  });
});
