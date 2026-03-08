-- 1. Criação da Tabela de Fotógrafos (Perfil/Admin)
CREATE TABLE IF NOT EXISTS photographers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE, 
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  logo_url TEXT,
  bio TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Álbuns (Para os clientes)
CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES photographers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code VARCHAR(8) UNIQUE NOT NULL,
  client_name TEXT,
  client_email TEXT,
  watermark_enabled BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Subcategorias de um Álbum
CREATE TABLE IF NOT EXISTS album_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Fotos (pertencentes a um álbum)
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  category_id UUID REFERENCES album_categories(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  original_filename TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Pagina Inicial: Fotos de Portfólio (Masonry Gallery)
CREATE TABLE IF NOT EXISTS portfolio_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photographer_id UUID NOT NULL REFERENCES photographers(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  title TEXT,
  category TEXT,
  width INT,
  height INT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Inserir os teus dados globais iniciais na tabela photographers
INSERT INTO photographers (name, email, bio, social_links)
VALUES (
  'Hugo Lourenço', 
  'hello@hlphotography.com', 
  'Fotógrafo profissional com mais de 10 anos de experiência...',
  '{"instagram": "https://instagram.com", "facebook": "https://facebook.com"}'
)
ON CONFLICT DO NOTHING;
