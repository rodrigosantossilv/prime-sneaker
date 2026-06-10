import { defineStore } from 'pinia'

const ADMIN_EMAIL = 'admin@tenisprime.com'
const ADMIN_PASSWORD = 'admin123'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    login(email, password) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        this.user = { email, name: 'Administrador' }
        return { success: true }
      }
      return { success: false, message: 'E-mail ou senha incorretos.' }
    },

    logout() {
      this.user = null
    },
  },
})