
-- Leaderboard table
CREATE TABLE public.coding_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  problems_solved INTEGER NOT NULL DEFAULT 0,
  easy_solved INTEGER NOT NULL DEFAULT 0,
  medium_solved INTEGER NOT NULL DEFAULT 0,
  hard_solved INTEGER NOT NULL DEFAULT 0,
  preferred_language TEXT DEFAULT 'python',
  success_rate NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.coding_leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view leaderboard" ON public.coding_leaderboard FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leaderboard" ON public.coding_leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update leaderboard" ON public.coding_leaderboard FOR UPDATE USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.coding_leaderboard;

-- Add constraints column to coding_problems
ALTER TABLE public.coding_problems ADD COLUMN IF NOT EXISTS constraints TEXT DEFAULT '';
ALTER TABLE public.coding_problems ADD COLUMN IF NOT EXISTS company_tags TEXT[] DEFAULT '{}';
ALTER TABLE public.coding_problems ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10;
