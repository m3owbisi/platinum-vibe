import Image from "next/image";
import { useProject } from "@/hooks/useProject";

// Logo cut into parts (positions in % of the 681x456 logo frame) so the intro can animate them one by one.
const LETTERS = [
  { n: "v", w: 194, left: 0.235, width: 28.521 },
  { n: "i", w: 46, left: 32.277, width: 6.808 },
  { n: "b", w: 181, left: 45.423, width: 26.643 },
  { n: "e", w: 168, left: 75.352, width: 24.648 },
];

export default function Navbar() {
  const { logos } = useProject();
  return (
    <header className="navbar">
      <div className="logo-brand">
        <Image className="lp-word" src="/images/logo-part-platinum.webp" alt={logos.project.alt} width={681} height={78} style={{ left: 0, top: 0, width: "100%", height: "auto" }} priority />
        {LETTERS.map((l, k) => (
          <Image key={l.n} className="lp-letter" src={`/images/logo-part-${l.n}.webp`} alt="" width={l.w} height={221} style={{ left: `${l.left}%`, top: "22.067%", width: `${l.width}%`, height: "auto", "--k": k } as React.CSSProperties} priority />
        ))}
        <Image className="lp-tag" src="/images/logo-part-tagline.webp" alt="" width={681} height={54} style={{ left: 0, top: "88.091%", width: "100%", height: "auto" }} priority />
        <span className="lp-shine" aria-hidden="true" />
      </div>
      <Image className="logo-dev reveal" src={logos.developer.src} alt={logos.developer.alt} width={logos.developer.width} height={logos.developer.height} />
    </header>
  );
}
