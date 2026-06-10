<template>
  <AdminLayout>
    <div class="p-6 md:p-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-extrabold">Dashboard</h1>
        <p class="text-sm text-muted-foreground mt-1">Bem-vindo de volta, {{ authStore.user?.name }}</p>
      </div>

      <!-- Cards de stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-background rounded-xl border border-border p-5"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wide">{{ stat.label }}</span>
            <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
          </div>
          <p class="text-2xl font-extrabold">{{ stat.value }}</p>
          <p class="text-xs text-muted-foreground mt-1">{{ stat.sub }}</p>
        </div>
      </div>

      <!-- Ações rápidas -->
      <div class="mb-8">
        <h2 class="text-base font-bold mb-4">Ações Rápidas</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <RouterLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.to"
            class="bg-background border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary hover:shadow-sm transition text-center"
          >
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <component :is="action.icon" class="h-5 w-5 text-primary" />
            </div>
            <span class="text-xs font-semibold">{{ action.label }}</span>
          </RouterLink>
        </div>
      </div>

      <!-- Produtos recentes -->
      <div class="bg-background rounded-xl border border-border overflow-hidden">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 class="font-bold text-sm">Produtos Recentes</h2>
          <RouterLink to="/catalogo" class="text-xs text-primary font-semibold">Ver todos</RouterLink>
        </div>
        <div class="divide-y divide-border">
          <div
            v-for="product in recentProducts"
            :key="product.id"
            class="flex items-center gap-4 px-6 py-3"
          >
            <img
              :src="product.image"
              :alt="product.name"
              class="w-10 h-10 object-contain rounded-lg bg-muted"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate">{{ product.name }}</p>
              <p class="text-xs text-muted-foreground">{{ product.brand }} · {{ product.category }}</p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-sm font-bold">{{ formatPrice(product.price) }}</p>
              <span
                :class="product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                class="text-xs font-semibold px-2 py-0.5 rounded-full"
              >
                {{ product.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Package, ShoppingBag, Star, Tag, Plus, BarChart2, Trash2, Eye } from 'lucide-vue-next'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'

const authStore = useAuthStore()
const productsStore = useProductsStore()

const products = computed(() => productsStore.products)

const stats = computed(() => [
  {
    label: 'Total de Produtos',
    value: products.value.length,
    sub: `${products.value.filter(p => p.active).length} ativos`,
    icon: Package,
  },
  {
    label: 'Em Promoção',
    value: products.value.filter(p => p.promocao).length,
    sub: 'com desconto',
    icon: Tag,
  },
  {
    label: 'Mais Vendidos',
    value: products.value.filter(p => p.badge === 'mais-vendido').length,
    sub: 'em destaque',
    icon: Star,
  },
  {
    label: 'Categorias',
    value: [...new Set(products.value.map(p => p.category))].length,
    sub: 'categorias ativas',
    icon: ShoppingBag,
  },
])

const quickActions = [
  { label: 'Adicionar Produto', to: '/admin/produto/novo', icon: Plus },
  { label: 'Ver Catálogo', to: '/catalogo', icon: Eye },
  { label: 'Gerenciamento', to: '/admin/estatisticas', icon: BarChart2 },
  { label: 'Remover Produto', to: '/admin/remover', icon: Trash2 },
]

const recentProducts = computed(() =>
  [...products.value].slice(-5).reverse()
)

function formatPrice(price) {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>