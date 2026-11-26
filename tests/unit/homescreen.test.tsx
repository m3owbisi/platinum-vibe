import { render, screen, within } from "@testing-library/react";
import HeroSection from "@/components/HeroSection";
import project from "@/data/project.json";

const ORDER = ["Show Flat", "Aerial View", "Amenities", "Connectivity", "Renders", "Presentation", "3D Elevation", "Plans"];

describe("homescreen", () => {
  it("renders the 8 Figma cards from project.json, in Figma order", () => {
    render(<HeroSection />);
    const nav = screen.getByRole("navigation", { name: /tour sections/i });
    const titles = within(nav).getAllByRole("link").map((a) => within(a).getByRole("heading").textContent);
    expect(titles).toEqual(ORDER);
    expect(project.cards.map((c) => c.title)).toEqual(ORDER);
  });

  it("uses the corrected subtitle spelling and Figma's aerial subtitle", () => {
    render(<HeroSection />);
    expect(screen.getAllByText("Walkthrough each space")).toHaveLength(7);
    expect(screen.getByText("View from Top")).toBeInTheDocument();
    expect(screen.queryByText(/walkthough/i)).toBeNull();
  });

  it("shows project + developer logos and the TVRC credit as a safe external link", () => {
    render(<HeroSection />);
    expect(screen.getByAltText(/platinum vibe/i)).toBeInTheDocument();
    expect(screen.getByAltText(/platinum corp/i)).toBeInTheDocument();
    const credit = screen.getByRole("link", { name: /the vr company/i });
    expect(credit).toHaveAttribute("href", "https://thevrcompany.in");
    expect(credit).toHaveAttribute("target", "_blank");
    expect(credit).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has no form and every button is type=button (nothing can reload the page)", () => {
    const { container } = render(<HeroSection />);
    expect(container.querySelector("form")).toBeNull();
    container.querySelectorAll("button").forEach((b) => expect(b).toHaveAttribute("type", "button"));
  });
});
