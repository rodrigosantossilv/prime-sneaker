<template>
  <Header />

  <main>
    <slot />
  </main>

  <Footer />
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
</script>