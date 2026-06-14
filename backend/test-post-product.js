const url = 'http://127.0.0.1:3000/api/products';

const product = {
  name: 'Teste API Reproducao',
  brand: 'Marca',
  category: 'Corrida',
  image: 'https://example.com/image.jpg',
  images: ['https://example.com/image.jpg'],
  price: 123.45,
  oldPrice: null,
  promocao: false,
  destaque: false,
  badge: null,
  active: true,
  rating: 0,
  reviews: 0,
  sales: 0,
  installments: 1,
  mercadoLink: 'https://meli.la/teste',
  description: { material: 'Couro', conforto: 'Bom', indicacao: 'Corrida' }
};

async function run() {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const text = await res.text();
    console.log('status', res.status);
    console.log('body', text);
  } catch (error) {
    console.error('error', error);
  }
}

run();
