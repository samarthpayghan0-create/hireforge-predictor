
CREATE TABLE public.resume_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  user_id UUID,
  resume_url TEXT,
  resume_score INTEGER DEFAULT 0,
  detected_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  education TEXT[] DEFAULT '{}',
  projects TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  work_experience TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  skills_score INTEGER DEFAULT 0,
  projects_score INTEGER DEFAULT 0,
  experience_score INTEGER DEFAULT 0,
  keywords_score INTEGER DEFAULT 0,
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert resume analyses" ON public.resume_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view resume analyses" ON public.resume_analyses FOR SELECT USING (true);
CREATE POLICY "Anyone can update own resume analyses" ON public.resume_analyses FOR UPDATE USING (true);
