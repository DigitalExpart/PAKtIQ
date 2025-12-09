-- Create missing profile for existing user
-- Run this if a user account exists but profile is missing

-- This will create a profile for the user jumatomosany@gmail.com
-- Replace the email with the actual user's email if different

DO $$
DECLARE
    v_user_id UUID;
    v_user_email TEXT;
BEGIN
    -- Find the user by email
    SELECT id, email INTO v_user_id, v_user_email
    FROM auth.users
    WHERE email = 'jumatomosany@gmail.com'
    LIMIT 1;
    
    -- If user found and profile doesn't exist, create it
    IF v_user_id IS NOT NULL THEN
        -- Check if profile already exists
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user_id) THEN
            -- Create the profile
            INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
            VALUES (
                v_user_id,
                v_user_email,
                NULL, -- full_name from user metadata if available
                NULL, -- avatar_url
                false,
                false
            )
            ON CONFLICT (id) DO NOTHING;
            
            RAISE NOTICE 'Profile created for user: % (%)', v_user_email, v_user_id;
        ELSE
            RAISE NOTICE 'Profile already exists for user: %', v_user_email;
        END IF;
    ELSE
        RAISE NOTICE 'User not found with email: jumatomosany@gmail.com';
    END IF;
END $$;

-- Alternative: Create profiles for ALL users missing profiles
-- Uncomment and run this if you want to fix all missing profiles at once:

/*
DO $$
DECLARE
    v_user RECORD;
    v_count INTEGER := 0;
BEGIN
    -- Loop through all users without profiles
    FOR v_user IN 
        SELECT u.id, u.email, u.raw_user_meta_data->>'full_name' as full_name
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL
    LOOP
        -- Create profile for this user
        INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
        VALUES (
            v_user.id,
            v_user.email,
            v_user.full_name,
            NULL,
            false,
            false
        )
        ON CONFLICT (id) DO NOTHING;
        
        v_count := v_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Created % missing profiles', v_count;
END $$;
*/
