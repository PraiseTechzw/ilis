-- ILIS Storage Setup & Security

-- 1. Create the Bucket (if not exists via SQL)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project_documents', 'project_documents', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS Policies

-- Policy: Allow users to upload files to their own project folder
-- We assume the path structure is: /project_id/file_name
CREATE POLICY "Innovators can upload project documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project_documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE pi_id = auth.uid()
  )
);

-- Policy: Allow users to view/download files from their own project folder
CREATE POLICY "Innovators can view project documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project_documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE pi_id = auth.uid()
  )
);

-- Policy: Allow users to delete their own project documents
CREATE POLICY "Innovators can delete project documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project_documents' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE pi_id = auth.uid()
  )
);

-- Policy: Hub Admins can view/download ALL documents
-- (Future-proofing for the Hub Admin dashboard)
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project_documents' AND
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'HUB_ADMIN'
  )
);
