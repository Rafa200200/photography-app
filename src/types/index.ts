export interface Photographer {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  logo_url?: string;
  profile_image_url?: string;
  bio?: string;
  social_links: SocialLinks;
  created_at: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  website?: string;
  twitter?: string;
  youtube?: string;
}

export interface Album {
  id: string;
  photographer_id: string;
  name: string;
  code: string;
  client_name?: string;
  client_email?: string;
  watermark_enabled: boolean;
  status: 'active' | 'expired' | 'archived';
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface AlbumCategory {
  id: string;
  album_id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Photo {
  id: string;
  album_id: string;
  category_id?: string;
  storage_path: string;
  thumbnail_path?: string;
  original_filename?: string;
  width?: number;
  height?: number;
  size_bytes?: number;
  sort_order: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  photo_id: string;
  album_id: string;
  client_identifier: string;
  created_at: string;
}

export interface PortfolioPhoto {
  id: string;
  photographer_id: string;
  storage_path: string;
  thumbnail_path?: string;
  title?: string;
  category?: string;
  width?: number;
  height?: number;
  sort_order: number;
  created_at: string;
}
