-- Fix handle_new_user function to handle errors gracefully
-- This prevents "Database error saving new user" when signup fails

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if profile already exists (by id)
    IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
        -- Profile already exists, update it
        UPDATE public.profiles
        SET 
            email = COALESCE(NEW.email, profiles.email),
            full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
            avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
            updated_at = timezone('utc'::text, now())
        WHERE id = NEW.id;
    ELSE
        -- Check if email already exists (might be from a previous failed signup)
        IF EXISTS (SELECT 1 FROM public.profiles WHERE email = NEW.email AND id != NEW.id) THEN
            -- Email exists but for different user - this shouldn't happen but handle gracefully
            -- Delete the old profile and create new one
            DELETE FROM public.profiles WHERE email = NEW.email AND id != NEW.id;
        END IF;
        
        -- Insert new profile
        INSERT INTO public.profiles (id, email, full_name, avatar_url)
        VALUES (
            NEW.id,
            COALESCE(NEW.email, ''),
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'avatar_url'
        );
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Handle unique constraint violations gracefully
        -- Try to update existing profile instead
        BEGIN
            UPDATE public.profiles
            SET 
                email = COALESCE(NEW.email, profiles.email),
                full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name),
                avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', profiles.avatar_url),
                updated_at = timezone('utc'::text, now())
            WHERE id = NEW.id OR email = NEW.email;
            RETURN NEW;
        EXCEPTION
            WHEN others THEN
                RAISE WARNING 'Error updating profile for user %: %', NEW.id, SQLERRM;
                RETURN NEW;
        END;
    WHEN others THEN
        -- Log the error but don't fail the signup
        -- This allows the user to be created even if profile creation has issues
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
