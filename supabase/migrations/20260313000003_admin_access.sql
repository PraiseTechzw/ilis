-- ILIS Admin RLS & Access Control

-- 1. Projects: Allow Admins and Executives to view all
CREATE POLICY "Admins can view ALL projects" 
ON projects FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('HUB_ADMIN', 'EXECUTIVE')
  )
);

-- 2. Profiles: Allow Admins to see all profiles (for triage queue)
CREATE POLICY "Admins can view ALL profiles" 
ON profiles FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('HUB_ADMIN', 'EXECUTIVE')
  )
);

-- 3. Projects: Allow Admins to update any project (for stage transitions)
CREATE POLICY "Admins can update ANY project" 
ON projects FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'HUB_ADMIN'
  )
);
