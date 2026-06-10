<template>
  <div class="mb-6 flex items-end justify-between">
    <h2 class="text-2xl font-bold">
      {{ title }}
    </h2>

    <RouterLink
      :to="to"
      class="inline-flex items-center text-sm font-medium hover:text-primary"
    >
      Ver tudo
      <ArrowRight class="ml-1 h-4 w-4" />
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'

defineProps({
  title: String,
  to: String,
})
</script>