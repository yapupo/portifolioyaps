import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, LogIn, LogOut, User, Save, Upload, X, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import type { Session } from "@supabase/supabase-js";
import { Checkbox } from "@/components/ui/checkbox";
import { PREDEFINED_TECHS } from "@/lib/technologies";
import EditProjectDialog from "@/components/EditProjectDialog";

const Admin = () => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Auth form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Project form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [deployUrl, setDeployUrl] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [customTech, setCustomTech] = useState("");

  const toggleTech = (label: string) => {
    setSelectedTechs((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };
  const addCustomTech = () => {
    const v = customTech.trim();
    if (!v) return;
    if (!selectedTechs.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setSelectedTechs((prev) => [...prev, v]);
    }
    setCustomTech("");
  };
  const removeTech = (label: string) => {
    setSelectedTechs((prev) => prev.filter((t) => t !== label));
  };

  // Profile form
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileGithub, setProfileGithub] = useState("");
  const [profileLinkedin, setProfileLinkedin] = useState("");
  const [profileWhatsapp, setProfileWhatsapp] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Arquivo inválido", description: "Envie uma imagem (PNG, JPG, etc).", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("project-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("project-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast({ title: "Imagem enviada!", description: "URL preenchida automaticamente." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha no upload";
      toast({ title: "Erro no upload", description: msg, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["site-profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_profile").select("*").limit(1).maybeSingle();
      if (error) throw error;
      if (data) {
        setProfileName(data.name || "");
        setProfileBio(data.bio || "");
        setProfilePhoto(data.photo_url || "");
        setProfileGithub(data.github_url || "");
        setProfileLinkedin(data.linkedin_url || "");
        setProfileWhatsapp(data.whatsapp || "");
      }
      return data;
    },
  });

  const addProject = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert({
        name,
        description,
        link,
        image_url: imageUrl,
        repo_url: repoUrl || null,
        deploy_url: deployUrl || null,
        technologies: selectedTechs,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setName(""); setDescription(""); setLink(""); setImageUrl(""); setRepoUrl(""); setDeployUrl(""); setSelectedTechs([]); setCustomTech("");
      toast({ title: "Projeto adicionado!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Projeto removido." });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!profile?.id) throw new Error("Perfil não encontrado");
      const { error } = await supabase.from("site_profile").update({
        name: profileName,
        bio: profileBio,
        photo_url: profilePhoto,
        github_url: profileGithub,
        linkedin_url: profileLinkedin,
        whatsapp: profileWhatsapp,
      }).eq("id", profile.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-profile"] });
      toast({ title: "Perfil atualizado!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
      toast({ title: "Conta criada! Verifique seu e-mail para confirmar." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return toast({ title: "Erro", description: error.message, variant: "destructive" });
      toast({ title: "Login realizado!" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado." });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-purple" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background bg-grid">
        <Navbar />
        <div className="pt-32 px-6 max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gradient mb-6 text-center">
              {isSignUp ? "Criar Conta" : "Login Admin"}
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50 border-border/50" />
              <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/50 border-border/50" />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground">
                <LogIn className="w-4 h-4 mr-2" />
                {isSignUp ? "Criar Conta" : "Entrar"}
              </Button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full mt-4 text-sm text-muted-foreground hover:text-neon-cyan transition-colors text-center"
            >
              {isSignUp ? "Já tem conta? Faça login" : "Não tem conta? Criar uma"}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Navbar />
      <div className="pt-32 px-6 max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gradient">
            Painel Admin
          </motion.h1>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-border/50 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-neon-purple" /> Meu Perfil
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border/50 bg-secondary/50 flex items-center justify-center">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <Input placeholder="Seu Nome" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="bg-secondary/50 border-border/50" />
              <Input placeholder="URL da Foto de Perfil" value={profilePhoto} onChange={(e) => setProfilePhoto(e.target.value)} className="bg-secondary/50 border-border/50" />
              <Textarea placeholder="Sua biografia..." value={profileBio} onChange={(e) => setProfileBio(e.target.value)} className="bg-secondary/50 border-border/50" rows={3} />
              <Input placeholder="GitHub URL (ex: https://github.com/user)" value={profileGithub} onChange={(e) => setProfileGithub(e.target.value)} className="bg-secondary/50 border-border/50" />
              <Input placeholder="LinkedIn URL (ex: https://linkedin.com/in/user)" value={profileLinkedin} onChange={(e) => setProfileLinkedin(e.target.value)} className="bg-secondary/50 border-border/50" />
              <Input placeholder="WhatsApp (ex: 5585992283391)" value={profileWhatsapp} onChange={(e) => setProfileWhatsapp(e.target.value)} className="bg-secondary/50 border-border/50" />
              <Button
                onClick={() => updateProfile.mutate()}
                disabled={updateProfile.isPending}
                className="bg-neon-purple/20 border border-neon-purple/40 text-foreground hover:bg-neon-purple/30"
              >
                {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Perfil
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Add Project Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-neon-cyan" /> Adicionar Projeto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Nome do Projeto" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-border/50" />
            <Input placeholder="Link do Site" value={link} onChange={(e) => setLink(e.target.value)} className="bg-secondary/50 border-border/50" />
            <Input placeholder="URL do Repositório (GitHub)" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="bg-secondary/50 border-border/50" />
            <Input placeholder="URL do Deploy (Site Vivo)" value={deployUrl} onChange={(e) => setDeployUrl(e.target.value)} className="bg-secondary/50 border-border/50" />
            <div className="md:col-span-2 space-y-2">
              <Input placeholder="URL da Imagem de Capa (ou faça upload abaixo)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="bg-secondary/50 border-border/50" />
              <div className="flex items-center gap-3">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-dashed border-neon-cyan/40 bg-secondary/30 text-sm text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/70 transition-colors cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Enviando..." : "Upload de imagem (PNG, JPG, WEBP — máx. 5MB)"}
                  </div>
                </label>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-md object-cover border border-border/50" />
                )}
              </div>
            </div>
            <Textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-secondary/50 border-border/50 md:col-span-2" rows={3} />

            {/* Technologies */}
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm font-semibold text-foreground/90 font-display tracking-wide">Tecnologias usadas</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-background/40 border border-border/30">
                {PREDEFINED_TECHS.map((t) => {
                  const checked = selectedTechs.some((s) => s.toLowerCase() === t.label.toLowerCase());
                  const Icon = t.icon;
                  return (
                    <label key={t.label} className="flex items-center gap-2 cursor-pointer group">
                      <Checkbox checked={checked} onCheckedChange={() => toggleTech(t.label)} />
                      <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{t.label}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Adicionar tecnologia personalizada (ex: Rust)"
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomTech(); } }}
                  className="bg-secondary/50 border-border/50"
                />
                <Button type="button" onClick={addCustomTech} variant="outline" className="border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {selectedTechs.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedTechs.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-xs text-foreground">
                      {t}
                      <button type="button" onClick={() => removeTech(t)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={() => addProject.mutate()}
            disabled={!name || addProject.isPending}
            className="mt-4 bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            {addProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Adicionar
          </Button>
        </motion.div>

        {/* Project List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Projetos Existentes</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-neon-purple" />
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="glass-card rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => setEditingProjectId(p.id)}
                      className="text-muted-foreground hover:text-neon-cyan"
                      aria-label="Editar projeto"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => deleteProject.mutate(p.id)}
                      className="text-destructive hover:text-destructive/80"
                      aria-label="Excluir projeto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum projeto ainda.</p>
          )}
        </motion.div>
      </div>

      {(() => {
        const editing = projects?.find((p) => p.id === editingProjectId);
        if (!editing) return null;
        return (
          <EditProjectDialog
            project={editing}
            open={!!editingProjectId}
            onOpenChange={(o) => !o && setEditingProjectId(null)}
          />
        );
      })()}
    </div>
  );
};

export default Admin;
