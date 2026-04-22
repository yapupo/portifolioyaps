import { Code2, Database, Globe, Palette, Terminal, Cpu, Layers, Braces, FileCode, type LucideIcon } from "lucide-react";

export interface TechDef {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const PREDEFINED_TECHS: TechDef[] = [
  { label: "HTML5", icon: Code2, color: "text-orange-400" },
  { label: "CSS3", icon: Palette, color: "text-blue-400" },
  { label: "JavaScript", icon: Braces, color: "text-yellow-400" },
  { label: "TypeScript", icon: FileCode, color: "text-blue-500" },
  { label: "Python", icon: Terminal, color: "text-green-400" },
  { label: "SQL", icon: Database, color: "text-neon-cyan" },
  { label: "React", icon: Layers, color: "text-neon-cyan" },
  { label: "Node.js", icon: Cpu, color: "text-green-500" },
  { label: "Web", icon: Globe, color: "text-neon-purple" },
];

export const getTechDef = (label: string): TechDef => {
  const found = PREDEFINED_TECHS.find((t) => t.label.toLowerCase() === label.toLowerCase());
  if (found) return found;
  // Custom tech fallback — neutral neon styling
  return { label, icon: Code2, color: "text-neon-purple" };
};
