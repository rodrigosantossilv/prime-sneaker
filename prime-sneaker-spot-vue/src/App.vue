<template>
  <RouterView />
  <Toaster />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

onMounted(() => {
  productsStore.loadProducts().catch(error => {
    console.error('Falha ao carregar produtos:', error)
  })
})
</script>
