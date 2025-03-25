# OFSLEDGER Database Setup Guide

## One-Step Database Setup

### Running the Setup Script
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the entire contents of `setup_complete.sql`
6. Click "Run" or press Ctrl+Enter

## Admin Account Details
After running the script, you can log in with:
- Email: generalprep.ig@gmail.com
- Temporary Password: OFSLedger2025!

⚠️ **IMPORTANT**: Change your password immediately after first login!

## What the Script Sets Up

1. Base Tables:
   - Profiles
   - Wallets
   - Wallet Validations

2. Security Features:
   - Security Events Logging
   - User Activity Tracking
   - Two-Factor Authentication Support

3. Advanced Features:
   - Validation History
   - Validation Statistics
   - Automated Triggers

4. Admin Features:
   - Admin User Creation
   - Role Management
   - User Management

## Verification Steps

After running the script, verify your setup:

```sql
SELECT 
    au.id,
    au.email,
    p.full_name,
    p.role,
    p.status
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'generalprep.ig@gmail.com';
```

## Troubleshooting

If you encounter any errors:

1. Check the error message in the SQL Editor
2. Make sure no conflicting tables exist
3. If needed, you can reset by dropping all tables:
   ```sql
   -- Only use in development!
   DROP TABLE IF EXISTS 
     profiles,
     wallets,
     wallet_validations,
     security_events,
     validation_history,
     validation_statistics CASCADE;
   ```

## Security Notes

1. Change the admin password immediately after first login
2. Enable two-factor authentication for added security
3. Regularly monitor the security_events and user_activity_log tables
4. Keep your database credentials and environment variables secure

## Next Steps

After successful setup:

1. Log in to the application
2. Update your admin profile
3. Configure email settings
4. Set up any additional security policies
5. Create test validations to verify functionality
