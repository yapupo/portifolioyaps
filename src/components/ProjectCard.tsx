import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string | null;
  link: string | null;
  image_url: string | null;
}

const ProjectCard = ({ name, description, link, image_url }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative glass-card rounded-xl overflow-hidden hover:neon-glow-purple transition-shadow duration-500"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Sem imagem</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-gradient transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-neon-cyan hover:text-neon-purple transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Visitar site
          </a>
        )}
      </div>

      {/* Neon border glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none neon-border-purple" />
    </motion.div>
  );
};

export default ProjectCard;
