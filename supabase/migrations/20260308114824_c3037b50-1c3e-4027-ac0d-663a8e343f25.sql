
-- Mock interview results
CREATE TABLE public.mock_interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  user_id UUID,
  category TEXT NOT NULL DEFAULT 'mixed',
  questions JSONB NOT NULL DEFAULT '[]',
  answers JSONB NOT NULL DEFAULT '[]',
  scores JSONB NOT NULL DEFAULT '{}',
  overall_score NUMERIC DEFAULT 0,
  feedback JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert mock interviews" ON public.mock_interviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view mock interviews" ON public.mock_interviews FOR SELECT USING (true);

-- Coding problems
CREATE TABLE public.coding_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'easy',
  sample_input TEXT,
  sample_output TEXT,
  test_cases JSONB NOT NULL DEFAULT '[]',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view coding problems" ON public.coding_problems FOR SELECT USING (true);

-- Coding submissions
CREATE TABLE public.coding_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  user_id UUID,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  execution_time_ms NUMERIC DEFAULT 0,
  ai_feedback TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert coding submissions" ON public.coding_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view coding submissions" ON public.coding_submissions FOR SELECT USING (true);

-- Career recommendations
CREATE TABLE public.career_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  user_id UUID,
  recommendations JSONB NOT NULL DEFAULT '[]',
  roadmap JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert career recommendations" ON public.career_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view career recommendations" ON public.career_recommendations FOR SELECT USING (true);
