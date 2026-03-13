-- Run this in your Supabase SQL Editor to promote a user to Hub Admin
-- Replace 'USER_EMAIL' with the actual email of the user

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id FROM profiles WHERE email = 'USER_EMAIL';
    
    IF target_user_id IS NOT NULL THEN
        -- Insert or Update user role to HUB_ADMIN
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'HUB_ADMIN')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'User % has been promoted to HUB_ADMIN', 'USER_EMAIL';
    ELSE
        RAISE WARNING 'User with email % not found in profiles', 'USER_EMAIL';
    END IF;
END $$;
