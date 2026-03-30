import { useState, useEffect } from "react";
import { Route, BookOpen, Clock, Star, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LOADING_MESSAGES = [
  "Analysing the role...",
  "Mapping required skills...",
  "Curating learning resources...",
  "Building your personalised roadmap...",
  "Finding the best courses & tutorials...",
  "Almost there...",
];

const SUGGESTED_ROLES = [
  "Full Stack Developer", "Data Scientist", "DevOps Engineer",
  "Machine Learning Engineer", "Android Developer", "Cloud Architect",
  "Cybersecurity Analyst", "UI/UX Designer", "Backend Developer",
  "Blockchain Developer", "QA Engineer", "Product Manager",
];

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  topics: string[];
  resources: { name: string; url: string; type: string }[];
  timeline: string;
  priority: string;
}

interface RoadmapResult {
  roadmap: RoadmapStep[];
  estimated_total_time: string;
  career_goal: string;
}

export default function AiRoadmapPage() {
  const [career, setCareer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoadmapResult | null>(null);

  const generateRoadmap = async () => {
    if (!career.trim()) {
      toast.error("Please enter a career or job title");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-career-roadmap", {
        body: { career: career.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p: string) => {
    switch (p.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-2">
            <Sparkles className="w-4 h-4" /> AI-Powered
          </div>
          <h1 className="text-4xl font-bold text-foreground">Career Roadmap Generator</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter your dream career or job role and get a personalized learning roadmap with skills, resources, and timelines.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-3 max-w-xl mx-auto mb-12">
          <Input
            placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer..."
            value={career}
            onChange={(e) => setCareer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateRoadmap()}
            className="text-base h-12 rounded-xl"
            disabled={loading}
          />
          <Button
            onClick={generateRoadmap}
            disabled={loading}
            className="h-12 px-6 rounded-xl font-bold gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Route className="w-5 h-5" />}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 space-y-4 animate-pulse">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground text-lg">Crafting your personalized roadmap...</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-base px-4 py-2 gap-2">
                <Star className="w-4 h-4" /> {result.career_goal}
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2 gap-2">
                <Clock className="w-4 h-4" /> {result.estimated_total_time}
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2 gap-2">
                <BookOpen className="w-4 h-4" /> {result.roadmap.length} Steps
              </Badge>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              {result.roadmap.map((step, i) => (
                <div key={i} className="relative flex gap-4 md:gap-6 mb-6">
                  {/* Step number */}
                  <div className="shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10">
                    {step.step}
                  </div>

                  <Card className="flex-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={priorityColor(step.priority) as any}>
                            {step.priority}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" /> {step.timeline}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{step.description}</p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2">
                        {step.topics.map((topic, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      {/* Resources */}
                      {step.resources?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">Resources:</p>
                          <div className="flex flex-wrap gap-2">
                            {step.resources.map((res, k) => (
                              <a
                                key={k}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" /> {res.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
