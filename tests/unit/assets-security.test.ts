import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import project from "@/data/project.json";
import config from "../../next.config";

const walk = (d: string): string[] =>
  readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));

describe("assets", () => {
  it("has no jpg/jpeg/png outside public/icons (PWA icons are the only PNG exception)", () => {
    const bad = walk("public").filter((f) => /\.(jpe?g|png)$/i.test(f) && !f.startsWith(join("public", "icons")));
    expect(bad).toEqual([]);
  });
  it("every image referenced by project.json is a local .webp that exists", () => {
    const imgs = [project.logos.project.src, project.logos.developer.src, project.background, ...project.cards.map((c) => c.image)];
    imgs.forEach((p) => { expect(p).toMatch(/^\/images\/.+\.webp$/); expect(existsSync("public" + p)).toBe(true); });
  });
  it("TVRC link comes from project.json, not hardcoded", () => {
    expect(project.credit.href).toBe("https://thevrcompany.in");
  });
});

describe("security config", () => {
  it("disables source maps and sets hardening headers incl. worker/manifest CSP", async () => {
    expect(config.productionBrowserSourceMaps).toBe(false);
    const rules = await config.headers!();
    const h = Object.fromEntries(rules[0].headers.map((x) => [x.key, x.value]));
    expect(h["X-Frame-Options"]).toBe("DENY");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["Referrer-Policy"]).toBeTruthy();
    expect(h["Content-Security-Policy"]).toMatch(/worker-src 'self'/);
    expect(h["Content-Security-Policy"]).toMatch(/manifest-src 'self'/);
  });
  it("dev script is bound to localhost only", async () => {
    const pkg = (await import("../../package.json")).default;
    expect(pkg.scripts.dev).toContain("-H 127.0.0.1");
  });
});
