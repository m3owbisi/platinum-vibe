"use client";
import { useSyncExternalStore } from "react";

type FsDoc = Document & { webkitFullscreenEnabled?: boolean; webkitFullscreenElement?: Element; webkitExitFullscreen?: () => void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => void };

const noop = () => () => {};
const subscribe = (cb: () => void) => {
  document.addEventListener("fullscreenchange", cb);
  document.addEventListener("webkitfullscreenchange", cb);
  return () => { document.removeEventListener("fullscreenchange", cb); document.removeEventListener("webkitfullscreenchange", cb); };
};

export default function FullscreenButton() {
  // Feature detect (false on iPhone), not UA sniffing. Server snapshot is false so SSR never renders the button.
  const supported = useSyncExternalStore(noop, () => { const d = document as FsDoc; return Boolean(d.fullscreenEnabled || d.webkitFullscreenEnabled); }, () => false);
  const active = useSyncExternalStore(subscribe, () => { const d = document as FsDoc; return Boolean(d.fullscreenElement || d.webkitFullscreenElement); }, () => false);

  if (!supported) return null;

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const d = document as FsDoc;
    const el = document.documentElement as FsEl;
    if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen ?? d.webkitExitFullscreen)?.call(d); return; }
    const req = el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.();
    // Orientation lock only works after fullscreen and not everywhere; never relied on.
    Promise.resolve(req).then(() => screen.orientation?.lock?.("landscape")).catch(() => {});
  };

  return (
    <button type="button" className="ctl" aria-label={active ? "Exit fullscreen" : "Enter fullscreen"} onClick={toggle}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={active ? "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" : "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"} />
      </svg>
    </button>
  );
}
