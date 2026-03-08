import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { User, Save, Plus, X, Brain, Code, Cpu, ChevronRight, ChevronLeft, GraduationCap, Briefcase, MessageSquare, BookOpen, Sparkles } from "lucide-react";

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
  { key: "academics", label: "Academics", icon: GraduationCap },
  { key: "programming", label: "Programming", icon: Code },
  { key: "technical", label: "Technical", icon: Briefcase },
  { key: "selfAssess", label: "Assessment", icon: Brain },
  { key: "communication", label: "Communication", icon: MessageSquare },
] as const;

const NAME_REGEX = /^[A-Za-z\s.'-]+$/;
const isValidName = (name: string) => name.trim().length >= 2 && NAME_REGEX.test(name.trim());

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

  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!isValidName(form.name)) { toast.error("Please enter a valid name (letters only, at least 2 characters)"); return; }
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
        user_id: user?.id || null,
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
    <div className="min-h-screen bg-pattern">
      <div className="container mx-auto px-4 lg:px-8 py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
            <StepIcon className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Create Profile</h1>
            <p className="text-muted-foreground">Step {currentStep + 1} of {STEPS.length} — {step.label}</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex-1">
              <div className={`h-2 rounded-full transition-all duration-300 ${
                i < currentStep ? "gradient-primary" : i === currentStep ? "gradient-accent" : "bg-secondary"
              }`} />
            </div>
          ))}
        </div>

        <div className="card-elevated p-6 md:p-8 space-y-6 animate-fade-in">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <>
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold">Full Name</Label>
                <Input 
                  id="name" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="Enter your full name" 
                  maxLength={100}
                  className="h-12 text-base rounded-xl"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">CGPA</Label>
                <div className="bg-secondary/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Your current CGPA</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={form.cgpa}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v) && v >= 0 && v <= 10) setForm({ ...form, cgpa: Math.round(v * 10) / 10 });
                        }}
                        className="w-20 text-center font-bold text-xl h-12 rounded-xl"
                        min={0} max={10} step={0.1}
                      />
                      <span className="text-muted-foreground font-medium">/ 10</span>
                    </div>
                  </div>
                  <Slider value={[form.cgpa]} onValueChange={([v]) => setForm({ ...form, cgpa: Math.round(v * 10) / 10 })} min={0} max={10} step={0.1} />
                  <div className="flex justify-between text-sm mt-3">
                    <span className="text-muted-foreground">0.0</span>
                    <span className={`font-semibold ${form.cgpa >= 8 ? "text-success" : form.cgpa >= 6 ? "text-warning" : "text-destructive"}`}>
                      {form.cgpa >= 9 ? "Outstanding" : form.cgpa >= 8 ? "Excellent" : form.cgpa >= 7 ? "Good" : form.cgpa >= 6 ? "Average" : "Needs Improvement"}
                    </span>
                    <span className="text-muted-foreground">10.0</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Academics & Experience */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="projects" className="text-base font-semibold">Number of Projects</Label>
                  <Input 
                    id="projects" 
                    type="number" 
                    value={form.num_projects} 
                    onChange={(e) => setForm({ ...form, num_projects: parseInt(e.target.value) || 0 })} 
                    min={0} max={50}
                    className="h-12 text-base rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="internships" className="text-base font-semibold">Internships</Label>
                  <Input 
                    id="internships" 
                    type="number" 
                    value={form.internship_experience} 
                    onChange={(e) => setForm({ ...form, internship_experience: parseInt(e.target.value) || 0 })} 
                    min={0} max={20}
                    className="h-12 text-base rounded-xl"
                  />
                </div>
              </div>
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Tip:</strong> Include all projects — personal, academic, and professional. Quality matters more than quantity!
                  </p>
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
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 mb-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Self-Assessment Scores</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      These will be used if you don't take the quiz. We recommend taking the quiz for accurate results.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">DSA Knowledge</Label>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      form.dsa_score >= 60 ? "bg-success/10 text-success" : form.dsa_score >= 40 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                    }`}>
                      {form.dsa_score}%
                    </span>
                  </div>
                  <Slider value={[form.dsa_score]} onValueChange={([v]) => setForm({ ...form, dsa_score: v })} min={0} max={100} step={5} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Aptitude Score</Label>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      form.aptitude_score >= 60 ? "bg-success/10 text-success" : form.aptitude_score >= 40 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                    }`}>
                      {form.aptitude_score}%
                    </span>
                  </div>
                  <Slider value={[form.aptitude_score]} onValueChange={([v]) => setForm({ ...form, aptitude_score: v })} min={0} max={100} step={5} />
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/quiz")} 
                className="w-full mt-4 h-12 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
              >
                <Brain className="w-5 h-5 mr-2" /> Take Quiz for Accurate Scores →
              </Button>
            </>
          )}

          {/* Step 6: Communication */}
          {currentStep === 5 && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Communication Rating</Label>
                  <span className="text-2xl font-bold text-gradient">{form.communication_rating}/10</span>
                </div>
                <Slider 
                  value={[form.communication_rating]} 
                  onValueChange={([v]) => setForm({ ...form, communication_rating: v })} 
                  min={1} max={10} step={1} 
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
              <div className="bg-accent/5 rounded-2xl p-5 border border-accent/10 mt-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Pro tip:</strong> Use the Voice Analyzer for a more accurate communication assessment!
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep} className="flex-1 gradient-primary text-primary-foreground h-12 rounded-xl shadow-glow">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 gradient-primary text-primary-foreground h-14 text-lg rounded-xl shadow-glow">
                <Save className="w-5 h-5 mr-2" />
                {loading ? "Saving..." : "Predict My Placement"}
              </Button>
            )}
          </div>
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
    <div className="space-y-4">
      <Label className="text-base font-semibold">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.slice(0, 15).map((s) => (
          <button 
            key={s} 
            type="button" 
            onClick={() => onToggle(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selected.includes(s) 
                ? `${gradient} text-primary-foreground shadow-md` 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {s}
          </button>
        ))}
        {customSkills.map((s) => (
          <span key={s} className={`px-4 py-2 rounded-xl text-sm font-medium ${gradient} text-primary-foreground shadow-md flex items-center gap-2`}>
            {s}
            <button type="button" onClick={() => onRemove(s)} className="hover:bg-white/20 rounded-full p-0.5">
              <X className="w-3 h-3" />
            </button>
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
            className="flex-1 h-12 rounded-xl"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => {
              if (customValue.trim()) {
                onAdd(customValue);
                setShowSuggestions(false);
              }
            }}
            className="h-12 w-12 rounded-xl"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-xl max-h-48 overflow-y-auto">
            {suggestions.map(s => (
              <button 
                key={s} 
                type="button"
                className="w-full text-left px-4 py-3 text-sm hover:bg-secondary/50 transition-colors text-foreground first:rounded-t-2xl last:rounded-b-2xl"
                onClick={() => {
                  if (options.includes(s)) onToggle(s);
                  else onAdd(s);
                  setCustomValue("");
                  setShowSuggestions(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
