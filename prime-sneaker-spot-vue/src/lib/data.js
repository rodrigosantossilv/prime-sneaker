export const BRANDS = [
  'Nike',
  'Adidas',
  'Mizuno',
  'Asics',
  'Puma',
  'Olympikus',
]

export const CATEGORY_LABELS = {
  corrida: 'Corrida',
  casual: 'Casual',
  basquete: 'Basquete',
  academia: 'Academia',
  infantil: 'Infantil',
  feminino: 'Feminino',
}

export const CATEGORY_EMOJI = {
  corrida: '🏃',
  casual: '👟',
  basquete: '🏀',
  academia: '🏋️',
  infantil: '🧒',
  feminino: '💖',
}

export const PRODUCTS = [
  {
    id: 'nike-1',
    name: 'Nike Air Max Alpha',
    brand: 'Nike',
    category: 'casual',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    ],
    price: 399.90,
    oldPrice: 499.90,
    promocao: true,
    destaque: true,
    active: true,
    rating: 4.8,
    reviews: 152,
    sales: 320,
    installments: 10,
    mercadoLink: 'https://mercadolivre.com.br',
    description: {
      material: 'Mesh respirável',
      conforto: 'Alto',
      indicacao: 'Uso casual',
    },
  },

  {
    id: 'adidas-1',
    name: 'Adidas Ultraboost',
    brand: 'Adidas',
    category: 'corrida',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    ],
    price: 599.90,
    promocao: false,
    destaque: true,
    active: true,
    rating: 4.9,
    reviews: 204,
    sales: 450,
    installments: 12,
    mercadoLink: 'https://mercadolivre.com.br',
    description: {
      material: 'Primeknit',
      conforto: 'Excelente',
      indicacao: 'Corrida',
    },
  },

  {
    id: 'mizuno-1',
    name: 'Mizuno Wave',
    brand: 'Mizuno',
    category: 'corrida',
    image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f',
    images: [
      'https://images.unsplash.com/photo-1543508282-6319a3e2621f',
    ],
    price: 349.90,
    oldPrice: 429.90,
    promocao: true,
    destaque: false,
    active: true,
    rating: 4.7,
    reviews: 89,
    sales: 170,
    installments: 8,
    mercadoLink: 'https://mercadolivre.com.br',
    description: {
      material: 'Tecido sintético',
      conforto: 'Alto',
      indicacao: 'Corrida',
    },
  },

  {
    id: 'puma-1',
    name: 'Puma Rebound',
    brand: 'Puma',
    category: 'basquete',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
    ],
    price: 289.90,
    promocao: false,
    destaque: false,
    active: true,
    rating: 4.5,
    reviews: 54,
    sales: 120,
    installments: 6,
    mercadoLink: 'https://mercadolivre.com.br',
    description: {
      material: 'Couro sintético',
      conforto: 'Bom',
      indicacao: 'Basquete',
    },
  },
]