import { defineStore } from 'pinia'
import { PRODUCTS } from '@/lib/data'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: PRODUCTS,
  }),

  actions: {
    addProduct(product) {
      this.products.push(product)
    },

    updateProduct(updatedProduct) {
      const index = this.products.findIndex(
        p => p.id === updatedProduct.id
      )

      if (index !== -1) {
        this.products[index] = updatedProduct
      }
    },

    removeProduct(id) {
      this.products = this.products.filter(
        p => p.id !== id
      )
    },
  },
})