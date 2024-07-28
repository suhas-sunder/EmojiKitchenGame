import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import Logo from "../Logo";

interface PropTypes {
  setShowMobileMenu: (value: boolean) => void;
}

const MockLoginLinks = ({ setShowMobileMenu }: PropTypes) => {
  render(
    <MemoryRouter>
      <Logo setShowMobileMenu={setShowMobileMenu} />
    </MemoryRouter>,
  );
};

const setShowMobileMenu = vi.fn();

beforeEach(() => {
  MockLoginLinks({ setShowMobileMenu });
});

describe("renders all elements", () => {
  it("should render a login link", () => {
    const linkElement = screen.getByRole("link", {
      name: /.com/i,
    });
    expect(linkElement).toBeInTheDocument();
  });
});

describe("renders elements with correct attributes", () => {
  it("should render a logo link to home page", () => {
    const linkElement = screen.getByRole("link", {
      name: /.com/i,
    });
    expect(linkElement).toHaveAttribute("href", "/");
  });
});

describe("user event", () => {
  it("should close mobile menu when logo is clicked", () => {
    const linkElement = screen.getByRole("link", {
      name: /.com/i,
    });

    fireEvent.click(linkElement);
    expect(setShowMobileMenu).toBeCalled();
  });

  it("should call setShowMobileMenu with false on click", () => {
    const linkElement = screen.getByTestId("logo-naviation-link");
    fireEvent.click(linkElement);
    expect(setShowMobileMenu).toHaveBeenCalledWith(false);
  });

  it("should navigate to home page on click", () => {
    const linkElement = screen.getByTestId("logo-naviation-link");
    expect(linkElement).toHaveAttribute("href", "/");
  });
});
