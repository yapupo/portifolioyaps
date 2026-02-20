import { motion } from "framer-motion";
import { ExternalLink, Code2, Database, Globe, Palette, Terminal, Cpu, Layers, Braces, FileCode } from "lucide-react";

const techIcons = [
  { icon: Code2, label: "HTML5", color: "text-orange-400" },
  { icon: Palette, label: "CSS3", color: "text-blue-400" },
  { icon: Braces, label: "JavaScript", color: "text-yellow-400" },
  { icon: Terminal, label: "Python", color: "text-green-400" },
  { icon: Database, label: "SQL", color: "text-neon-cyan" },
  { icon: Layers, label: "React", color: "text-neon-cyan" },
  { icon: Globe, label: "Web", color: "text-neon-purple" },
  { icon: Cpu, label: "Node.js", color: "text-green-500" },
  { icon: FileCode, label: "TypeScript", color: "text-blue-500" },
];

// Pick random 3-5 tech icons per card for visual variety
const getRandomTechs = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const count = 3 + (Math.abs(hash) % 3);
  const shuffled = [...techIcons].sort((a, b) => {
    const ha = a.label.charCodeAt(0) + hash;
    const hb = b.label.charCodeAt(0) + hash;
    return (ha % 7) - (hb % 7);
  });
  return shuffled.slice(0, count);
};

interface ProjectCardProps {
  name: string;
  description: string | null;
  link: string | null;
  image_url: string | null;
}

const ProjectCard = ({ name, description, link, image_url }: ProjectCardProps) => {
  const techs = getRandomTechs(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative glass-card-intense rounded-xl overflow-hidden transition-all duration-500 hover:neon-glow-mixed"
    >
      {/* Top neon line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent opacity-60 group-hover:opacity-100 group-hover:via-neon-cyan/60 transition-all duration-500" />

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-secondary/80 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <Code2 className="w-10 h-10 text-muted-foreground/40 icon-neon-purple" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Hover overlay glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/10 to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-5 relative">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-gradient transition-all duration-300 font-display tracking-wide">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techs.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0.7 }}
                whileHover={{ scale: 1.15, opacity: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/60 border border-border/40 group-hover:border-neon-purple/20 transition-all duration-300"
              >
                <Icon className={`w-3.5 h-3.5 ${tech.color} transition-all duration-300 group-hover:drop-shadow-[0_0_4px_currentColor]`} />
                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground/80 transition-colors uppercase tracking-wider">
                  {tech.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neon-cyan hover:text-neon-purple transition-colors duration-300 group/link"
          >
            <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5" />
            <span>Visitar Projeto</span>
          </a>
        )}
      </div>

      {/* Neon border glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-neon-purple/30" />

      {/* Bottom neon line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
    </motion.div>
  );
};

export default ProjectCard;
