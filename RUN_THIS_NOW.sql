-- URGENT: Create missing profiles for all users without profiles
-- Copy and paste this ENTIRE script into Supabase SQL Editor and RUN it

DO $$
DECLARE
    v_user RECORD;
    v_count INTEGER := 0;
    v_created INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting profile backfill for missing users...';
    
    -- Loop through all users without profiles
    FOR v_user IN 
        SELECT 
            u.id,
            COALESCE(u.email, '') as email,
            COALESCE(u.raw_user_meta_data->>'full_name', '') as full_name,
            COALESCE(u.raw_user_meta_data->>'avatar_url', '') as avatar_url
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL
    LOOP
        BEGIN
            -- Ensure email is not empty
            IF v_user.email = '' OR v_user.email IS NULL THEN
                v_user.email := v_user.id::text || '@temp.local';
            END IF;
            
            -- Create profile for this user
            INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
            VALUES (
                v_user.id,
                v_user.email,
                NULLIF(v_user.full_name, ''),
                NULLIF(v_user.avatar_url, ''),
                false,
                false
            )
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
                avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
                updated_at = timezone('utc'::text, now());
            
            v_created := v_created + 1;
            RAISE NOTICE '✅ Created profile for user: % (%)', v_user.email, v_user.id;
            
        EXCEPTION
            WHEN unique_violation THEN
                -- Profile already exists (race condition), try update
                BEGIN
                    UPDATE public.profiles
                    SET 
                        email = COALESCE(v_user.email, profiles.email),
                        full_name = COALESCE(NULLIF(v_user.full_name, ''), profiles.full_name),
                        avatar_url = COALESCE(NULLIF(v_user.avatar_url, ''), profiles.avatar_url),
                        updated_at = timezone('utc'::text, now())
                    WHERE id = v_user.id;
                    v_created := v_created + 1;
                    RAISE NOTICE '✅ Updated existing profile for user: % (%)', v_user.email, v_user.id;
                EXCEPTION
                    WHEN others THEN
                        RAISE WARNING '⚠️ Failed to update profile for user % (%): %', v_user.email, v_user.id, SQLERRM;
                END;
            WHEN others THEN
                RAISE WARNING '❌ Failed to create profile for user % (%): %', v_user.email, v_user.id, SQLERRM;
        END;
        
        v_count := v_count + 1;
    END LOOP;
    
    IF v_created > 0 THEN
        RAISE NOTICE '🎉 Successfully created/updated % missing profiles out of % users checked', v_created, v_count;
    ELSE
        IF v_count = 0 THEN
            RAISE NOTICE '✅ No missing profiles found - all users have profiles!';
        ELSE
            RAISE WARNING '⚠️ Checked % users but could not create any profiles. Check logs above.', v_count;
        END IF;
    END IF;
END $$;

-- Verify the results - this will show you the counts
SELECT 
    'Total users in auth.users' as description,
    COUNT(*)::text as count
FROM auth.users
UNION ALL
SELECT 
    'Total profiles in public.profiles' as description,
    COUNT(*)::text as count
FROM public.profiles
UNION ALL
SELECT 
    'Users without profiles' as description,
    COUNT(*)::text as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
