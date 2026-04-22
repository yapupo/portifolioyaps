import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, Plus, X, Pencil } from "lucide-react";
import { PREDEFINED_TECHS } from "@/lib/technologies";

interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  link: string | null;
  image_url: string | null;
  repo_url: string | null;
  deploy_url: string | null;
  technologies: string[] | null;
}

interface Props {
  project: ProjectRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProjectDialog = ({ project, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [link, setLink] = useState(project.link ?? "");
  const [imageUrl, setImageUrl] = useState(project.image_url ?? "");
  const [repoUrl, setRepoUrl] = useState(project.repo_url ?? "");
  const [deployUrl, setDeployUrl] = useState(project.deploy_url ?? "");
  const [selectedTechs, setSelectedTechs] = useState<string[]>(project.technologies ?? []);
  const [customTech, setCustomTech] = useState("");
  const [uploading, setUploading] = useState(false);

  // Reset form whenever a different project is opened
  useEffect(() => {
    if (open) {
      setName(project.name);
      setDescription(project.description ?? "");
      setLink(project.link ?? "");
      setImageUrl(project.image_url ?? "");
      setRepoUrl(project.repo_url ?? "");
      setDeployUrl(project.deploy_url ?? "");
      setSelectedTechs(project.technologies ?? []);
      setCustomTech("");
    }
  }, [open, project]);

  const toggleTech = (label: string) => {
    setSelectedTechs((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
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
      toast({ title: "Imagem enviada!", description: "URL atualizada." });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha no upload";
      toast({ title: "Erro no upload", description: msg, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const updateProject = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("projects")
        .update({
          name,
          description,
          link: link || null,
          image_url: imageUrl || null,
          repo_url: repoUrl || null,
          deploy_url: deployUrl || null,
          technologies: selectedTechs,
        })
        .eq("id", project.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: "Projeto atualizado!" });
      onOpenChange(false);
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient font-display">
            <Pencil className="w-5 h-5 text-neon-cyan" /> Editar Projeto
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <Input placeholder="Nome do Projeto" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-border/50" />
          <Input placeholder="Link do Site" value={link} onChange={(e) => setLink(e.target.value)} className="bg-secondary/50 border-border/50" />
          <Input placeholder="URL do Repositório (GitHub)" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="bg-secondary/50 border-border/50" />
          <Input placeholder="URL do Deploy (Site Vivo)" value={deployUrl} onChange={(e) => setDeployUrl(e.target.value)} className="bg-secondary/50 border-border/50" />

          <div className="md:col-span-2 space-y-2">
            <Input placeholder="URL da Imagem de Capa" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="bg-secondary/50 border-border/50" />
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
                  {uploading ? "Enviando..." : "Trocar imagem (PNG, JPG, WEBP — máx. 5MB)"}
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

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border/50">
            Cancelar
          </Button>
          <Button
            onClick={() => updateProject.mutate()}
            disabled={!name || updateProject.isPending}
            className="bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            {updateProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
