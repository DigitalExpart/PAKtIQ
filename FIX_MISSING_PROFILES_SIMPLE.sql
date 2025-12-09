-- SIMPLE FIX: Create missing profiles for all users
-- This will create profiles for the 3 missing users immediately

-- First, let's see which users are missing profiles
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'full_name' as full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Now create profiles for all missing users
INSERT INTO public.profiles (id, email, full_name, avatar_url, onboarding_completed, premium)
SELECT 
    u.id,
    COALESCE(u.email, u.id::text || '@temp.local'),
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'avatar_url',
    false,
    false
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = timezone('utc'::text, now());

-- Verify: Check how many profiles we have now
SELECT 
    'Total users' as description,
    (SELECT COUNT(*) FROM auth.users)::text as count
UNION ALL
SELECT 
    'Total profiles' as description,
    (SELECT COUNT(*) FROM public.profiles)::text as count
UNION ALL
SELECT 
    'Missing profiles' as description,
    (SELECT COUNT(*) 
     FROM auth.users u
     LEFT JOIN public.profiles p ON u.id = p.id
     WHERE p.id IS NULL)::text as count;

-- Show all profiles
SELECT id, email, full_name, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
