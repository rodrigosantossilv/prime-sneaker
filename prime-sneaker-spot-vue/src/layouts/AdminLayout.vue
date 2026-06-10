<template>
  <div class="min-h-screen flex bg-muted">

    <!-- Sidebar -->
    <aside class="w-16 md:w-56 bg-background border-r border-border flex flex-col shrink-0 transition-all">

      <!-- Logo -->
      <div class="h-16 flex items-center justify-center md:justify-start px-4 border-b border-border">
        <RouterLink to="/admin/dashboard" class="font-display font-extrabold text-lg hidden md:block">
          Tênis <span class="text-primary">Prime</span>
        </RouterLink>
        <RouterLink to="/admin/dashboard" class="md:hidden">
          <span class="text-primary font-extrabold text-lg">T</span>
        </RouterLink>
      </div>

      <!-- Admin logado -->
      <div class="flex items-center gap-3 px-4 py-4 border-b border-border">
        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <UserCircle class="h-5 w-5 text-primary" />
        </div>
        <div class="hidden md:block overflow-hidden">
          <p class="text-xs font-bold truncate">{{ authStore.user?.name }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex flex-col gap-1 p-2 flex-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
          active-class="bg-primary/10 text-primary"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span class="hidden md:block">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Sair -->
      <div class="p-2 border-t border-border">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"
          @click="handleLogout"
        >
          <LogOut class="h-5 w-5 shrink-0" />
          <span class="hidden md:block">Sair</span>
        </button>
      </div>

    </aside>

    <!-- Conteúdo -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>

  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { LayoutDashboard, Plus, ShoppingBag, BarChart2, Trash2, LogOut, UserCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Adicionar Produto', to: '/admin/produto/novo', icon: Plus },
  { label: 'Catálogo da Loja', to: '/admin/catalogo', icon: ShoppingBag },
  { label: 'Gerenciamento', to: '/admin/estatisticas', icon: BarChart2 },
  { label: 'Remover Produto', to: '/admin/remover', icon: Trash2 },
]

function handleLogout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>