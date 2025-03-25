-- This query will show all users and their roles
SELECT 
    au.id as user_id,
    au.email,
    p.full_name,
    p.role
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- After finding your user ID, run this to make yourself an admin
-- Replace YOUR_USER_ID with the actual ID from the query above
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
