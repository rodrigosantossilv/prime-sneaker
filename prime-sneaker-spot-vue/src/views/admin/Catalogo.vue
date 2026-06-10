<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Catálogo (Admin)</h1>

      <div v-if="products.length === 0" class="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        Nenhum produto cadastrado.
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import { useProductsStore } from '@/stores/products'
import { computed } from 'vue'

const productsStore = useProductsStore()
const products = computed(() => productsStore.products)
</script>
