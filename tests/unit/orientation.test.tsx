import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import Overlay from "@/components/Overlay";

const css = readFileSync("src/app/globals.css", "utf8");

describe("orientation + no-scroll contract", () => {
  it("renders a rotate-to-landscape prompt", () => {
    render(<Overlay />);
    expect(screen.getByText(/rotate your device to landscape/i)).toBeInTheDocument();
  });
  it("shows the prompt only in portrait", () => {
    expect(css).toMatch(/@media\s*\(orientation:\s*portrait\)[^{]*\{[^}]*\.rotate[^}]*display:\s*flex/s);
  });
  it("homescreen is viewport-fitted: 100dvh, overflow hidden, never 100vh (Safari bug)", () => {
    expect(css).toMatch(/100dvh/);
    expect(css).toMatch(/overflow:\s*hidden/);
    expect(css).not.toMatch(/100vh/);
  });
  it("respects reduced motion and safe-area insets", () => {
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
    expect(css).toMatch(/safe-area-inset/);
  });
});
