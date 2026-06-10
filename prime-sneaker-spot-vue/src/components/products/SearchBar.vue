<template>
  <form
    role="search"
    :class="['relative w-full', className]"
    @submit.prevent="handleSubmit"
  >
    <Search
      class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
    />

    <input
      v-model="value"
      type="search"
      :placeholder="placeholder"
      aria-label="Buscar produtos"
      class="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
    />
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'

const props = defineProps({
  initialValue: {
    type: String,
    default: '',
  },

  onSearch: {
    type: Function,
    default: null,
  },

  className: {
    type: String,
    default: '',
  },

  placeholder: {
    type: String,
    default: 'Buscar por nome ou marca...',
  },
})

const router = useRouter()

const value = ref(props.initialValue)

watch(
  () => props.initialValue,
  (newValue) => {
    value.value = newValue
  }
)

function handleSubmit() {
  const q = value.value.trim()

  if (props.onSearch) {
    props.onSearch(q)
    return
  }

  router.push({
    path: '/catalogo',
    query: {
      q: q || undefined,
    },
  })
}
</script>