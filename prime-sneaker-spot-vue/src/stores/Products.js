import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
  }),

  actions: {
    async loadProducts() {
      const response = await fetch('http://127.0.0.1:3000/api/products')
      if (!response.ok) {
        throw new Error('Não foi possível carregar os produtos.')
      }
      this.products = await response.json()
    },

    async addProduct(product) {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.message || `Erro ao cadastrar o produto. Status ${response.status}`)
        }

        const createdProduct = await response.json()
        this.products.push(createdProduct)
        return createdProduct
      } catch (error) {
        throw new Error(error.message || 'Erro ao cadastrar o produto.')
      }
    },

    async updateProduct(updatedProduct) {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      })
      if (!response.ok) {
        throw new Error('Erro ao atualizar o produto.')
      }
      const product = await response.json()
      const index = this.products.findIndex(
        p => p.id === product.id
      )

      if (index !== -1) {
        this.products[index] = product
      }
      return product
    },

    async removeProduct(id) {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erro ao remover o produto.')
      }
      this.products = this.products.filter(
        p => p.id !== id
      )
    },
  },
})