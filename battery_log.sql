create table battery_logs (
  id uuid default gen_random_uuid() primary key,
  timestamp timestamptz not null,
  battery_percent integer
);