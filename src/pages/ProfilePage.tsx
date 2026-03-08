import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { User, Save, Plus, X, Brain, Code, Cpu } from "lucide-react";

const programmingOptions = ["Python", "Java", "C++", "JavaScript", "React", "SQL", "Machine Learning", "Cloud", "DevOps", "Git"];
const technicalOptions = ["Web Development", "Mobile Development", "Data Science", "AI/ML", "Cybersecurity", "Blockchain"];

export default function ProfilePage() {
  const { setProfile, setProfileId } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customProgramming, setCustomProgramming] = useState("");
  const [customTechnical, setCustomTechnical] = useState("");

  const [form, setForm] = useState({
    name: "",
    cgpa: 7.0,
    programming_skills: [] as string[],
    dsa_score: 50,
    aptitude_score: 50,
    num_projects: 2,
    internship_experience: 0,
    technical_skills: [] as string[],
    communication_rating: 5,
  });

  const toggleSkill = (skill: string, field: "programming_skills" | "technical_skills") => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(skill) ? f[field].filter((s) => s !== skill) : [...f[field], skill],
    }));
  };

  const addCustomSkill = (field: "programming_skills" | "technical_skills") => {
    const value = field === "programming_skills" ? customProgramming.trim() : customTechnical.trim();
    if (!value) return;
    if (form[field].includes(value)) { toast.error("Skill already added"); return; }
    setForm((f) => ({ ...f, [field]: [...f[field], value] }));
    if (field === "programming_skills") setCustomProgramming("");
    else setCustomTechnical("");
  };

  const removeCustomSkill = (skill: string, field: "programming_skills" | "technical_skills") => {
    setForm((f) => ({ ...f, [field]: f[field].filter((s) => s !== skill) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Please enter your name"); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("student_profiles").insert({
        name: form.name.trim(),
        cgpa: form.cgpa,
        programming_skills: form.programming_skills,
        dsa_score: form.dsa_score,
        aptitude_score: form.aptitude_score,
        num_projects: form.num_projects,
        internship_experience: form.internship_experience,
        technical_skills: form.technical_skills,
        communication_rating: form.communication_rating,
      }).select().single();
      if (error) throw error;
      setProfile(form);
      setProfileId(data.id);
      toast.success("Profile saved successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const renderSkillSection = (
    label: string,
    field: "programming_skills" | "technical_skills",
    options: string[],
    customValue: string,
    setCustomValue: (v: string) => void,
    gradient: string
  ) => {
    const customSkills = form[field].filter((s) => !options.includes(s));
    return (
      <div className="space-y-3">
        <Label>{label}</Label>
        <div className="flex flex-wrap gap-2">
          {options.map((s) => (
            <button key={s} type="button" onClick={() => toggleSkill(s, field)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                form[field].includes(s) ? `${gradient} text-primary-foreground` : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}>{s}</button>
          ))}
        </div>
        {customSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customSkills.map((s) => (
              <span key={s} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${gradient} text-primary-foreground flex items-center gap-1`}>
                {s}
                <button type="button" onClick={() => removeCustomSkill(s, field)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Add other skill..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(field); } }}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => addCustomSkill(field)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Student Profile</h1>
          <p className="text-sm text-muted-foreground">Enter your details for placement analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border border-border p-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" maxLength={100} />
        </div>

        <div className="space-y-2">
          <Label>CGPA: {form.cgpa.toFixed(1)}</Label>
          <Slider value={[form.cgpa]} onValueChange={([v]) => setForm({ ...form, cgpa: Math.round(v * 10) / 10 })} min={0} max={10} step={0.1} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projects">Number of Projects</Label>
            <Input id="projects" type="number" value={form.num_projects} onChange={(e) => setForm({ ...form, num_projects: parseInt(e.target.value) || 0 })} min={0} max={50} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="internships">Internships</Label>
            <Input id="internships" type="number" value={form.internship_experience} onChange={(e) => setForm({ ...form, internship_experience: parseInt(e.target.value) || 0 })} min={0} max={20} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Communication Rating: {form.communication_rating}/10</Label>
          <Slider value={[form.communication_rating]} onValueChange={([v]) => setForm({ ...form, communication_rating: v })} min={1} max={10} step={1} />
        </div>

        {renderSkillSection("Programming Skills", "programming_skills", programmingOptions, customProgramming, setCustomProgramming, "gradient-primary")}
        {renderSkillSection("Technical Skills", "technical_skills", technicalOptions, customTechnical, setCustomTechnical, "gradient-accent")}

        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground text-lg py-5">
          <Save className="w-5 h-5 mr-2" />
          {loading ? "Saving..." : "Predict My Placement"}
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <Button type="button" variant="outline" onClick={() => navigate("/quiz")} className="flex items-center gap-2">
            <Brain className="w-4 h-4" /> Check Aptitude Score
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/quiz")} className="flex items-center gap-2">
            <Code className="w-4 h-4" /> Check DSA Score
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/quiz")} className="flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Check Core Subject Score
          </Button>
        </div>
      </form>
    </div>
  );
}
