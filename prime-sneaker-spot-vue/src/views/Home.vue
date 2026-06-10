<template>
  <SiteLayout>
    <!-- BANNER -->
    <section v-if="banner" class="relative overflow-hidden rounded-xl mb-10">
      <img
        :src="banner.image"
        :alt="banner.title"
        class="w-full h-72 object-cover"
      />
      <div class="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
        <h1 class="text-white text-3xl font-extrabold">{{ banner.title }}</h1>
        <p class="text-white/80 mt-2">{{ banner.subtitle }}</p>
        <RouterLink
          to="/catalogo"
          class="mt-4 inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-md w-fit hover:opacity-90"
        >
          Ver catálogo <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </section>

    <!-- CATEGORIAS -->
    <section class="mb-10">
      <h2 class="text-xl font-bold mb-4">Categorias</h2>
      <div class="flex flex-wrap gap-3">
        <RouterLink
          v-for="cat in categories"
          :key="cat"
          :to="`/catalogo?categoria=${cat}`"
          class="px-4 py-2 rounded-full border hover:bg-primary hover:text-white transition text-sm font-medium"
        >
          {{ CATEGORY_EMOJI[cat] }} {{ CATEGORY_LABELS[cat] }}
        </RouterLink>
      </div>
    </section>

    <!-- MAIS VENDIDOS -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Mais Vendidos</h2>
        <RouterLink to="/catalogo" class="text-sm text-primary inline-flex items-center gap-1">
          Ver todos <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in maisVendidos"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>

    <!-- PROMOÇÕES -->
    <section v-if="promocoes.length" class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Promoções</h2>
        <RouterLink to="/catalogo" class="text-sm text-primary inline-flex items-center gap-1">
          Ver todas <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in promocoes"
          :key="product.id"
          :product="product"
        />
      </div>
    </section>
  </SiteLayout>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'

import SiteLayout from '@/layouts/SiteLayout.vue'
import ProductCard from '@/components/products/ProductCard.vue'

import { useProductsStore } from '@/stores/products'
import { useBannersStore } from '@/stores/banners'
import { CATEGORY_LABELS, CATEGORY_EMOJI } from '@/lib/data'

const productsStore = useProductsStore()
const bannersStore = useBannersStore()

const categories = ['corrida', 'basquete', 'casual', 'academia', 'infantil', 'feminino']

const banner = computed(() => {
  const active = bannersStore.banners.find(b => b.active)
  return active || bannersStore.banners[0]
})

const activeProducts = computed(() =>
  productsStore.products.filter(p => p.active)
)

const maisVendidos = computed(() =>
  [...activeProducts.value].sort((a, b) => b.sales - a.sales).slice(0, 8)
)

const promocoes = computed(() =>
  activeProducts.value.filter(p => p.promocao && p.oldPrice).slice(0, 4)
)
</script>