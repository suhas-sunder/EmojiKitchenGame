import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import Footer from "../Footer";
import mockAllAPI from "../../../../mocks/api/mockAllAPI";

mockAllAPI(); //Mocks all api with no custom mock response
interface PropType {
  isAuthenticated: boolean;
}

const MockFooter = ({ isAuthenticated }: PropType) => {
  render(
    <MemoryRouter>
      <Footer isAuthenticated={isAuthenticated} />
    </MemoryRouter>,
  );
};

describe("renders links when not authenticated", () => {
  it("should render at least one complete logo", async () => {
    MockFooter({ isAuthenticated: false });
    const svgElements = await screen.findByTestId(/logo-name/i);
    const svgElement2 = await screen.findByTestId(/logo-com/i);
    expect(svgElements).toBeInTheDocument();
    expect(svgElement2).toBeInTheDocument();
  });

  it("should render 10 links that link to relevant page when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElements = screen.getAllByRole("link");
    expect(linkElements).toHaveLength(10);
  });

  it("should render footer text when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const textElement = screen.getByText(/FreeTypingCamp - All Rights/i);
    expect(textElement).toBeInTheDocument();
  });

  it("should render typing test navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /typing test/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/");
  });

  it("should render lessons navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /lessons/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/lessons");
  });

  it("should render games navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /games/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/games");
  });

  it("should render learn navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /learn/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/learn");
  });

  it("should not render profile navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.queryByRole("link", { name: /profile/i });
    expect(linkElement).not.toBeInTheDocument();
  });

  it("should not render profile stats navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.queryByRole("link", { name: /stats/i });
    expect(linkElement).not.toBeInTheDocument();
  });

  it("should not render profile image navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.queryByRole("link", { name: /images/i });
    expect(linkElement).not.toBeInTheDocument();
  });

  it("should not render profile theme navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.queryByRole("link", { name: /theme/i });
    expect(linkElement).not.toBeInTheDocument();
  });

  it("should not render profile account navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.queryByRole("link", { name: /account/i });
    expect(linkElement).not.toBeInTheDocument();
  });

  it("should render sitemap navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /sitemap/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/sitemap");
  });

  it("should render tos navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /terms of service/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/termsofservice");
  });

  it("should render privacy policy navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /privacy policy/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/privacypolicy");
  });

  it("should render cookie policy navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /cookie/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/cookiespolicy");
  });

  it("should render login navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /login/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/login");
  });

  it("should render register navigation link(s) correctly when not authenticated", () => {
    MockFooter({ isAuthenticated: false });
    const linkElement = screen.getByRole("link", { name: /register/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/register");
  });

  it("should not render logout navigation button correctly when not authenticated", async () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = await screen.queryByRole("button", { name: /logout/i });
    expect(linkElement).not.toBeInTheDocument();
  });
});

describe("renders links when is authenticated", () => {
  it("should render at least one complete logo", async () => {
    MockFooter({ isAuthenticated: true });
    const svgElements = await screen.findByTestId(/logo-name/i);
    const svgElement2 = await screen.findByTestId(/logo-com/i);
    expect(svgElements).toBeInTheDocument();
    expect(svgElement2).toBeInTheDocument();
  });

  it("should render 13 links that link to relevant page when not authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElements = screen.getAllByRole("link");
    expect(linkElements).toHaveLength(13);
  });

  it("should render footer text when not authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const textElement = screen.getByText(/FreeTypingCamp - All Rights/i);
    expect(textElement).toBeInTheDocument();
  });
  it("should render typing test navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /typing test/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/");
  });

  it("should render lessons navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /lessons/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/lessons");
  });

  it("should render games navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /games/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/games");
  });

  it("should render learn navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /learn/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/learn");
  });

  it("should render profile navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /profile/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/profile/summary");
  });

  it("should render profile stats navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /stats/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/profile/stats");
  });

  it("should render profile image navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /image/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/profile/img");
  });

  it("should render profile theme navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /theme/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/profile/themes");
  });

  it("should render profile account navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /account/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/profile/account");
  });

  it("should render tos navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /terms of service/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/termsofservice");
  });

  it("should render privacy policy navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /privacy policy/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/privacypolicy");
  });

  it("should render cookie policy navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.getByRole("link", { name: /cookie/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/cookiespolicy");
  });
  it("should render logout navigation button correctly when authenticated", async () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = await screen.findByRole("button", { name: /logout/i });
    expect(linkElement).toBeInTheDocument();
  });

  it("should not render login navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.queryByRole("link", { name: /login/i });
    expect(linkElement).not.toBeInTheDocument();
  });
  it("should not render register navigation link(s) correctly when authenticated", () => {
    MockFooter({ isAuthenticated: true });
    const linkElement = screen.queryByRole("link", { name: /register/i });
    expect(linkElement).not.toBeInTheDocument();
  });
});
