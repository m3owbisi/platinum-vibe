"use client";
import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProject } from "@/hooks/useProject";
import Navbar from "./Navbar";
import TvrcCredit from "./TvrcCredit";

export default function HeroSection() {
  const project = useProject();
  const [phase, setPhase] = useState<"splash" | "home">("splash");

  useEffect(() => {
    const t = setTimeout(() => setPhase("home"), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="viewport" data-phase={phase}>
      <div className="bg" style={{ backgroundImage: `url(${project.background})` }} />
      <div className="stage">
        <div className="canvas">
          <h1 className="sr-only">{project.name}, {project.tagline}</h1>
          <Navbar />
          <main>
            <nav className="bento" aria-label="Tour sections">
              {project.cards.map((c, i) => (
                <Link key={c.id} href={c.href} prefetch={false} className="card reveal" data-id={c.id} style={{ "--d": `${i * 0.07}s` } as CSSProperties}>
                  <Image src={c.image} alt="" fill sizes="50vw" loading="eager" />
                  <div className="card__label">
                    <h2>{c.title}</h2>
                    <p>{c.subtitle}</p>
                    <span className="card__bar" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </nav>
          </main>
          <TvrcCredit />
        </div>
      </div>
    </div>
  );
}
