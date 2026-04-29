-- =============================================================
-- KaySid — Seed Data (Done Inisyal)
-- Koule sa yo apre schema.sql
-- =============================================================

-- Lokalizasyon yo
INSERT INTO locations (department, commune, neighborhood) VALUES
  -- ===================== SUD =====================
  ('Sud',        'Okay',             NULL),
  ('Sud',        'Okay',             'Fonfrè'),
  ('Sud',        'Okay',             'Latiboliè'),
  ('Sud',        'Okay',             'Vil'),
  ('Sud',        'Okay',             'Kay Myèl'),
  ('Sud',        'Okay',             'Bòs Casimir'),
  ('Sud',        'Okay',             'Nan Flèch'),
  ('Sud',        'Okay',             'Rivyè Glase'),
  ('Sud',        'Port-Salut',       NULL),
  ('Sud',        'Port-Salut',       'Sant Vil'),
  ('Sud',        'Port-Salut',       'Bò Lanmè'),
  ('Sud',        'Sen Lwi du Sid',   NULL),
  ('Sud',        'Sen Lwi du Sid',   'Vil'),
  ('Sud',        'Torbèk',           NULL),
  ('Sud',        'Chardonnières',    NULL),
  ('Sud',        'Cavaillon',        NULL),
  ('Sud',        'Akwè',             NULL),
  ('Sud',        'Tiburon',          NULL),
  ('Sud',        'Kan Perin',        NULL),
  ('Sud',        'Manich',           NULL),
  ('Sud',        'Koto',             NULL),
  ('Sud',        'Sen Jan du Sid',   NULL),
  ('Sud',        'Zannglè',          NULL),
  ('Sud',        'Il a Vach',        NULL),
  ('Sud',        'Anikyè',           NULL),
  ('Sud',        'Roch a Bato',      NULL),
  ('Sud',        'Pò-a-Piman',       NULL),
  -- ===================== SUD-EST =====================
  ('Sud-Est',    'Jakmèl',           NULL),
  ('Sud-Est',    'Jakmèl',           'Fond Kabès'),
  ('Sud-Est',    'Jakmèl',           'La Gossline'),
  ('Sud-Est',    'Jakmèl',           'Gwo Mòn'),
  ('Sud-Est',    'Jakmèl',           'Bèl Anz'),
  ('Sud-Est',    'Kay Jakmèl',       NULL),
  ('Sud-Est',    'La Vale',          NULL),
  ('Sud-Est',    'Benet',            NULL),
  ('Sud-Est',    'Bèl Anz',          NULL),
  ('Sud-Est',    'Kot de Fè',        NULL),
  ('Sud-Est',    'Tiòt',             NULL),
  ('Sud-Est',    'Anz-a-Pit',        NULL),
  ('Sud-Est',    'Gran Gozye',       NULL),
  ('Sud-Est',    'Mori',             NULL),
  -- ===================== NIPPES =====================
  ('Nippes',     'Miragoàn',         NULL),
  ('Nippes',     'Miragoàn',         'Vil'),
  ('Nippes',     'Anz-a-Vo',         NULL),
  ('Nippes',     'Pti Riv Nip',      NULL),
  ('Nippes',     'Baradè',           NULL),
  ('Nippes',     'Rano',             NULL),
  ('Nippes',     'Plezans du Sid',   NULL),
  ('Nippes',     'Fon Nèg',          NULL),
  ('Nippes',     'Gran Boukan',      NULL),
  ('Nippes',     'Payan',            NULL),
  ('Nippes',     'Pti Trou Nip',     NULL),
  ('Nippes',     'Lazil',            NULL),
  -- ===================== GRAND ANZ =====================
  ('Grand Anz',  'Jeremi',           NULL),
  ('Grand Anz',  'Jeremi',           'Vil'),
  ('Grand Anz',  'Jeremi',           'Nan Sab'),
  ('Grand Anz',  'Jeremi',           'Bò Lanmè'),
  ('Grand Anz',  'Anz Eno',          NULL),
  ('Grand Anz',  'Dam Mari',         NULL),
  ('Grand Anz',  'Bonbon',           NULL),
  ('Grand Anz',  'Korày',            NULL),
  ('Grand Anz',  'Pestel',           NULL),
  ('Grand Anz',  'Moron',            NULL),
  ('Grand Anz',  'Bòmò',             NULL),
  ('Grand Anz',  'Rouzo',            NULL),
  ('Grand Anz',  'Abrikò',           NULL),
  ('Grand Anz',  'Irwa',             NULL),
  ('Grand Anz',  'Chanbelan',        NULL)
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
