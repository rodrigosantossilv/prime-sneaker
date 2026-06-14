import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    async login(email, password) {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        return { success: false, message: data.message || 'Falha no login.' }
      }

      const data = await response.json()
      this.user = data.user
      return { success: true }
    },

    logout() {
      this.user = null
    },
  },
})