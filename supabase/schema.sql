-- =============================================================
-- KaySid — Schema PostgreSQL (Supabase)
-- Platfòm imobilye pou Sid Ayiti
--
-- Lòd ekzekisyon:
--   1. schema.sql  ← fichye sa a
--   2. seed.sql    ← done inisyal (lokalizasyon yo)
--
-- Règ jeneral:
--   • UUID  → kle prensipal pou itilizatè ak pwopriyete (sekirite)
--   • INT IDENTITY → kle prensipal pou tab referenciel (lokalizasyon, foto, elatriye)
--   • Tout chanjman statik pwopriyete yo fèt via service role (bypasse RLS)
--   • Admin yo idantifye pa profiles.role = 'admin'
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- FONKSYON UTILITÈ (kreye anvan trigger yo)
-- =============================================================

-- Increment view_count atomiquement (safe pou concurrent requests)
CREATE OR REPLACE FUNCTION increment_view_count(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties SET view_count = view_count + 1 WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment contact_count atomiquement
CREATE OR REPLACE FUNCTION increment_contact_count(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties SET contact_count = contact_count + 1 WHERE id = property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mete updated_at ajou otomatikman sou chak UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- TABLE: profiles
-- Yon sèl ranje pou chak itilizatè Supabase Auth.
-- Kreye otomatikman via trigger on_auth_user_created.
-- =============================================================
CREATE TABLE profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,                              -- Kopi email Auth (pratik pou rechèch admin)
  phone         TEXT,                              -- Nimewo telefòn (opsyonèl)
  full_name     TEXT        NOT NULL DEFAULT '',
  avatar_url    TEXT,                              -- URL foto pwofil
  role          TEXT        NOT NULL DEFAULT 'tenant'
                            CHECK (role IN (
                              'tenant',            -- Lokatè / chèchè kay
                              'owner',             -- Mèt kay
                              'agent',             -- Ajan imobilye
                              'admin'              -- Administratè platfòm
                            )),
  is_verified   BOOLEAN     NOT NULL DEFAULT false, -- Kont verifye pa admin
  is_premium    BOOLEAN     NOT NULL DEFAULT false, -- Abònman peye (fiti)
  whatsapp      TEXT,                              -- Nimewo WhatsApp pou kontakte
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  profiles                IS 'Pwofil itilizatè — estansyon pou auth.users Supabase';
COMMENT ON COLUMN profiles.role           IS 'tenant | owner | agent | admin';
COMMENT ON COLUMN profiles.is_verified    IS 'true = admin verifye idantite moun nan';
COMMENT ON COLUMN profiles.is_premium     IS 'true = abònman peye aktif';
COMMENT ON COLUMN profiles.whatsapp       IS 'Nimewo WhatsApp san espas, egzanp: +50934567890';

-- Trigger: kreye profil otomatikman lè yon itilizatè enskri
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- TABLE: locations
-- Jeografi Sid Ayiti — depatman, komin, katye.
-- Popile via seed.sql. properties.location_id refere isi.
-- =============================================================
CREATE TABLE locations (
  id            INT         GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  department    TEXT        NOT NULL,              -- Depatman (Sud, Sud-Est, Nippes, Grand Anz)
  commune       TEXT        NOT NULL,              -- Komin (Okay, Jakmèl, Port-Salut...)
  neighborhood  TEXT,                              -- Katye (NULL = tout komin an)
  UNIQUE (commune, neighborhood)
);

COMMENT ON TABLE  locations              IS 'Jeografi Sid Ayiti. NULL neighborhood = nivo komin an antye';
COMMENT ON COLUMN locations.department  IS 'Sud | Sud-Est | Nippes | Grand Anz';
COMMENT ON COLUMN locations.commune     IS 'Non komin an jan li ekri nan UI a (egzanp: Okay, Jakmèl)';
COMMENT ON COLUMN locations.neighborhood IS 'Katye/seksyon. NULL si anons la pou tout komin an';

-- =============================================================
-- TABLE: properties
-- Kè platfòm nan — tout anons imobilye yo.
-- UUID pou sekirite (evite enumerasyon nan URL).
-- =============================================================
CREATE TABLE properties (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id     INT         NOT NULL REFERENCES locations(id),

  -- Deskripsyon
  title           TEXT        NOT NULL CHECK (char_length(title) BETWEEN 5 AND 150),
  description     TEXT        CHECK (char_length(description) <= 2000),
  property_type   TEXT        NOT NULL
                              CHECK (property_type IN (
                                'chambrette',    -- Chanm pou lwaye
                                'studio',        -- Studio (yon sèl pyes)
                                'appartement',   -- Apatman
                                'kay_2_chanm',   -- Kay 2 chanm
                                'kay_3_chanm',   -- Kay 3 chanm
                                'kay_4_chanm',   -- Kay 4 chanm oswa plis
                                'te',            -- Terin
                                'villa'          -- Villa
                              )),
  listing_type    TEXT        NOT NULL DEFAULT 'rent'
                              CHECK (listing_type IN (
                                'rent',          -- Pou lwaye sèlman
                                'sale',          -- Pou vann sèlman
                                'both'           -- Lwaye oswa vann
                              )),

  -- Pri (omwen youn dwe gen valè selon listing_type)
  price_monthly   NUMERIC(12,2) CHECK (price_monthly IS NULL OR price_monthly >= 0),
  price_sale      NUMERIC(14,2) CHECK (price_sale    IS NULL OR price_sale    >= 0),
  currency        TEXT        NOT NULL DEFAULT 'USD'
                              CHECK (currency IN ('USD', 'HTG')),

  -- Karakteristik fizik
  bedrooms        SMALLINT    NOT NULL DEFAULT 0  CHECK (bedrooms  >= 0),
  bathrooms       SMALLINT    NOT NULL DEFAULT 0  CHECK (bathrooms >= 0),
  area_sqm        NUMERIC(8,2)         CHECK (area_sqm IS NULL OR area_sqm > 0),

  -- Sèvis disponib
  is_furnished    BOOLEAN     NOT NULL DEFAULT false,
  has_water       BOOLEAN     NOT NULL DEFAULT true,
  has_electricity BOOLEAN     NOT NULL DEFAULT true,
  has_generator   BOOLEAN     NOT NULL DEFAULT false,
  has_parking     BOOLEAN     NOT NULL DEFAULT false,
  has_internet    BOOLEAN     NOT NULL DEFAULT false,

  -- Moderation ak statik
  status          TEXT        NOT NULL DEFAULT 'pending_review'
                              CHECK (status IN (
                                'pending_review', -- Tann apwobasyon admin
                                'active',         -- Vizib pou tout moun
                                'rented',         -- Lwaye deja (pa vizib)
                                'sold',           -- Vann deja (pa vizib)
                                'suspended'       -- Bloke pa admin (5+ rapò)
                              )),
  is_featured     BOOLEAN     NOT NULL DEFAULT false, -- Anons mete an avant (peye)
  report_count    SMALLINT    NOT NULL DEFAULT 0,     -- Konte rapò — otomatik via trigger

  -- Analytik (mete ajou via trigger / API)
  view_count      INT         NOT NULL DEFAULT 0,
  contact_count   INT         NOT NULL DEFAULT 0,

  -- Adres detaye ak kòdòne GPS (opsyonèl)
  address_text    TEXT,
  latitude        NUMERIC(10,8),
  longitude       NUMERIC(11,8),

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  properties                IS 'Tout anons imobilye platfòm nan';
COMMENT ON COLUMN properties.owner_id       IS 'Mèt anons lan — FK → profiles.id';
COMMENT ON COLUMN properties.location_id    IS 'Lokalizasyon — FK → locations.id';
COMMENT ON COLUMN properties.status         IS 'pending_review → active → rented/sold/suspended';
COMMENT ON COLUMN properties.is_featured    IS 'Anons peye ki parèt anvan lòt yo';
COMMENT ON COLUMN properties.report_count   IS 'Inkremente otomatikman. >= 5 → suspended via trigger';
COMMENT ON COLUMN properties.view_count     IS 'Inkremente via /api/properties/[id]/view';
COMMENT ON COLUMN properties.contact_count  IS 'Inkremente otomatikman lè yon contact_request kreye';
COMMENT ON COLUMN properties.currency       IS 'USD (dola ameriken) | HTG (goud ayisyen)';

-- Trigger: mete updated_at ajou sou chak modifikasyon
CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- TABLE: property_photos
-- Foto pwopriyete yo — stoke sou Cloudflare R2.
-- Youn sèlman ka gen is_cover = true (constraint unique partiel).
-- =============================================================
CREATE TABLE property_photos (
  id              INT         GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  property_id     UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url             TEXT        NOT NULL,            -- URL piblik Cloudflare R2
  r2_key          TEXT,                            -- Kle objè R2 (pou efase foto nan bucket)
  is_cover        BOOLEAN     NOT NULL DEFAULT false,
  display_order   SMALLINT    NOT NULL DEFAULT 0,  -- Lòd afichaj (0 = premye)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  property_photos             IS 'Foto pwopriyete — max 10 foto, 1 sèl kouvet';
COMMENT ON COLUMN property_photos.url         IS 'URL piblik R2, egzanp: https://pub-xxx.r2.dev/key';
COMMENT ON COLUMN property_photos.r2_key      IS 'Kle pou efase objè nan R2 bucket la';
COMMENT ON COLUMN property_photos.is_cover    IS 'true = foto ki parèt nan kart la. Youn sèlman pa pwopriyete';
COMMENT ON COLUMN property_photos.display_order IS '0 = premye foto nan galri';

-- Garanti: yon sèl foto kouvet pou chak pwopriyete
CREATE UNIQUE INDEX unique_cover_photo
  ON property_photos (property_id)
  WHERE is_cover = true;

-- =============================================================
-- TABLE: favorites
-- Kay ke yon itilizatè sove pou wè pita.
-- Kle konpoze (user_id + property_id) — pa gen duplikat.
-- =============================================================
CREATE TABLE favorites (
  user_id         UUID        NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  property_id     UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  saved_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);

COMMENT ON TABLE favorites IS 'Anons ke yon itilizatè sove. Efase otomatikman si profil oswa pwopriyete efase';

-- =============================================================
-- TABLE: contact_requests
-- Chak fwa yon moun klike "Kontakte via WhatsApp".
-- Itilize pou analytics ak pou prévenir spam.
-- =============================================================
CREATE TABLE contact_requests (
  id              INT         GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  property_id     UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  requester_id    UUID        REFERENCES profiles(id) ON DELETE SET NULL, -- NULL si pa konekte
  requester_ip    TEXT,                            -- IP pou détekte spam (opsyonèl)
  contact_method  TEXT        NOT NULL DEFAULT 'whatsapp'
                              CHECK (contact_method IN ('whatsapp', 'call', 'email')),
  message         TEXT,                            -- Mesaj pré-ranpli (opsyonèl)
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  contact_requests                 IS 'Suivi chak kontakt WhatsApp — analytics ak anti-spam';
COMMENT ON COLUMN contact_requests.requester_id    IS 'NULL si itilizatè pa konekte';
COMMENT ON COLUMN contact_requests.requester_ip    IS 'Pou détekte spam (opsyonèl, respekte RGPD)';

-- Trigger: inkremente properties.contact_count otomatikman
CREATE OR REPLACE FUNCTION increment_contact_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties
  SET contact_count = contact_count + 1
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_contact_request
  AFTER INSERT ON contact_requests
  FOR EACH ROW EXECUTE FUNCTION increment_contact_count();

-- =============================================================
-- TABLE: reports
-- Moun ka siyal yon anons ki fo, fòk pri mal, oswa eskwok.
-- 5 rapò oswa plis → pwopriyete a sipann otomatikman.
-- =============================================================
CREATE TABLE reports (
  id              INT         GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  property_id     UUID        NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reporter_id     UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  reason          TEXT        NOT NULL
                              CHECK (reason IN (
                                'fake_listing',    -- Anons fo / pa egziste
                                'wrong_price',     -- Pri pa kòrèk
                                'wrong_location',  -- Adrès pa bon
                                'scam',            -- Eskwok / fwod
                                'duplicate',       -- Anons en double
                                'other'            -- Lòt rezon
                              )),
  details         TEXT,                            -- Eksplikasyon siplemantè
  status          TEXT        NOT NULL DEFAULT 'open'
                              CHECK (status IN (
                                'open',            -- Tann revizyon admin
                                'resolved',        -- Admin rezoud pwoblèm nan
                                'dismissed'        -- Admin rejte rapò a (pa valid)
                              )),
  reviewed_by     UUID        REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  reports             IS '5 rapò oswa plis → pwopriyete a sipann otomatikman via trigger';
COMMENT ON COLUMN reports.reason      IS 'Rezon rapò a — chwazi nan yon lis fiks';
COMMENT ON COLUMN reports.reviewed_by IS 'Admin ki egzamine rapò a — FK → profiles.id';

-- Trigger: inkremente report_count epi sipann pwopriyete si >= 5 rapò
CREATE OR REPLACE FUNCTION handle_new_report()
RETURNS TRIGGER AS $$
DECLARE
  current_count INT;
BEGIN
  UPDATE properties
  SET report_count = report_count + 1
  WHERE id = NEW.property_id
  RETURNING report_count INTO current_count;

  IF current_count >= 5 THEN
    UPDATE properties
    SET status = 'suspended'
    WHERE id = NEW.property_id AND status = 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_report_created
  AFTER INSERT ON reports
  FOR EACH ROW EXECUTE FUNCTION handle_new_report();

-- =============================================================
-- INDEX pou vitès rechèch
-- =============================================================
CREATE INDEX idx_properties_location   ON properties(location_id);
CREATE INDEX idx_properties_type       ON properties(property_type);
CREATE INDEX idx_properties_status     ON properties(status);
CREATE INDEX idx_properties_price_mwa  ON properties(price_monthly) WHERE price_monthly IS NOT NULL;
CREATE INDEX idx_properties_price_sale ON properties(price_sale) WHERE price_sale IS NOT NULL;
CREATE INDEX idx_properties_featured   ON properties(is_featured, created_at DESC) WHERE status = 'active';
CREATE INDEX idx_properties_owner      ON properties(owner_id);
CREATE INDEX idx_photos_property       ON property_photos(property_id, display_order);
CREATE INDEX idx_favorites_user        ON favorites(user_id);
CREATE INDEX idx_contact_property      ON contact_requests(property_id);
CREATE INDEX idx_reports_property      ON reports(property_id) WHERE status = 'open';

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Nenpòt moun ka wè pwofil piblik (non, avatar, whatsapp) pou anons yo
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Pwopriyete
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_select_active"
  ON properties FOR SELECT
  USING (status = 'active');

CREATE POLICY "properties_select_own"
  ON properties FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "properties_insert_auth"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "properties_update_own"
  ON properties FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
  -- Admin yo itilize service role key (bypasse RLS) — pa bezwen verifye la

CREATE POLICY "properties_delete_own"
  ON properties FOR DELETE
  USING (auth.uid() = owner_id);

-- Admin ka tout wè
CREATE POLICY "properties_admin_all"
  ON properties FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Photos
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_select_all"
  ON property_photos FOR SELECT USING (true);

CREATE POLICY "photos_manage_own"
  ON property_photos FOR ALL
  USING (
    auth.uid() IN (
      SELECT owner_id FROM properties WHERE id = property_id
    )
  );

-- Favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_own"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- Contact requests
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_insert_any"
  ON contact_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contacts_select_owner"
  ON contact_requests FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM properties WHERE id = property_id
    )
  );

-- Reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_insert_auth"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "reports_admin"
  ON reports FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
