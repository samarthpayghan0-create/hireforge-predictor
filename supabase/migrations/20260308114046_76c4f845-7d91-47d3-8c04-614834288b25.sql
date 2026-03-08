
-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Allow authenticated users to upload their own resumes
CREATE POLICY "Users can upload resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to view their own resumes
CREATE POLICY "Users can view own resumes" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'resumes');

-- Allow authenticated users to delete their own resumes
CREATE POLICY "Users can delete own resumes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes');

-- Add resume_url column to student_profiles
ALTER TABLE public.student_profiles ADD COLUMN IF NOT EXISTS resume_url text DEFAULT NULL;
