import type { Metadata, Viewport } from "next";
import "@fontsource/roboto-condensed/latin-400.css";
import "@fontsource/roboto-condensed/latin-600.css";
import "./globals.css";
import Overlay from "@/components/Overlay";
import PwaRegister from "@/components/PwaRegister";
import DevtoolsDeterrent from "@/components/DevtoolsDeterrent";
import IosHint from "@/components/IosHint";

export const metadata: Metadata = {
  title: "Platinum VIBE · Model Town, Versova",
  description: "Platinum VIBE, Model Town, Versova: virtual tour",
  applicationName: "Platinum VIBE",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Platinum VIBE" },
  icons: { apple: "/icons/apple-touch-icon.png" },
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Overlay />
        <IosHint />
        <PwaRegister />
        <DevtoolsDeterrent />
      </body>
    </html>
  );
}
