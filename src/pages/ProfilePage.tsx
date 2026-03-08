import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { User, Save } from "lucide-react";

const skillOptions = ["Python", "Java", "C++", "JavaScript", "React", "SQL", "Machine Learning", "Cloud", "DevOps", "Git"];

export default function ProfilePage() {
  const { setProfile, setProfileId } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      navigate("/quiz");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
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

        <div className="space-y-2">
          <Label>DSA Score: {form.dsa_score}%</Label>
          <Slider value={[form.dsa_score]} onValueChange={([v]) => setForm({ ...form, dsa_score: v })} min={0} max={100} step={1} />
        </div>

        <div className="space-y-2">
          <Label>Aptitude Score: {form.aptitude_score}%</Label>
          <Slider value={[form.aptitude_score]} onValueChange={([v]) => setForm({ ...form, aptitude_score: v })} min={0} max={100} step={1} />
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

        <div className="space-y-2">
          <Label>Programming Skills</Label>
          <div className="flex flex-wrap gap-2">
            {skillOptions.map((s) => (
              <button key={s} type="button" onClick={() => toggleSkill(s, "programming_skills")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  form.programming_skills.includes(s) ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Technical Skills</Label>
          <div className="flex flex-wrap gap-2">
            {["Web Development", "Mobile Development", "Data Science", "AI/ML", "Cybersecurity", "Blockchain"].map((s) => (
              <button key={s} type="button" onClick={() => toggleSkill(s, "technical_skills")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  form.technical_skills.includes(s) ? "gradient-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}>{s}</button>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground">
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save & Continue to Quiz"}
        </Button>
      </form>
    </div>
  );
}
