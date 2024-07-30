import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LogoTextEnd from "../LogoTextEnd";

const mockLogoTextEnd = () => {
  render(<LogoTextEnd customStyle="" />);
};

describe("renders all elements correctly", () => {
  it("should render without crashing", () => {
    mockLogoTextEnd();
    const headerElement = screen.getByTestId("logo-com");
    expect(headerElement).toBeInTheDocument();
  });

  it("should have the correct dimensions for SVG", () => {
    mockLogoTextEnd();
    const svgElement = screen.getByTestId("logo-com").querySelector("svg");
    expect(svgElement).toHaveAttribute("width", "39px");
    expect(svgElement).toHaveAttribute("height", "48px");
  });

  it("should render SVG paths correctly", () => {
    mockLogoTextEnd();
    const svgElement = screen.getByTestId("logo-com").querySelector("svg");
    const paths = svgElement ? svgElement.querySelectorAll("path") : "";
    expect(paths.length).toBeGreaterThan(0);
  });
});
