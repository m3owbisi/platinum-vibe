import Image from "next/image";
import { useProject } from "@/hooks/useProject";

export default function TvrcCredit() {
  const { credit } = useProject();
  return (
    <footer className="credit reveal">
      <a href={credit.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${credit.label} website (opens in a new tab)`} title={`Visit ${credit.label}`}>
        <Image src={credit.mark} alt="" width={271} height={143} />
        <span aria-hidden="true">{credit.label}</span>
      </a>
    </footer>
  );
}
