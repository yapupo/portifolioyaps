import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import Navbar from "@/components/Navbar";
import FloatingElements from "@/components/FloatingElements";
import { Loader2, Code2, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-background bg-grid relative">
      <FloatingElements />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Profile Photo */}
          {profile?.photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <img
                  src={profile.photo_url}
                  alt={profile.name || "Foto"}
                  className="w-28 h-28 rounded-full object-cover border-2 border-neon-purple/40"
                />
                <div className="absolute inset-0 rounded-full neon-glow-purple opacity-50" />
              </div>
            </motion.div>
          )}

          {/* Name */}
          {profile?.name && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-mono uppercase tracking-[0.3em] text-neon-cyan mb-4"
            >
              {profile.name}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 flex items-center justify-center gap-4"
          >
            <Sparkles className="w-10 h-10 text-neon-purple hidden md:block" />
            Meus{" "}
            <span className="text-gradient">Projetos</span>
            <Code2 className="w-10 h-10 text-neon-cyan hidden md:block" />
          </motion.h1>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {profile?.bio || "Uma coleção dos meus trabalhos mais recentes em desenvolvimento web e design."}
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-8 text-sm"
          >
            <div className="glass-card rounded-full px-5 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-muted-foreground">Disponível para projetos</span>
            </div>
            <div className="glass-card rounded-full px-5 py-2 hidden md:flex items-center gap-2">
              <span className="text-neon-purple font-bold">{projects?.length || 0}</span>
              <span className="text-muted-foreground">projetos</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-20 pt-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-neon-purple to-transparent" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Trabalhos Recentes</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
            </div>
          ) : projects && projects.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Nenhum projeto encontrado. Adicione pelo painel Admin.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profile?.name || "Portfólio"}. Feito com 💜
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
