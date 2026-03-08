-- Adicionar coluna para a Foto de Perfil à tabela photographers
ALTER TABLE photographers 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
