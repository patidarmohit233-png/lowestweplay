-- Add status and scheduled_at columns to blog_posts
alter table public.blog_posts 
add column if not exists status text default 'draft' check (status in ('draft', 'scheduled', 'published')),
add column if not exists scheduled_at timestamp with time zone;

-- Update the RLS policy to include scheduled status
drop policy if exists "Anyone can view published blog posts" on public.blog_posts;

create policy "Anyone can view published blog posts" on public.blog_posts
  for select
  using (
    (status = 'published' and published_at <= now()) or 
    (status = 'scheduled' and scheduled_at <= now())
  );

grant select, insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
