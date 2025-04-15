-- Create a function that admins can use to get all wallet details
-- This function bypasses RLS policies by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION get_all_wallet_details_admin()
RETURNS SETOF wallet_details
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator
AS $$
BEGIN
  -- Check if the current user is an admin
  IF EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ) THEN
    -- Return all wallet details if user is admin
    RETURN QUERY SELECT * FROM wallet_details ORDER BY created_at DESC;
  ELSE
    -- Return only the user's own wallet details if not admin
    RETURN QUERY SELECT * FROM wallet_details WHERE user_id = auth.uid() ORDER BY created_at DESC;
  END IF;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION get_all_wallet_details_admin() TO authenticated;

-- Create a similar function for wallet detail statistics
CREATE OR REPLACE FUNCTION get_wallet_detail_stats_admin()
RETURNS TABLE (
  total bigint,
  pending bigint,
  approved bigint,
  rejected bigint,
  today_submissions bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_date date := current_date;
BEGIN
  -- Check if the current user is an admin
  IF EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.user_id = auth.uid()
  ) THEN
    -- Return stats for all wallet details if user is admin
    RETURN QUERY 
    SELECT 
      COUNT(*)::bigint as total,
      COUNT(*) FILTER (WHERE status = 'pending')::bigint as pending,
      COUNT(*) FILTER (WHERE status = 'approved')::bigint as approved,
      COUNT(*) FILTER (WHERE status = 'rejected')::bigint as rejected,
      COUNT(*) FILTER (WHERE created_at::date = today_date)::bigint as today_submissions
    FROM wallet_details;
  ELSE
    -- Return zeros if not admin
    RETURN QUERY SELECT 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint;
  END IF;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION get_wallet_detail_stats_admin() TO authenticated;
