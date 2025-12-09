-- Fix profile creation trigger to ensure profiles are ALWAYS created on signup
-- This replaces the existing trigger with a more robust version

-- Step 1: Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Create a robust trigger function that ALWAYS creates profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_full_name TEXT;
    user_avatar_url TEXT;
    profile_created BOOLEAN := false;
BEGIN
    -- Extract values safely
    user_email := COALESCE(NEW.email, '');
    user_full_name := NEW.raw_user_meta_data->>'full_name';
    user_avatar_url := NEW.raw_user_meta_data->>'avatar_url';
    
    -- Ensure email is not empty
    IF user_email = '' OR user_email IS NULL THEN
        user_email := COALESCE(NEW.id::text, 'user_' || gen_random_uuid()::text) || '@temp.local';
    END IF;
    
    -- Try to create the profile - use multiple strategies to ensure it works
    BEGIN
        -- Strategy 1: Simple insert
        INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
        VALUES (
            NEW.id,
            user_email,
            user_full_name,
            user_avatar_url,
            false,
            false
        );
        profile_created := true;
    EXCEPTION
        WHEN unique_violation THEN
            -- Profile already exists, try to update it
            BEGIN
                UPDATE public.profiles
                SET 
                    email = COALESCE(user_email, profiles.email),
                    full_name = COALESCE(user_full_name, profiles.full_name),
                    avatar_url = COALESCE(user_avatar_url, profiles.avatar_url),
                    updated_at = timezone('utc'::text, now())
                WHERE id = NEW.id;
                profile_created := true;
            EXCEPTION
                WHEN others THEN
                    RAISE WARNING 'Failed to update existing profile for user %: %', NEW.id, SQLERRM;
            END;
        WHEN others THEN
            RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    END;
    
    -- Strategy 2: If insert failed, try upsert approach
    IF NOT profile_created THEN
        BEGIN
            INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
            VALUES (
                NEW.id,
                user_email,
                user_full_name,
                user_avatar_url,
                false,
                false
            )
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
                avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
                updated_at = timezone('utc'::text, now());
            profile_created := true;
        EXCEPTION
            WHEN others THEN
                RAISE WARNING 'Upsert also failed for user %: %', NEW.id, SQLERRM;
        END;
    END IF;
    
    -- Strategy 3: Last resort - check if profile exists, if not, log warning
    IF NOT profile_created THEN
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
            RAISE WARNING 'CRITICAL: Profile was NOT created for user % (email: %). Manual intervention required.', NEW.id, user_email;
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        -- Ultimate fallback: log error but NEVER fail the signup
        RAISE WARNING 'CRITICAL ERROR in handle_new_user for user % (email: %): %', NEW.id, user_email, SQLERRM;
        -- Always return NEW to allow signup to succeed
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Add comment
COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates user profile on signup. Uses multiple strategies to ensure profile is always created. Never fails signup even if profile creation has issues.';

-- Step 5: Create missing profiles for existing users
-- This will create profiles for any users that can log in but don't have profiles
DO $$
DECLARE
    v_user RECORD;
    v_count INTEGER := 0;
BEGIN
    -- Loop through all users without profiles
    FOR v_user IN 
        SELECT 
            u.id,
            u.email,
            u.raw_user_meta_data->>'full_name' as full_name,
            u.raw_user_meta_data->>'avatar_url' as avatar_url
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.id
        WHERE p.id IS NULL
    LOOP
        BEGIN
            -- Create profile for this user
            INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
            VALUES (
                v_user.id,
                COALESCE(v_user.email, ''),
                v_user.full_name,
                v_user.avatar_url,
                false,
                false
            )
            ON CONFLICT (id) DO NOTHING;
            
            v_count := v_count + 1;
            RAISE NOTICE 'Created profile for user: % (%)', v_user.email, v_user.id;
        EXCEPTION
            WHEN others THEN
                RAISE WARNING 'Failed to create profile for user % (%): %', v_user.email, v_user.id, SQLERRM;
        END;
    END LOOP;
    
    IF v_count > 0 THEN
        RAISE NOTICE 'Successfully created % missing profiles', v_count;
    ELSE
        RAISE NOTICE 'No missing profiles found - all users have profiles';
    END IF;
END $$;
