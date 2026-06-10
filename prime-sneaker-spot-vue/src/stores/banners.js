import { defineStore } from 'pinia'

export const useBannersStore = defineStore('banners', {
  state: () => ({
    banners: [
      {
        id: 1,
        active: true,
        title: 'Os melhores tênis do Mercado Livre',
        subtitle:
          'Encontre Nike, Adidas, Mizuno e muito mais.',
        buttonText: 'Explorar catálogo',
        link: '/catalogo',
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      },
    ],
  }),
})