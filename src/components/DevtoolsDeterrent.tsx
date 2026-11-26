"use client";
import { useEffect } from "react";

// Deterrent only. Client code can never be hidden; do not rely on this to protect anything.
export default function DevtoolsDeterrent() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const noMenu = (e: Event) => e.preventDefault();
    const noKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      if (k === "f12" || (mod && e.shiftKey && "ijc".includes(k)) || (mod && e.altKey && "iju".includes(k)) || (mod && k === "u")) e.preventDefault();
    };
    document.addEventListener("contextmenu", noMenu);
    document.addEventListener("keydown", noKeys);
    return () => { document.removeEventListener("contextmenu", noMenu); document.removeEventListener("keydown", noKeys); };
  }, []);
  return null;
}
