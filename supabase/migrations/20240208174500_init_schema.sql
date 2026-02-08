-- Create Products Table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  barcode text,
  description text,
  cost_price numeric default 0,
  sale_price numeric default 0,
  stock integer default 0,
  min_stock integer,
  category_id integer,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Sales Table
create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  total_amount numeric not null,
  payment_method text check (payment_method in ('CASH', 'DEBIT', 'CREDIT', 'TRANSFER', 'OTHER')),
  status text check (status in ('COMPLETED', 'CANCELLED', 'PENDING')) default 'COMPLETED',
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Sale Items Table
create table if not exists sale_items (
  id uuid default gen_random_uuid() primary key,
  sale_id uuid references sales(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  unit_price numeric not null,
  subtotal numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table products enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;

-- Policies for Products
create policy "Enable read access for all users" on products for select using (true);
create policy "Enable insert for authenticated users only" on products for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on products for update using (auth.role() = 'authenticated');
create policy "Enable delete for authenticated users only" on products for delete using (auth.role() = 'authenticated');

-- Policies for Sales
create policy "Enable read access for authenticated users only" on sales for select using (auth.role() = 'authenticated');
create policy "Enable insert for authenticated users only" on sales for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on sales for update using (auth.role() = 'authenticated');

-- Policies for Sale Items
create policy "Enable read access for authenticated users only" on sale_items for select using (auth.role() = 'authenticated');
create policy "Enable insert for authenticated users only" on sale_items for insert with check (auth.role() = 'authenticated');
create policy "Enable update for authenticated users only" on sale_items for update using (auth.role() = 'authenticated');
