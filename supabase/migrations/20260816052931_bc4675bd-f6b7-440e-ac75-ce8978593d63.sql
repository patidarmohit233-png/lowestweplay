create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  author text default 'Lowest Weplay Team',
  published_at timestamp with time zone default now(),
  category text,
  image_url text,
  tags text[]
);

grant select on public.blog_posts to anon;
grant select on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;

alter table public.blog_posts enable row level security;

create policy "Anyone can view published blog posts" on public.blog_posts
  for select
  using (published_at <= now());
