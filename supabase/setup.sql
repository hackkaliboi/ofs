-- Run all migrations in order
\i 'migrations/20250324_wallet_validations.sql'
\i 'migrations/20250324_triggers.sql'

-- After running migrations, check for your user and make them admin
SELECT 
    au.id as user_id,
    au.email,
    p.full_name,
    p.role
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- Uncomment and replace YOUR_USER_ID with your ID from above query
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
