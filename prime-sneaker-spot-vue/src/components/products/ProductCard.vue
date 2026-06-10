<template>
  <div
    class="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
  >
    <!-- Imagem -->
    <div class="relative aspect-square overflow-hidden bg-muted">
      <RouterLink
        :to="`/produto/${product.id}`"
        :aria-label="product.name"
      >
        <img
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </RouterLink>

      <!-- Badges -->
      <div class="absolute left-2 top-2 flex flex-col gap-1">
        <span
          v-if="product.destaque"
          class="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow"
        >
          Mais vendido
        </span>

        <span
          v-if="isPromo && product.oldPrice"
          class="rounded-md bg-success px-2 py-1 text-xs font-medium text-success-foreground shadow"
        >
          -{{ discountPercent(product.oldPrice, product.price) }}%
        </span>
      </div>

      <!-- Favoritos -->
      <button
        type="button"
        :aria-label="isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
        class="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
        @click="toggleFavorite(product.id)"
      >
        <Heart
          :class="[
            'h-5 w-5 transition-colors',
            isFav && 'fill-destructive text-destructive'
          ]"
        />
      </button>
    </div>

    <!-- Conteúdo -->
    <div class="flex flex-1 flex-col p-4">

      <!-- Marca / Avaliação -->
      <div class="mb-1 flex items-center justify-between">
        <span
          class="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {{ product.brand }}
        </span>

        <span
          class="flex items-center gap-0.5 text-xs text-muted-foreground"
        >
          <Star class="h-3.5 w-3.5 fill-accent text-accent" />
          {{ product.rating.toFixed(1) }}
        </span>
      </div>

      <!-- Nome -->
      <RouterLink
        :to="`/produto/${product.id}`"
        class="line-clamp-2 font-medium leading-snug hover:text-primary"
      >
        {{ product.name }}
      </RouterLink>

      <!-- Categoria -->
      <span class="mt-0.5 text-xs text-muted-foreground">
        {{ CATEGORY_LABELS[product.category] }}
      </span>

      <!-- Preços -->
      <div class="mt-3 flex-1">

        <span
          v-if="isPromo && product.oldPrice"
          class="block text-sm text-muted-foreground line-through"
        >
          {{ formatBRL(product.oldPrice) }}
        </span>

        <span class="block text-xl font-bold text-foreground">
          {{ formatBRL(product.price) }}
        </span>

        <span class="block text-xs text-success">
          {{ formatParcelas(product.price, product.installments) }}
        </span>

      </div>

      <!-- Botão -->
      <RouterLink
        :to="`/produto/${product.id}`"
        class="mt-4 flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        Ver detalhes
      </RouterLink>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, Star } from 'lucide-vue-next'

import { useFavoritesStore } from '@/stores/favorites'
import {
  CATEGORY_LABELS,
  discountPercent,
  formatBRL,
  formatParcelas,
} from '@/lib/format'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },

  variant: {
    type: String,
    default: 'default',
  },
})

const favoritesStore = useFavoritesStore()

const isFav = computed(() =>
  favoritesStore.items.includes(props.product.id)
)

const isPromo = computed(() =>
  props.variant === 'promo' ||
  (props.product.promocao && !!props.product.oldPrice)
)

function toggleFavorite(id) {
  favoritesStore.toggleFavorite(id)
}
</script>