export const SITE_CONFIG = {
  name: 'HL Photography',
  logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&q=80', // Temporary small photo logo
  tagline: 'Capturing moments that last forever',
  description: 'Professional photography studio specializing in weddings, portraits, and editorial photography.',
  photographer: {
    name: 'Hugo Lourenço',
    bio: 'Fotógrafo profissional com mais de 10 anos de experiência. Especializado em casamentos, retratos e fotografia editorial. Cada imagem conta uma história única — o meu objetivo é capturar a essência de cada momento com autenticidade e arte.',
    avatar: '/images/avatar.jpg',
  },
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    email: 'hello@hlphotography.com',
  },
  nav: [
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Sobre', href: '#about' },
    { label: 'Contactos', href: '#contact' },
  ],
} as const;

// Placeholder portfolio images with varied aspect ratios for masonry
export const PORTFOLIO_PLACEHOLDER = [
  { id: '1', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', title: 'Cerimónia', category: 'Casamentos', width: 600, height: 900 },
  { id: '2', src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', title: 'Primeira Dança', category: 'Casamentos', width: 600, height: 400 },
  { id: '3', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80', title: 'Sessão Retrato', category: 'Retratos', width: 600, height: 750 },
  { id: '4', src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80', title: 'Golden Hour', category: 'Editorial', width: 600, height: 400 },
  { id: '5', src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80', title: 'Retrato de Casal', category: 'Casamentos', width: 600, height: 800 },
  { id: '6', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', title: 'Retrato em Estúdio', category: 'Retratos', width: 600, height: 600 },
  { id: '7', src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80', title: 'Editorial Natureza', category: 'Editorial', width: 600, height: 900 },
  { id: '8', src: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80', title: 'Detalhes', category: 'Casamentos', width: 600, height: 400 },
  { id: '9', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80', title: 'Fashion', category: 'Retratos', width: 600, height: 750 },
  { id: '10', src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80', title: 'Detalhes do Espaço', category: 'Casamentos', width: 600, height: 500 },
  { id: '11', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80', title: 'Sessão Editorial', category: 'Editorial', width: 600, height: 800 },
  { id: '12', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80', title: 'Preparativos', category: 'Casamentos', width: 600, height: 900 },
];

export const ALBUM_EXPIRY_DAYS = 90;
export const ALBUM_CODE_LENGTH = 8;
