import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Code2, ChevronLeft, ChevronRight, Github, Rocket } from "lucide-react";
import { getTechDef, PREDEFINED_TECHS } from "@/lib/technologies";

const getRandomTechs = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const count = 3 + (Math.abs(hash) % 3);
  const shuffled = [...PREDEFINED_TECHS].sort((a, b) => {
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
  repo_url?: string | null;
  deploy_url?: string | null;
  technologies?: string[] | null;
}

const ProjectCard = ({ name, description, link, image_url, repo_url, deploy_url, technologies }: ProjectCardProps) => {
  const techs = technologies && technologies.length > 0
    ? technologies.map(getTechDef)
    : getRandomTechs(name);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  const hasAnyLink = link || repo_url || deploy_url;

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

        {/* Tech Dock */}
        <div className="rounded-lg bg-background/60 border border-border/30 p-2 mb-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] relative flex items-center gap-1">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-secondary/60 text-muted-foreground hover:text-neon-cyan hover:drop-shadow-[0_0_6px_hsl(var(--neon-cyan)/0.6)] transition-all duration-300"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none"
          >
            {techs.map((tech) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0.8 }}
                  whileHover={{ scale: 1.12, opacity: 1 }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/70 border border-border/30 group-hover:border-neon-purple/25 transition-all duration-300 shrink-0"
                >
                  <Icon className={`w-3.5 h-3.5 ${tech.color} transition-all duration-300 group-hover:drop-shadow-[0_0_5px_currentColor]`} />
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground/80 transition-colors uppercase tracking-wider">
                    {tech.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-secondary/60 text-muted-foreground hover:text-neon-cyan hover:drop-shadow-[0_0_6px_hsl(var(--neon-cyan)/0.6)] transition-all duration-300"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Links */}
        {hasAnyLink && (
          <div className="flex items-center gap-3 flex-wrap">
            {repo_url && (
              <a
                href={repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border/40 bg-secondary/50 text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/40 transition-all duration-300"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Repositório</span>
              </a>
            )}
            {(deploy_url || link) && (
              <a
                href={deploy_url || link!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neon-purple/30 bg-neon-purple/10 text-neon-cyan hover:text-neon-purple hover:border-neon-purple/50 transition-all duration-300"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Site Vivo</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Neon border glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-neon-purple/30" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
    </motion.div>
  );
};

export default ProjectCard;
