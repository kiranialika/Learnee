create table if not exists public.material_admins (
  email text primary key
);

create table if not exists public.material_teachers (
  email text primary key
);

alter table public.materials
  add column if not exists title text not null default '',
  add column if not exists subj text not null default '',
  add column if not exists kind text not null default 'Ringkasan materi',
  add column if not exists body text not null default '',
  add column if not exists file_name text not null default '',
  add column if not exists file_size bigint not null default 0,
  add column if not exists storage_path text,
  add column if not exists created_by text,
  add column if not exists teacher text,
  add column if not exists status text not null default 'pending',
  add column if not exists note text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.material_admins enable row level security;
alter table public.material_teachers enable row level security;
revoke all on public.material_admins from public, anon, authenticated;
revoke all on public.material_teachers from anon, authenticated;

-- After running this file, add the admin's Firebase email:
-- insert into public.material_admins (email)
-- values ('admin@example.com')
-- on conflict do nothing;

create or replace function public.is_material_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.material_admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

create or replace function public.is_material_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.material_teachers
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_material_admin() from public;
revoke all on function public.is_material_teacher() from public;
grant execute on function public.is_material_admin() to anon, authenticated;
grant execute on function public.is_material_teacher() to anon, authenticated;

grant select, insert, update, delete on public.materials to anon, authenticated;
grant select, insert, update, delete on public.material_teachers to anon, authenticated;
alter table public.materials enable row level security;

update storage.buckets
set public = false,
    file_size_limit = 26214400,
    allowed_mime_types = array['application/pdf']
where id = 'materials';

do $$
declare
  materials_id_sequence text;
begin
  materials_id_sequence := pg_get_serial_sequence('public.materials', 'id');
  if materials_id_sequence is not null then
    execute format('grant usage on sequence %s to anon, authenticated', materials_id_sequence);
  end if;
end
$$;

drop policy if exists "Admins can manage verified teachers" on public.material_teachers;
create policy "Admins can manage verified teachers"
on public.material_teachers
for all
to anon, authenticated
using (public.is_material_admin())
with check (public.is_material_admin());

drop policy if exists "Public can read published materials" on public.materials;
drop policy if exists "Read published and authorized materials" on public.materials;
drop policy if exists "Admins can insert materials" on public.materials;
drop policy if exists "Verified teachers can submit pending materials" on public.materials;
drop policy if exists "Admins and teachers can update materials" on public.materials;
drop policy if exists "Admins and teachers can delete materials" on public.materials;

create policy "Read published and authorized materials"
on public.materials
for select
to anon, authenticated
using (
  status = 'published'
  or public.is_material_admin()
  or (
    public.is_material_teacher()
    and created_by = (auth.jwt() ->> 'sub')
  )
);

create policy "Admins can insert materials"
on public.materials
for insert
to anon, authenticated
with check (public.is_material_admin());

create policy "Verified teachers can submit pending materials"
on public.materials
for insert
to anon, authenticated
with check (
  public.is_material_teacher()
  and created_by = (auth.jwt() ->> 'sub')
  and status = 'pending'
);

create policy "Admins and teachers can update materials"
on public.materials
for update
to anon, authenticated
using (
  public.is_material_admin()
  or (
    public.is_material_teacher()
    and created_by = (auth.jwt() ->> 'sub')
    and status = 'pending'
  )
)
with check (
  public.is_material_admin()
  or (
    public.is_material_teacher()
    and created_by = (auth.jwt() ->> 'sub')
    and status = 'pending'
  )
);

create policy "Admins and teachers can delete materials"
on public.materials
for delete
to anon, authenticated
using (
  public.is_material_admin()
  or (
    public.is_material_teacher()
    and created_by = (auth.jwt() ->> 'sub')
    and status = 'pending'
  )
);

drop policy if exists "Public can read published material files" on storage.objects;
drop policy if exists "Read published and authorized material files" on storage.objects;
drop policy if exists "Admins and verified teachers can upload material files" on storage.objects;
drop policy if exists "Admins and owners can delete material files" on storage.objects;

create policy "Read published and authorized material files"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'materials'
  and (
    public.is_material_admin()
    or (
      public.is_material_teacher()
        and name like ('teacher/' || (auth.jwt() ->> 'sub') || '/%')
    )
    or exists (
      select 1
      from public.materials
      where storage_path = storage.objects.name
        and status = 'published'
    )
  )
);

create policy "Admins and verified teachers can upload material files"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'materials'
  and (
    public.is_material_admin()
    or (
      public.is_material_teacher()
      and name like ('teacher/' || (auth.jwt() ->> 'sub') || '/%')
    )
  )
);

create policy "Admins and owners can delete material files"
on storage.objects
for delete
to anon, authenticated
using (
  bucket_id = 'materials'
  and (
    public.is_material_admin()
    or (
      public.is_material_teacher()
      and name like ('teacher/' || (auth.jwt() ->> 'sub') || '/%')
    )
  )
);
