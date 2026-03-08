-- 1. Políticas de Armazenamento para os Buckets (Storage RLS)

-- Para o bucket "portfolio" (Logos e Fotos da Página Inicial)
-- Permitir leitura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

-- Permitir admin (utilizador logado) fazer upload/update/delete
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'portfolio' );

CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'portfolio' );

CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'portfolio' );

-- 2. Políticas para acesso à Tabela Photographers
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read photographers"
ON photographers FOR SELECT
USING ( true );

CREATE POLICY "Admin can update photographers"
ON photographers FOR UPDATE
TO authenticated
USING ( true ); -- Simplificado para teste, num cenário real ligávamos ao auth.uid()

CREATE POLICY "Admin can insert photographers"
ON photographers FOR INSERT
TO authenticated
WITH CHECK ( true );
