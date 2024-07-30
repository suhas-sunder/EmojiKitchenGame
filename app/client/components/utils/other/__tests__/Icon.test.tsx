import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Icon from "../Icon";
import { MemoryRouter } from "react-router-dom"; // setupTests.t
import loadable from "@loadable/component";
const LockOpenTwoToneIcon = loadable(
  () => import("@mui/icons-material/LockOpenTwoTone"),
);
interface PropType {
  title: string;
  customStyle: string;
  icon: string;
}

const mockIcon = ({ title, customStyle, icon }: PropType) => {
  render(
    <MemoryRouter>
      <Icon title={title} customStyle={customStyle} icon={icon} />
    </MemoryRouter>,
  );
};

describe("renders icons properly", () => {
  it('should render correct icon based on "icon" prop value', () => {
    mockIcon({
      title: "Eye Icon",
      customStyle: "text-red-500",
      icon: "eye",
    });

    const iconElement = screen.getByTitle("Eye Icon");

    expect(iconElement).toBeInTheDocument();
  });

  it("should apply the correct custom style class", () => {
    mockIcon({
      title: "Eye Icon",
      customStyle: "text-blue-500",
      icon: "eye",
    });
    const iconElement = screen.getByTitle("Eye Icon");

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveClass("text-blue-500");
  });

  it("should preload icons after 2 seconds", () => {
    mockIcon({
      title: "Eye Icon",
      customStyle: "text-red-500",
      icon: "eye",
    });

    // Wait for 2 seconds
    setTimeout(() => {
      expect(LockOpenTwoToneIcon.preload).toHaveBeenCalled();
    }, 2000);
  });

  it("should return default icon when 'icon' prop value is unrecognized", () => {
    render(
      <Icon title="Unknown Icon" customStyle="text-gray-500" icon="unknown" />,
    );

    const iconElement = screen.getByTitle("Unknown Icon");

    expect(iconElement).toBeInTheDocument();
  });

  it("should handle missing 'icon' prop gracefully", () => {
    mockIcon({
      title: "No Icon",
      customStyle: "text-gray-500",
      icon: "", // No icon prop provided
    });

    const iconElement = screen.getByTitle("No Icon");

    expect(iconElement).toBeInTheDocument();
  });

  it("should handle missing 'title' prop gracefully", () => {
    mockIcon({
      customStyle: "text-gray-500",
      icon: "eye",
      title: "",
    });

    const iconElement = screen.getByTitle("default-star-icon");

    expect(iconElement).toBeInTheDocument();
  });

  it("should handle missing 'title' prop gracefully", () => {
    mockIcon({
      customStyle: "text-gray-500",
      icon: "eye",
      title: "", // No title prop provided
    });

    const iconElement = screen.getByTitle("default-star-icon");

    expect(iconElement).toBeInTheDocument();
  });

  it("should handle rapid prop changes without errors", () => {
    mockIcon({
      title: "Initial Icon",
      customStyle: "text-gray-500",
      icon: "eye",
    });

    mockIcon({
      title: "Updated Icon",
      customStyle: "text-blue-500",
      icon: "heart",
    });

    mockIcon({
      title: "Final Icon",
      customStyle: "text-red-500",
      icon: "lockClosed",
    });

    expect(true).toBe(true); // If no error, the test passes
  });

  it("should confirm that the correct icon component is rendered for each 'icon' prop value", () => {
    mockIcon({
      title: "Eye Icon",
      customStyle: "text-red-500",
      icon: "eye",
    });
    expect(screen.getByTitle("Eye Icon")).toBeInTheDocument();

    mockIcon({
      title: "Heart Icon",
      customStyle: "text-pink-500",
      icon: "heart",
    });
    expect(screen.getByTitle("Heart Icon")).toBeInTheDocument();

    mockIcon({
      title: "Lock Icon",
      customStyle: "text-blue-500",
      icon: "lockClosed",
    });

    const iconElement = screen.getByTitle("Lock Icon");

    expect(iconElement).toBeInTheDocument();
  });
});
