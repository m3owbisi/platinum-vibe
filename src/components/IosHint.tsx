"use client";
import { useState, useSyncExternalStore } from "react";

const KEY = "pv-ios-hint";

// iOS has no install prompt and no fullscreen API; an installed PWA is the substitute. UA sniff is unavoidable here.
const noop = () => () => {};
const shouldShow = () => {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const standalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  let seen = false;
  try { seen = localStorage.getItem(KEY) === "1"; } catch {}
  return ios && !standalone && !seen;
};

export default function IosHint() {
  const eligible = useSyncExternalStore(noop, shouldShow, () => false);
  const [dismissed, setDismissed] = useState(false);
  const show = eligible && !dismissed;

  if (!show) return null;
  const close = () => { try { localStorage.setItem(KEY, "1"); } catch {} setDismissed(true); };
  return (
    <div className="hint" role="status">
      <span>To install: tap Share, then Add to Home Screen</span>
      <button type="button" onClick={close} aria-label="Dismiss hint">×</button>
    </div>
  );
}
