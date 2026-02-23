import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import Navbar from "@/components/Navbar";
import FloatingElements from "@/components/FloatingElements";
import { Loader2, Sparkles, FolderOpen, Brush, Mic } from "lucide-react";

const Index = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["site-profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_profile")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-deep-radial relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <FloatingElements />
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Profile Photo */}
          {profile?.photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <img
                  src={profile.photo_url}
                  alt={profile.name || "Foto"}
                  className="w-32 h-32 rounded-full object-cover border-2 border-neon-purple/30"
                />
                <div className="absolute inset-0 rounded-full neon-glow-purple opacity-40" />
                <div className="absolute -inset-1 rounded-full border border-neon-cyan/10 animate-glow-pulse" />
              </div>
            </motion.div>
          )}

          {/* Name */}
          {profile?.name && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs font-mono uppercase tracking-[0.4em] text-neon-cyan mb-6 icon-neon-cyan"
            >
              {profile.name}
            </motion.p>
          )}

          {/* Main Title with decorative neon icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-center gap-5 mb-6"
          >
            <FolderOpen className="w-10 h-10 text-neon-purple icon-neon-purple hidden md:block" />
            <Brush className="w-8 h-8 text-neon-cyan icon-neon-cyan hidden lg:block" />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight font-display">
              <span className="text-gradient">Meus Projetos</span>
            </h1>
            <Mic className="w-8 h-8 text-neon-pink icon-neon-pink hidden lg:block" />
            <Sparkles className="w-10 h-10 text-neon-cyan icon-neon-cyan hidden md:block" />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {profile?.bio || "Uma coleção dos meus trabalhos mais recentes em desenvolvimento web e design."}
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-center gap-4 md:gap-6 text-sm"
          >
            <div className="glass-card-intense rounded-full px-5 py-2.5 flex items-center gap-2.5 hover:neon-glow-purple transition-shadow duration-300">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-glow-pulse" />
              <span className="text-muted-foreground font-mono text-xs tracking-wide">Disponível para projetos</span>
            </div>
            <div className="glass-card-intense rounded-full px-5 py-2.5 hidden md:flex items-center gap-2.5 hover:neon-glow-cyan transition-shadow duration-300">
              <span className="text-neon-cyan font-bold font-display">{projects?.length || 0}</span>
              <span className="text-muted-foreground font-mono text-xs tracking-wide">projetos</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-24 pt-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="h-[2px] w-16 bg-gradient-to-r from-neon-purple via-neon-cyan to-transparent rounded-full" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
              Trabalhos Recentes
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="relative">
                <Loader2 className="w-10 h-10 animate-spin text-neon-purple icon-neon-purple" />
                <div className="absolute inset-0 neon-glow-purple rounded-full opacity-30" />
              </div>
            </div>
          ) : projects && projects.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-24">
              <div className="glass-card-intense rounded-xl p-10 max-w-md mx-auto">
                <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4 icon-neon-purple" />
                <p className="text-muted-foreground font-mono text-sm">
                  Nenhum projeto encontrado. Adicione pelo painel Admin.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/20 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon-purple/30" />
            <a 
              href="https://wa.me/5585992283391" 
              target="_blank" 
              rel="noopener noreferrer"
              className="botao-zap"
            >
              Falar no Zap
            </a>
          <p className="text-xs text-muted-foreground font-mono tracking-wider">
            © {new Date().getFullYear()} {profile?.name || "Portfólio"} — Feito com 💜
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-neon-cyan/30" />
        </div>
      </footer>
    </div>
  );
};

export default Index;
