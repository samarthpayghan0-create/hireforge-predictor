
-- student_profiles: allow public read/insert
DROP POLICY IF EXISTS "Users can view own profiles" ON public.student_profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON public.student_profiles;
CREATE POLICY "Anyone can view profiles" ON public.student_profiles FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert profiles" ON public.student_profiles FOR INSERT TO public WITH CHECK (true);

-- resume_analyses: allow public read/insert
DROP POLICY IF EXISTS "Users can view own resume analyses" ON public.resume_analyses;
DROP POLICY IF EXISTS "Users can insert own resume analyses" ON public.resume_analyses;
DROP POLICY IF EXISTS "Users can update own resume analyses" ON public.resume_analyses;
CREATE POLICY "Anyone can view resume analyses" ON public.resume_analyses FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert resume analyses" ON public.resume_analyses FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can update own resume analyses" ON public.resume_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- career_recommendations: allow public read/insert
DROP POLICY IF EXISTS "Users can view own career recommendations" ON public.career_recommendations;
DROP POLICY IF EXISTS "Users can insert own career recommendations" ON public.career_recommendations;
CREATE POLICY "Anyone can view career recommendations" ON public.career_recommendations FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert career recommendations" ON public.career_recommendations FOR INSERT TO public WITH CHECK (true);

-- coding_submissions: allow public read/insert
DROP POLICY IF EXISTS "Users can view own coding submissions" ON public.coding_submissions;
DROP POLICY IF EXISTS "Users can insert own coding submissions" ON public.coding_submissions;
CREATE POLICY "Anyone can view coding submissions" ON public.coding_submissions FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert coding submissions" ON public.coding_submissions FOR INSERT TO public WITH CHECK (true);

-- mock_interviews: allow public read/insert
DROP POLICY IF EXISTS "Users can view own mock interviews" ON public.mock_interviews;
DROP POLICY IF EXISTS "Users can insert own mock interviews" ON public.mock_interviews;
CREATE POLICY "Anyone can view mock interviews" ON public.mock_interviews FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert mock interviews" ON public.mock_interviews FOR INSERT TO public WITH CHECK (true);

-- communication_scores: allow public read/insert
DROP POLICY IF EXISTS "Users can view own comm scores" ON public.communication_scores;
DROP POLICY IF EXISTS "Users can insert own comm scores" ON public.communication_scores;
CREATE POLICY "Anyone can view comm scores" ON public.communication_scores FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert comm scores" ON public.communication_scores FOR INSERT TO public WITH CHECK (true);

-- quiz_scores: allow public read/insert
DROP POLICY IF EXISTS "Users can view own quiz scores" ON public.quiz_scores;
DROP POLICY IF EXISTS "Users can insert own quiz scores" ON public.quiz_scores;
CREATE POLICY "Anyone can view quiz scores" ON public.quiz_scores FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert quiz scores" ON public.quiz_scores FOR INSERT TO public WITH CHECK (true);

-- app_ratings: allow public read/insert
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.app_ratings;
DROP POLICY IF EXISTS "Users can insert own ratings" ON public.app_ratings;
CREATE POLICY "Anyone can view ratings" ON public.app_ratings FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert ratings" ON public.app_ratings FOR INSERT TO public WITH CHECK (true);

-- coding_leaderboard: allow public read/insert/update
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON public.coding_leaderboard;
DROP POLICY IF EXISTS "Users can insert own leaderboard" ON public.coding_leaderboard;
DROP POLICY IF EXISTS "Users can update own leaderboard" ON public.coding_leaderboard;
CREATE POLICY "Anyone can view leaderboard" ON public.coding_leaderboard FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert leaderboard" ON public.coding_leaderboard FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update leaderboard" ON public.coding_leaderboard FOR UPDATE TO public USING (true);
