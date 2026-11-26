import Image from "next/image";
import { useProject } from "@/hooks/useProject";
import FullscreenButton from "./FullscreenButton";
import InstallButton from "./InstallButton";

export default function Navbar() {
  const { logos } = useProject();
  return (
    <header className="navbar">
      <Image className="logo-brand" src={logos.project.src} alt={logos.project.alt} width={logos.project.width} height={logos.project.height} priority />
      <Image className="logo-dev reveal" src={logos.developer.src} alt={logos.developer.alt} width={logos.developer.width} height={logos.developer.height} />
      <div className="controls reveal"><InstallButton /><FullscreenButton /></div>
    </header>
  );
}
