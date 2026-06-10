<template>
  <div class="rounded-lg border bg-card p-3">
    <span
      class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
    >
      {{ label }}
    </span>

    <p class="text-sm">
      {{ value }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
})
</script>