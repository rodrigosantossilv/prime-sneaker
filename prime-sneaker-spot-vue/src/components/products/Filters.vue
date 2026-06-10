<template>
  <div class="space-y-6">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between">
      <h3 class="font-bold">Filtros</h3>

      <button
        class="rounded-md px-3 py-1 text-sm hover:bg-muted"
        @click="$emit('clear')"
      >
        Limpar
      </button>
    </div>

    <!-- Marca -->
    <div>
      <h4 class="mb-3 text-sm font-semibold">
        Marca
      </h4>

      <div class="space-y-2">
        <label
          v-for="brand in BRANDS"
          :key="brand"
          class="flex cursor-pointer items-center gap-2 text-sm"
        >
          <input
            type="checkbox"
            :checked="brands.includes(brand)"
            class="h-4 w-4 rounded border"
            @change="$emit('toggle-brand', brand)"
          />

          {{ brand }}
        </label>
      </div>
    </div>

    <!-- Categoria -->
    <div>
      <h4 class="mb-3 text-sm font-semibold">
        Categoria
      </h4>

      <div class="space-y-2">
        <label
          v-for="category in CAT_OPTIONS"
          :key="category"
          class="flex cursor-pointer items-center gap-2 text-sm"
        >
          <input
            type="checkbox"
            :checked="categories.includes(category)"
            class="h-4 w-4 rounded border"
            @change="$emit('toggle-category', category)"
          />

          {{ CATEGORY_LABELS[category] }}
        </label>
      </div>
    </div>

    <!-- Preço -->
    <div>
      <h4 class="mb-3 text-sm font-semibold">
        Faixa de preço
      </h4>

      <div class="space-y-2">
        <label
          v-for="option in PRICE_OPTIONS"
          :key="option.value"
          class="flex cursor-pointer items-center gap-2 text-sm"
        >
          <input
            type="radio"
            name="price"
            :value="option.value"
            :checked="price === option.value"
            @change="$emit('price-change', option.value)"
          />

          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  BRANDS,
  CATEGORY_LABELS,
} from '@/lib/data'

const CAT_OPTIONS = [
  'corrida',
  'casual',
  'basquete',
  'academia',
  'infantil',
  'feminino',
]

const PRICE_OPTIONS = [
  {
    value: 'all',
    label: 'Todos os preços',
  },
  {
    value: 'lt200',
    label: 'Até R$ 200',
  },
  {
    value: '200-400',
    label: 'R$ 200 – 400',
  },
  {
    value: 'gt400',
    label: 'Acima de R$ 400',
  },
]

defineProps({
  brands: {
    type: Array,
    default: () => [],
  },

  categories: {
    type: Array,
    default: () => [],
  },

  price: {
    type: String,
    default: 'all',
  },
})

defineEmits([
  'toggle-brand',
  'toggle-category',
  'price-change',
  'clear',
])
</script>