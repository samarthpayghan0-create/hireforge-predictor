
-- ============ student_profiles ============
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Anyone can update profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Anyone can delete profiles" ON public.student_profiles;

CREATE POLICY "Users can view own profiles" ON public.student_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profiles" ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profiles" ON public.student_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profiles" ON public.student_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ resume_analyses ============
DROP POLICY IF EXISTS "Anyone can view resume analyses" ON public.resume_analyses;
DROP POLICY IF EXISTS "Anyone can insert resume analyses" ON public.resume_analyses;
DROP POLICY IF EXISTS "Anyone can update own resume analyses" ON public.resume_analyses;

CREATE POLICY "Users can view own resume analyses" ON public.resume_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resume analyses" ON public.resume_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resume analyses" ON public.resume_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============ career_recommendations ============
DROP POLICY IF EXISTS "Anyone can view career recommendations" ON public.career_recommendations;
DROP POLICY IF EXISTS "Anyone can insert career recommendations" ON public.career_recommendations;

CREATE POLICY "Users can view own career recommendations" ON public.career_recommendations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own career recommendations" ON public.career_recommendations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ coding_submissions ============
DROP POLICY IF EXISTS "Anyone can view coding submissions" ON public.coding_submissions;
DROP POLICY IF EXISTS "Anyone can insert coding submissions" ON public.coding_submissions;

CREATE POLICY "Users can view own coding submissions" ON public.coding_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coding submissions" ON public.coding_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ coding_leaderboard ============
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON public.coding_leaderboard;
DROP POLICY IF EXISTS "Anyone can insert leaderboard" ON public.coding_leaderboard;
DROP POLICY IF EXISTS "Anyone can update leaderboard" ON public.coding_leaderboard;

CREATE POLICY "Anyone can view leaderboard" ON public.coding_leaderboard FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own leaderboard" ON public.coding_leaderboard FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leaderboard" ON public.coding_leaderboard FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============ communication_scores ============
DROP POLICY IF EXISTS "Anyone can view comm scores" ON public.communication_scores;
DROP POLICY IF EXISTS "Anyone can insert comm scores" ON public.communication_scores;

-- communication_scores uses profile_id, not user_id. We need a helper function.
CREATE OR REPLACE FUNCTION public.get_user_profile_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.student_profiles WHERE user_id = _user_id;
$$;

CREATE POLICY "Users can view own comm scores" ON public.communication_scores FOR SELECT TO authenticated USING (profile_id IN (SELECT public.get_user_profile_ids(auth.uid())));
CREATE POLICY "Users can insert own comm scores" ON public.communication_scores FOR INSERT TO authenticated WITH CHECK (profile_id IN (SELECT public.get_user_profile_ids(auth.uid())));

-- ============ mock_interviews ============
DROP POLICY IF EXISTS "Anyone can view mock interviews" ON public.mock_interviews;
DROP POLICY IF EXISTS "Anyone can insert mock interviews" ON public.mock_interviews;

CREATE POLICY "Users can view own mock interviews" ON public.mock_interviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mock interviews" ON public.mock_interviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ quiz_scores ============
DROP POLICY IF EXISTS "Anyone can view quiz scores" ON public.quiz_scores;
DROP POLICY IF EXISTS "Anyone can insert quiz scores" ON public.quiz_scores;

CREATE POLICY "Users can view own quiz scores" ON public.quiz_scores FOR SELECT TO authenticated USING (profile_id IN (SELECT public.get_user_profile_ids(auth.uid())));
CREATE POLICY "Users can insert own quiz scores" ON public.quiz_scores FOR INSERT TO authenticated WITH CHECK (profile_id IN (SELECT public.get_user_profile_ids(auth.uid())));

-- ============ app_ratings ============
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.app_ratings;
DROP POLICY IF EXISTS "Anyone can insert ratings" ON public.app_ratings;
DROP POLICY IF EXISTS "Anyone can update own rating" ON public.app_ratings;

CREATE POLICY "Anyone can view ratings" ON public.app_ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own ratings" ON public.app_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.app_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
