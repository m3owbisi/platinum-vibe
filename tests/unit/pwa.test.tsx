import { existsSync, readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import manifest from "@/app/manifest";
import PwaRegister from "@/components/PwaRegister";

describe("manifest", () => {
  const m = manifest();
  it("is a fullscreen landscape installable app", () => {
    expect(m).toMatchObject({ name: "Platinum VIBE", start_url: "/", scope: "/", display: "fullscreen", orientation: "landscape" });
    expect(m.display_override).toEqual(["fullscreen", "standalone"]);
    expect(m.theme_color).toBeTruthy();
    expect(m.background_color).toBeTruthy();
  });
  it("has 192, 512 and maskable 512 PNG icons that exist", () => {
    const sizes = m.icons!.map((i) => `${i.sizes}:${i.purpose ?? "any"}`);
    expect(sizes).toEqual(expect.arrayContaining(["192x192:any", "512x512:any", "512x512:maskable"]));
    m.icons!.forEach((i) => expect(existsSync("public" + i.src)).toBe(true));
    expect(existsSync("public/icons/apple-touch-icon.png")).toBe(true);
  });
});

describe("service worker", () => {
  const register = vi.fn().mockResolvedValue({});
  beforeEach(() => { register.mockClear(); Object.defineProperty(navigator, "serviceWorker", { value: { register }, configurable: true }); });
  afterEach(() => vi.unstubAllEnvs());

  it("registers in production only", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(<PwaRegister />);
    expect(register).not.toHaveBeenCalled();
    vi.stubEnv("NODE_ENV", "production");
    render(<PwaRegister />);
    expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/" });
  });
  it("sw.js never skips waiting, has offline fallback, never caches non-GET", () => {
    const sw = readFileSync("public/sw.js", "utf8");
    expect(sw).not.toMatch(/skipWaiting|clients\.claim/);
    expect(sw).toMatch(/\/offline/);
    expect(sw).toMatch(/request\.method\s*!==\s*"GET"/);
    expect(existsSync("src/app/offline/page.tsx")).toBe(true);
  });
});
