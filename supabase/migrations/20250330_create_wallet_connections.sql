-- First transaction: Create table, indexes, and policies
begin;

-- Drop existing table and recreate
drop table if exists public.wallet_connections cascade;

-- Create wallet_connections table
create table public.wallet_connections (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    wallet_address text not null,
    chain_type text not null,
    connected_at timestamp with time zone default now() not null,
    created_at timestamp with time zone default now() not null
);

-- Create indexes
create index wallet_connections_user_id_idx 
    on public.wallet_connections(user_id);

create index wallet_connections_connected_at_idx 
    on public.wallet_connections(connected_at);

-- Enable row level security
alter table public.wallet_connections enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own wallet connections" on public.wallet_connections;
drop policy if exists "Users can insert own wallet connections" on public.wallet_connections;
drop policy if exists "Admins can view all wallet connections" on public.wallet_connections;

-- Create policies
create policy "Users can view own wallet connections"
    on public.wallet_connections
    for select
    using (auth.uid() = user_id);

create policy "Users can insert own wallet connections"
    on public.wallet_connections
    for insert
    with check (auth.uid() = user_id);

create policy "Admins can view all wallet connections"
    on public.wallet_connections
    for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

commit;

-- Second transaction: Enable realtime
begin;

-- Enable realtime for the table
alter publication supabase_realtime add table public.wallet_connections;

commit;
