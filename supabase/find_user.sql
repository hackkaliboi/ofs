-- Find recently created users
SELECT 
    au.id,
    au.email,
    p.full_name,
    p.role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 5;

-- After you find your user ID, run this to make yourself admin:
-- UPDATE public.profiles 
-- SET role = 'admin'
-- WHERE id = 'YOUR-USER-ID-HERE';
