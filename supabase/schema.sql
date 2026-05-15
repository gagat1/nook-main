create table if not exists public.shift_employees (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.shift_templates (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.leave_requests (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.scheduled_shifts (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_income (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_expenses (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_shift_employees on public.shift_employees;
create trigger set_updated_at_shift_employees
before update on public.shift_employees
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_shift_templates on public.shift_templates;
create trigger set_updated_at_shift_templates
before update on public.shift_templates
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_leave_requests on public.leave_requests;
create trigger set_updated_at_leave_requests
before update on public.leave_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_scheduled_shifts on public.scheduled_shifts;
create trigger set_updated_at_scheduled_shifts
before update on public.scheduled_shifts
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_app_settings on public.app_settings;
create trigger set_updated_at_app_settings
before update on public.app_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_finance_income on public.finance_income;
create trigger set_updated_at_finance_income
before update on public.finance_income
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_finance_expenses on public.finance_expenses;
create trigger set_updated_at_finance_expenses
before update on public.finance_expenses
for each row execute function public.set_updated_at();

alter table public.shift_employees enable row level security;
alter table public.shift_templates enable row level security;
alter table public.leave_requests enable row level security;
alter table public.scheduled_shifts enable row level security;
alter table public.app_settings enable row level security;
alter table public.finance_income enable row level security;
alter table public.finance_expenses enable row level security;

drop policy if exists "anon can manage shift employees" on public.shift_employees;
create policy "anon can manage shift employees" on public.shift_employees
for all using (true) with check (true);

drop policy if exists "anon can manage shift templates" on public.shift_templates;
create policy "anon can manage shift templates" on public.shift_templates
for all using (true) with check (true);

drop policy if exists "anon can manage leave requests" on public.leave_requests;
create policy "anon can manage leave requests" on public.leave_requests
for all using (true) with check (true);

drop policy if exists "anon can manage scheduled shifts" on public.scheduled_shifts;
create policy "anon can manage scheduled shifts" on public.scheduled_shifts
for all using (true) with check (true);

drop policy if exists "anon can manage app settings" on public.app_settings;
create policy "anon can manage app settings" on public.app_settings
for all using (true) with check (true);

drop policy if exists "anon can manage finance income" on public.finance_income;
create policy "anon can manage finance income" on public.finance_income
for all using (true) with check (true);

drop policy if exists "anon can manage finance expenses" on public.finance_expenses;
create policy "anon can manage finance expenses" on public.finance_expenses
for all using (true) with check (true);
