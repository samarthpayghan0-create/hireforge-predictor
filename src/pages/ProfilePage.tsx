import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { User, Save, Plus, X, Brain, Code, Cpu, ChevronRight, ChevronLeft, GraduationCap, Briefcase, MessageSquare, BookOpen } from "lucide-react";

const programmingOptions = [
  "Python", "Java", "C++", "C", "JavaScript", "TypeScript", "React", "Angular", "Vue.js",
  "Node.js", "SQL", "MongoDB", "Machine Learning", "Deep Learning", "Cloud Computing",
  "AWS", "Azure", "Docker", "Kubernetes", "DevOps", "Git", "GitHub", "Linux", "REST API",
  "GraphQL", "Django", "Flask", "Spring Boot", "Ruby", "Go", "Rust", "PHP", "Swift", "Kotlin",
  "Flutter", "React Native", "TensorFlow", "PyTorch", "Pandas", "NumPy"
];

const technicalOptions = [
  "Web Development", "Mobile Development", "Data Science", "AI/ML", "Cybersecurity",
  "Blockchain", "Cloud Architecture", "Database Management", "System Design",
  "DevOps Engineering", "UI/UX Design", "Game Development", "IoT", "Embedded Systems",
  "Data Engineering", "Network Security", "API Development", "Microservices"
];

const STEPS = [
  { key: "basics", label: "Basic Info", icon: User },
  { key: "academics", label: "Academics & Experience", icon: GraduationCap },
  { key: "programming", label: "Programming Skills", icon: Code },
  { key: "technical", label: "Technical Skills", icon: Briefcase },
  { key: "selfAssess", label: "Self Assessment", icon: Brain },
  { key: "communication", label: "Communication", icon: MessageSquare },
] as const;

type StepKey = typeof STEPS[number]["key"];

export default function ProfilePage() {
  const { setProfile, setProfileId } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
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

  const addCustomSkill = (field: "programming_skills" | "technical_skills", value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (form[field].includes(trimmed)) { toast.error("Skill already added"); return; }
    setForm((f) => ({ ...f, [field]: [...f[field], trimmed] }));
    if (field === "programming_skills") setCustomProgramming("");
    else setCustomTechnical("");
  };

  const removeCustomSkill = (skill: string, field: "programming_skills" | "technical_skills") => {
    setForm((f) => ({ ...f, [field]: f[field].filter((s) => s !== skill) }));
  };

  const handleSubmit = async () => {
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

  const nextStep = () => {
    if (currentStep === 0 && !form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const step = STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <StepIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Student Profile</h1>
          <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {STEPS.length} — {step.label}</p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex-1 flex items-center">
            <div className={`h-2 w-full rounded-full transition-all ${
              i < currentStep ? "gradient-primary" : i === currentStep ? "gradient-accent" : "bg-secondary"
            }`} />
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6 animate-fade-in">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" maxLength={100} />
            </div>
            <div className="space-y-3">
              <Label>CGPA</Label>
              <div className="bg-secondary/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Your current CGPA</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={form.cgpa}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (!isNaN(v) && v >= 0 && v <= 10) setForm({ ...form, cgpa: Math.round(v * 10) / 10 });
                      }}
                      className="w-20 text-center font-bold text-lg h-10"
                      min={0} max={10} step={0.1}
                    />
                    <span className="text-sm text-muted-foreground font-medium">/ 10</span>
                  </div>
                </div>
                <Slider value={[form.cgpa]} onValueChange={([v]) => setForm({ ...form, cgpa: Math.round(v * 10) / 10 })} min={0} max={10} step={0.1} />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0.0</span>
                  <span className={`font-semibold ${form.cgpa >= 8 ? "text-success" : form.cgpa >= 6 ? "text-warning" : "text-destructive"}`}>
                    {form.cgpa >= 9 ? "Outstanding" : form.cgpa >= 8 ? "Excellent" : form.cgpa >= 7 ? "Good" : form.cgpa >= 6 ? "Average" : "Needs Improvement"}
                  </span>
                  <span>10.0</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Academics & Experience */}
        {currentStep === 1 && (
          <>
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
          </>
        )}

        {/* Step 3: Programming Skills */}
        {currentStep === 2 && (
          <SkillSelector
            label="Programming Skills"
            field="programming_skills"
            options={programmingOptions}
            selected={form.programming_skills}
            customValue={customProgramming}
            setCustomValue={setCustomProgramming}
            onToggle={(s) => toggleSkill(s, "programming_skills")}
            onAdd={(v) => addCustomSkill("programming_skills", v)}
            onRemove={(s) => removeCustomSkill(s, "programming_skills")}
            gradient="gradient-primary"
          />
        )}

        {/* Step 4: Technical Skills */}
        {currentStep === 3 && (
          <SkillSelector
            label="Technical Skills"
            field="technical_skills"
            options={technicalOptions}
            selected={form.technical_skills}
            customValue={customTechnical}
            setCustomValue={setCustomTechnical}
            onToggle={(s) => toggleSkill(s, "technical_skills")}
            onAdd={(v) => addCustomSkill("technical_skills", v)}
            onRemove={(s) => removeCustomSkill(s, "technical_skills")}
            gradient="gradient-accent"
          />
        )}

        {/* Step 5: Self Assessment */}
        {currentStep === 4 && (
          <>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Set your self-assessment scores</p>
              </div>
              <p className="text-xs text-muted-foreground">These will be used if you don't take the quiz. We recommend taking the quiz for accurate results.</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>DSA Knowledge: {form.dsa_score}%</Label>
                  <span className={`text-xs font-semibold ${form.dsa_score >= 60 ? "text-success" : form.dsa_score >= 40 ? "text-warning" : "text-destructive"}`}>
                    {form.dsa_score >= 80 ? "Expert" : form.dsa_score >= 60 ? "Good" : form.dsa_score >= 40 ? "Intermediate" : "Beginner"}
                  </span>
                </div>
                <Slider value={[form.dsa_score]} onValueChange={([v]) => setForm({ ...form, dsa_score: v })} min={0} max={100} step={5} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Aptitude Score: {form.aptitude_score}%</Label>
                  <span className={`text-xs font-semibold ${form.aptitude_score >= 60 ? "text-success" : form.aptitude_score >= 40 ? "text-warning" : "text-destructive"}`}>
                    {form.aptitude_score >= 80 ? "Expert" : form.aptitude_score >= 60 ? "Good" : form.aptitude_score >= 40 ? "Intermediate" : "Beginner"}
                  </span>
                </div>
                <Slider value={[form.aptitude_score]} onValueChange={([v]) => setForm({ ...form, aptitude_score: v })} min={0} max={100} step={5} />
              </div>
            </div>
            <Button type="button" variant="outline" onClick={() => navigate("/quiz")} className="w-full mt-2 border-primary/30 text-primary hover:bg-primary/5">
              <Brain className="w-4 h-4 mr-2" /> Take the Quiz for accurate scores →
            </Button>
          </>
        )}

        {/* Step 6: Communication */}
        {currentStep === 5 && (
          <>
            <div className="space-y-2">
              <Label>Communication Rating: {form.communication_rating}/10</Label>
              <Slider value={[form.communication_rating]} onValueChange={([v]) => setForm({ ...form, communication_rating: v })} min={1} max={10} step={1} />
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} className="flex-1 gradient-primary text-primary-foreground">
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 gradient-primary text-primary-foreground">
              <Save className="w-5 h-5 mr-2" />
              {loading ? "Saving..." : "Predict My Placement"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== SKILL SELECTOR WITH AUTOCOMPLETE ==========
function SkillSelector({ label, options, selected, customValue, setCustomValue, onToggle, onAdd, onRemove, gradient }: {
  label: string; field: string; options: string[]; selected: string[];
  customValue: string; setCustomValue: (v: string) => void;
  onToggle: (s: string) => void; onAdd: (v: string) => void; onRemove: (s: string) => void;
  gradient: string;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const customSkills = selected.filter((s) => !options.includes(s));

  // All available options for suggestions (unselected ones + matching custom input)
  const suggestions = customValue.trim()
    ? [...options, ...customSkills]
        .filter(s => s.toLowerCase().includes(customValue.toLowerCase()) && !selected.includes(s))
        .slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {/* Preset options */}
        {options.slice(0, 15).map((s) => (
          <button key={s} type="button" onClick={() => onToggle(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selected.includes(s) ? `${gradient} text-primary-foreground` : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}>{s}</button>
        ))}
        {/* Custom skills shown inline */}
        {customSkills.map((s) => (
          <span key={s} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${gradient} text-primary-foreground flex items-center gap-1`}>
            {s}
            <button type="button" onClick={() => onRemove(s)}><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="relative" ref={containerRef}>
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type to search or add skill..."
            value={customValue}
            onChange={(e) => { setCustomValue(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (suggestions.length > 0) {
                  onToggle(suggestions[0]);
                  setCustomValue("");
                } else if (customValue.trim()) {
                  onAdd(customValue);
                }
                setShowSuggestions(false);
              }
            }}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => {
            if (customValue.trim()) {
              onAdd(customValue);
              setShowSuggestions(false);
            }
          }}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map(s => (
              <button key={s} type="button"
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors text-foreground first:rounded-t-xl last:rounded-b-xl"
                onClick={() => {
                  if (options.includes(s)) onToggle(s);
                  else onAdd(s);
                  setCustomValue("");
                  setShowSuggestions(false);
                }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
