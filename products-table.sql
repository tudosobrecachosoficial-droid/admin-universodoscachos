-- Diagnóstico / compatibilidade da tabela products para o admin
-- Use no SQL Editor do Supabase.

-- 1) Verifica a estrutura real da tabela products
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default,
  udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
ORDER BY ordinal_position;

-- 2) Verifica alguns registros existentes
SELECT *
FROM public.products
LIMIT 20;

-- 3) Cria a tabela com o formato esperado pelo admin, se não existir
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_label TEXT DEFAULT '',
  categoryLabel TEXT DEFAULT '',
  price NUMERIC(10,2) DEFAULT 0,
  affiliate_link TEXT DEFAULT '',
  affiliateLink TEXT DEFAULT '',
  featured BOOLEAN DEFAULT FALSE,
  image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) Compatibilidade para nomes de coluna diferentes
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category_label TEXT DEFAULT '';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS categoryLabel TEXT DEFAULT '';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS affiliate_link TEXT DEFAULT '';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS affiliateLink TEXT DEFAULT '';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5) Atualiza a coluna updated_at automaticamente
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.touch_updated_at();

-- 6) Exemplo de consulta para uso do admin
SELECT
  id,
  name,
  slug,
  COALESCE(category_label, categoryLabel, '') AS category,
  price,
  COALESCE(affiliate_link, affiliateLink, '') AS affiliate_link,
  featured,
  image
FROM public.products
ORDER BY created_at DESC;
