<template>
  <SiteLayout>
    <div class="container-page py-8">
      <h1 class="mb-1 text-3xl font-extrabold">
        Meus Favoritos
      </h1>

      <p class="mb-8 text-sm text-muted-foreground">
        {{ favProducts.length }}
        produto{{ favProducts.length !== 1 ? 's' : '' }}
        salvo{{ favProducts.length !== 1 ? 's' : '' }}
      </p>

      <div
        v-if="favProducts.length === 0"
        class="flex flex-col items-center gap-4 rounded-xl border border-dashed py-20 text-center"
      >
        <HeartOff class="h-12 w-12 text-muted-foreground" />

        <div>
          <p class="font-semibold">
            Você ainda não tem favoritos
          </p>

          <p class="text-sm text-muted-foreground">
            Toque no coração dos produtos para salvá-los aqui.
          </p>
        </div>

        <RouterLink
          to="/catalogo"
          class="rounded-md bg-primary px-4 py-2 text-white transition hover:opacity-90"
        >
          Explorar catálogo
        </RouterLink>
      </div>

      <div
        v-else
        class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
      >
        <ProductCard
          v-for="product in favProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </SiteLayout>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { HeartOff } from 'lucide-vue-next'

import SiteLayout from '@/layouts/SiteLayout.vue'
import ProductCard from '@/components/products/ProductCard.vue'

import { useProductsStore } from '@/stores/products'
import { useFavoritesStore } from '@/stores/favorites'

const productsStore = useProductsStore()
const favoritesStore = useFavoritesStore()

const favProducts = computed(() => {
  return productsStore.products.filter(product =>
    favoritesStore.items.includes(product.id)
  )
})
</script>