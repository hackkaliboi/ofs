-- Enable realtime for the database
begin;

-- Create the publication if it doesn't exist
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;
end $$;

-- Check if user_activity_log table exists and create it if it doesn't
do $$
begin
  if not exists (
    select 1 from information_schema.tables 
    where table_schema = 'public' and table_name = 'user_activity_log'
  ) then
    create table public.user_activity_log (
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references auth.users(id) on delete cascade,
      activity_type text not null,
      description text not null,
      metadata jsonb,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );
    
    -- Add RLS policies
    alter table public.user_activity_log enable row level security;
    
    create policy "Users can view their own activity logs"
      on public.user_activity_log for select
      using (auth.uid() = user_id);
      
    create policy "Users can insert their own activity logs"
      on public.user_activity_log for insert
      with check (auth.uid() = user_id);
      
    create policy "Admins can view all activity logs"
      on public.user_activity_log for select
      using (
        exists (
          select 1 from public.profiles
          where profiles.id = auth.uid() and profiles.role = 'admin'
        )
      );
  end if;
end $$;

-- Add tables to the publication (only if they're not already members)
do $$
declare
  current_table text;
  tables text[] := array['kyc_verifications', 'withdrawals', 'profiles', 'user_activity_log'];
begin
  foreach current_table in array tables
  loop
    if not exists (
      select 1 from pg_publication_tables 
      where pubname = 'supabase_realtime' 
      and schemaname = 'public' 
      and tablename = current_table
    ) then
      -- Check if the table exists before adding it to the publication
      if exists (
        select 1 from information_schema.tables 
        where table_schema = 'public' and table_name = current_table
      ) then
        execute format('alter publication supabase_realtime add table public.%I', current_table);
      else
        raise notice 'Table %.% does not exist, skipping', 'public', current_table;
      end if;
    end if;
  end loop;
end $$;

-- Enable replication on tables (this is idempotent so we can run it multiple times)
do $$
declare
  current_table text;
  tables text[] := array['kyc_verifications', 'withdrawals', 'profiles', 'user_activity_log'];
begin
  foreach current_table in array tables
  loop
    -- Check if the table exists before enabling replication
    if exists (
      select 1 from information_schema.tables 
      where table_schema = 'public' and table_name = current_table
    ) then
      execute format('alter table public.%I replica identity full', current_table);
    else
      raise notice 'Table %.% does not exist, skipping replica identity', 'public', current_table;
    end if;
  end loop;
end $$;

commit;
