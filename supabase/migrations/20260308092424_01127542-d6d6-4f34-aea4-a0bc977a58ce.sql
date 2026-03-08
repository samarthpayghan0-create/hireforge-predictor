
-- Create student_profiles table
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cgpa NUMERIC(3,1) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
  programming_skills TEXT[] DEFAULT '{}',
  dsa_score INTEGER NOT NULL CHECK (dsa_score >= 0 AND dsa_score <= 100),
  aptitude_score INTEGER NOT NULL CHECK (aptitude_score >= 0 AND aptitude_score <= 100),
  num_projects INTEGER NOT NULL DEFAULT 0,
  internship_experience INTEGER NOT NULL DEFAULT 0,
  technical_skills TEXT[] DEFAULT '{}',
  communication_rating INTEGER NOT NULL CHECK (communication_rating >= 1 AND communication_rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.student_profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profiles" ON public.student_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON public.student_profiles FOR UPDATE USING (true);

-- Create quiz_scores table
CREATE TABLE public.quiz_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz scores" ON public.quiz_scores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert quiz scores" ON public.quiz_scores FOR INSERT WITH CHECK (true);

-- Create communication_scores table
CREATE TABLE public.communication_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  speaking_speed NUMERIC(5,2),
  fluency_score INTEGER,
  clarity_score INTEGER,
  confidence_score INTEGER,
  overall_score INTEGER,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.communication_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comm scores" ON public.communication_scores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comm scores" ON public.communication_scores FOR INSERT WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
