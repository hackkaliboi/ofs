-- Add function to get table information
begin;

-- Create a function to get table information
create or replace function public.get_table_info(table_name text)
returns jsonb
language plpgsql
security definer
as $$
declare
  result jsonb;
begin
  select 
    jsonb_build_object(
      'exists', (select exists (
        select 1 from information_schema.tables 
        where table_schema = 'public' 
        and table_name = get_table_info.table_name
      )),
      'columns', (
        select jsonb_agg(
          jsonb_build_object(
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable
          )
        )
        from information_schema.columns
        where table_schema = 'public'
        and table_name = get_table_info.table_name
      )
    ) into result;
    
  return result;
end;
$$;

-- Grant access to the function
grant execute on function public.get_table_info(text) to authenticated;
grant execute on function public.get_table_info(text) to anon;
grant execute on function public.get_table_info(text) to service_role;

commit;
