import { render, screen, fireEvent } from "@testing-library/react";
import FullscreenButton from "@/components/FullscreenButton";

const setSupport = (v: boolean | undefined) =>
  Object.defineProperty(document, "fullscreenEnabled", { value: v, configurable: true });

describe("fullscreen button", () => {
  afterEach(() => setSupport(undefined));

  it("is not rendered when the Fullscreen API is unsupported (iPhone)", () => {
    setSupport(false);
    render(<FullscreenButton />);
    expect(screen.queryByRole("button", { name: /fullscreen/i })).toBeNull();
  });

  it("is rendered when supported, enters fullscreen and does nothing else", () => {
    setSupport(true);
    const req = vi.fn().mockResolvedValue(undefined);
    document.documentElement.requestFullscreen = req;
    render(<FullscreenButton />);
    const btn = screen.getByRole("button", { name: /enter fullscreen/i });
    expect(btn).toHaveAttribute("type", "button");
    const notPrevented = fireEvent.click(btn);
    expect(req).toHaveBeenCalledOnce();
    expect(notPrevented).toBe(false); // default prevented, so no reload/navigation
  });
});
