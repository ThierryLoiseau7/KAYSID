-- =============================================================
-- KaySid — Schema PostgreSQL (Supabase)
-- Copie sa yo epi koule yo nan Supabase SQL Editor
-- =============================================================

-- Aktive UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- TABLE: profiles (extansyon pou auth.users Supabase)
-- =============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  phone         TEXT,
  full_name     TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  role          TEXT NOT NULL DEFAULT 'tenant'
                CHECK (role IN ('tenant', 'owner', 'agent', 'admin')),
  is_verified   BOOLEAN NOT NULL DEFAULT false,
  is_premium    BOOLEAN NOT NULL DEFAULT false,
  whatsapp      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: kreye profil otomatikman apre enskri
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

-- =============================================================
-- TABLE: locations (Jeografi Sid Ayiti)
-- =============================================================
CREATE TABLE locations (
  id            SERIAL PRIMARY KEY,
  department    TEXT NOT NULL,
  commune       TEXT NOT NULL,
  neighborhood  TEXT,
  UNIQUE (commune, neighborhood)
);

-- =============================================================
-- TABLE: properties (Pwopriyete yo)
-- =============================================================
CREATE TABLE properties (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id     INT  NOT NULL REFERENCES locations(id),

  title           TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 150),
  description     TEXT CHECK (char_length(description) <= 2000),
  property_type   TEXT NOT NULL
                  CHECK (property_type IN (
                    'chambrette', 'studio', 'appartement',
                    'kay_2_chanm', 'kay_3_chanm', 'kay_4_chanm',
                    'te', 'villa'
                  )),
  listing_type    TEXT NOT NULL DEFAULT 'rent'
                  CHECK (listing_type IN ('rent', 'sale', 'both')),

  -- Pri
  price_monthly   NUMERIC(12,2) CHECK (price_monthly IS NULL OR price_monthly >= 0),
  price_sale      NUMERIC(14,2) CHECK (price_sale IS NULL OR price_sale >= 0),
  currency        TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'HTG')),

  -- Karakteristik
  bedrooms        SMALLINT NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms       SMALLINT NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  area_sqm        NUMERIC(8,2) CHECK (area_sqm IS NULL OR area_sqm > 0),

  -- Sèvis
  is_furnished    BOOLEAN NOT NULL DEFAULT false,
  has_water       BOOLEAN NOT NULL DEFAULT true,
  has_electricity BOOLEAN NOT NULL DEFAULT true,
  has_generator   BOOLEAN NOT NULL DEFAULT false,
  has_parking     BOOLEAN NOT NULL DEFAULT false,
  has_internet    BOOLEAN NOT NULL DEFAULT false,

  -- Statik ak moderation
  status          TEXT NOT NULL DEFAULT 'pending_review'
                  CHECK (status IN (
                    'active', 'rented', 'sold', 'suspended', 'pending_review'
                  )),
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  report_count    SMALLINT NOT NULL DEFAULT 0,

  -- Analytik
  view_count      INT NOT NULL DEFAULT 0,
  contact_count   INT NOT NULL DEFAULT 0,

  -- Lokalizasyon
  address_text    TEXT,
  latitude        NUMERIC(10,8),
  longitude       NUMERIC(11,8),

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: mete jou updated_at otomatikman
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================
-- TABLE: property_photos
-- =============================================================
CREATE TABLE property_photos (
  id              SERIAL PRIMARY KEY,
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  cloudinary_id   TEXT,
  is_cover        BOOLEAN NOT NULL DEFAULT false,
  display_order   SMALLINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Constraint: yon sèl foto kouvert pou chak pwopriyete
CREATE UNIQUE INDEX unique_cover_photo
  ON property_photos (property_id)
  WHERE is_cover = true;

-- =============================================================
-- TABLE: favorites (Kay ou renmen)
-- =============================================================
CREATE TABLE favorites (
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  saved_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);

-- =============================================================
-- TABLE: contact_requests (Suivi kontakt WhatsApp)
-- =============================================================
CREATE TABLE contact_requests (
  id              SERIAL PRIMARY KEY,
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  requester_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  requester_ip    TEXT,
  contact_method  TEXT NOT NULL DEFAULT 'whatsapp',
  message         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: inkremente contact_count sou properties
CREATE OR REPLACE FUNCTION increment_contact_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties SET contact_count = contact_count + 1 WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_contact_request
  AFTER INSERT ON contact_requests
  FOR EACH ROW EXECUTE FUNCTION increment_contact_count();

-- =============================================================
-- TABLE: reports (Signale fo anons)
-- =============================================================
CREATE TABLE reports (
  id              SERIAL PRIMARY KEY,
  property_id     UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reporter_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason          TEXT NOT NULL
                  CHECK (reason IN (
                    'fake_listing', 'wrong_price', 'wrong_location',
                    'scam', 'duplicate', 'other'
                  )),
  details         TEXT,
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'resolved', 'dismissed')),
  reviewed_by     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: inkremente report_count epi sipann si >= 5
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

CREATE POLICY "profiles_select_own"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE USING (auth.uid() = id);

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
  WITH CHECK (
    -- Yon mèt kay pa ka chanje statik li menm — sèlman admin
    (status = (SELECT status FROM properties WHERE id = properties.id))
    OR
    (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
  );

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
