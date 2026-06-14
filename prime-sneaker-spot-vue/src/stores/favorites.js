import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('favorites') || '[]')
      .map(Number)
      .filter(id => Number.isFinite(id)),
  }),

  actions: {
    toggleFavorite(id) {
      const favoriteId = Number(id)
      if (!Number.isFinite(favoriteId)) return

      const index = this.items.indexOf(favoriteId)

      if (index >= 0) {
        this.items.splice(index, 1)
      } else {
        this.items.push(favoriteId)
      }

      localStorage.setItem(
        'favorites',
        JSON.stringify(this.items)
      )
    },
  },
})