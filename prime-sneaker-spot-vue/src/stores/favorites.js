import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('favorites') || '[]'),
  }),

  actions: {
    toggleFavorite(id) {
      const index = this.items.indexOf(id)

      if (index >= 0) {
        this.items.splice(index, 1)
      } else {
        this.items.push(id)
      }

      localStorage.setItem(
        'favorites',
        JSON.stringify(this.items)
      )
    },
  },
})