
CREATE TABLE public.app_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

ALTER TABLE public.app_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings" ON public.app_ratings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert ratings" ON public.app_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update own rating" ON public.app_ratings FOR UPDATE USING (true);
