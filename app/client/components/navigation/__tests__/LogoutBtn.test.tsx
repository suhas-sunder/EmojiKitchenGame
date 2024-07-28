import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import LogoutBtn from "../LogoutBtn";

interface PropType {
  customStyle: string;
}

const MockLoginLinks = ({ customStyle }: PropType) => {
  render(
    <MemoryRouter>
      <LogoutBtn iconStyle="" customStyle={customStyle} />
    </MemoryRouter>,
  );
};

const customStyle = "";

beforeEach(() => {
  MockLoginLinks({ customStyle });
  // Mock localStorage
  Object.defineProperty(window, "localStorage", {
    value: {
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("renders all elements", () => {
  it("should render a button with appropriate text", () => {
    const btnElement = screen.getByRole("button", {
      name: /logout/i,
    });
    expect(btnElement).toBeInTheDocument();
  });

  it("should render an icon for the button", async () => {
    const iconElement = await screen.findByTitle(/icon/i);
    expect(iconElement).toBeInTheDocument();
  });
});

describe("handles user events correctly", () => {
  it("should trigger handleLogout function when clicked", () => {
    const buttonElement = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(buttonElement);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith("jwt_token"); // assuming 'jwt_token' is the item being removed
  });
});
