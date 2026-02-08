-- Remove Almacen Categories
delete from categories where name in ('Almacén', 'Lácteos', 'Panadería', 'Limpieza');

-- Seed Polirrubro Categories
insert into categories (name) values
  ('Librería'),
  ('Tecnología'),
  ('Regalería'),
  ('Bazar'),
  ('Impresiones'),
  ('Carga Virtual')
on conflict (name) do nothing;
