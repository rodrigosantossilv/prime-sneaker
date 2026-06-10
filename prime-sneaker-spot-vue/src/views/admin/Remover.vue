<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Remover Produtos</h1>

      <div v-if="products.length === 0" class="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        Nenhum produto cadastrado.
      </div>

      <div v-else class="space-y-3">
        <div v-for="p in products" :key="p.id" class="flex items-center justify-between border rounded p-3">
          <div>
            <div class="font-semibold">{{ p.name }}</div>
            <div class="text-sm text-muted-foreground">{{ p.brand }} — R$ {{ p.price }}</div>
          </div>
          <div>
            <button @click="remove(p.id)" class="px-3 py-1 rounded bg-red-500 text-white">Remover</button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/layouts/AdminLayout.vue'
import { computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()
const products = computed(() => productsStore.products)

function remove(id) {
  if (confirm('Remover este produto?')) {
    productsStore.removeProduct(id)
  }
}
</script>
