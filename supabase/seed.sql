-- =============================================================
-- KaySid — Seed Data (Done Inisyal)
-- Koule sa yo apre schema.sql
-- =============================================================

-- Lokalizasyon yo
INSERT INTO locations (department, commune, neighborhood) VALUES
  ('Sud',     'Okay',           NULL),
  ('Sud',     'Okay',           'Fonfrè'),
  ('Sud',     'Okay',           'Latiboliè'),
  ('Sud',     'Okay',           'Vil'),
  ('Sud',     'Okay',           'Kay Myèl'),
  ('Sud',     'Okay',           'Bòs Casimir'),
  ('Sud',     'Okay',           'Nan Flèch'),
  ('Sud',     'Port-Salut',     NULL),
  ('Sud',     'Port-Salut',     'Sant Vil'),
  ('Sud',     'Port-Salut',     'Bò Lanmè'),
  ('Sud',     'Sen Lwi du Sid', NULL),
  ('Sud',     'Sen Lwi du Sid', 'Vil'),
  ('Sud',     'Torbèk',         NULL),
  ('Sud',     'Chardonnières',  NULL),
  ('Sud',     'Cavaillon',      NULL),
  ('Sud',     'Akòy',           NULL),
  ('Sud',     'Tiburon',        NULL),
  ('Sud-Est', 'Jakmèl',         NULL),
  ('Sud-Est', 'Jakmèl',         'Fond Kabès'),
  ('Sud-Est', 'Jakmèl',         'Bèlans'),
  ('Sud-Est', 'Jakmèl',         'La Gossline'),
  ('Sud-Est', 'Jakmèl',         'Gwo Mòn'),
  ('Sud-Est', 'Bèlans',         NULL),
  ('Sud-Est', 'Mori',           NULL),
  ('Nippes',  'Jeremi',         NULL),
  ('Nippes',  'Jeremi',         'Vil'),
  ('Nippes',  'Jeremi',         'Baradè'),
  ('Nippes',  'Miragoàn',       NULL),
  ('Nippes',  'Miragoàn',       'Vil'),
  ('Nippes',  'Anse-à-Veau',    NULL)
ON CONFLICT DO NOTHING;

-- =============================================================
-- Supabase Storage Bucket pou foto kay
-- Koule sa nan SQL editor OU kreye manyèlman nan Dashboard
-- =============================================================

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'property-photos',
--   'property-photos',
--   true,
--   5242880,  -- 5MB
--   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
-- );

-- Storage policies
-- CREATE POLICY "photos_public_read"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'property-photos');

-- CREATE POLICY "photos_auth_upload"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'property-photos'
--     AND auth.uid() IS NOT NULL
--   );

-- CREATE POLICY "photos_owner_delete"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'property-photos'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );
