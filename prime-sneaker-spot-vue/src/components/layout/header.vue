<template>
  <header class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
    <div class="container-page flex h-16 items-center gap-3">

      <!-- Mobile -->
      <div class="flex items-center gap-2">
        <button
          class="md:hidden p-2 rounded-md hover:bg-muted"
          aria-label="Abrir menu"
          @click="open = true"
        >
          <Menu class="h-5 w-5" />
        </button>

        <RouterLink
          to="/admin/login"
          class="font-display text-xl font-extrabold leading-none"
          title="Área administrativa"
        >
          Tênis <span class="text-primary">Prime</span>
        </RouterLink>
      </div>

      <!-- Busca desktop -->
      <div class="hidden flex-1 px-4 md:block">
        <SearchBar />
      </div>

      <!-- Navegação desktop -->
      <nav class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="item in nav"
          :key="item.label"
          :to="item.to"
          :class="buttonClasses"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- Favoritos -->
      <RouterLink
        to="/favoritos"
        class="relative rounded-md p-2 hover:bg-muted"
      >
        <Heart class="h-5 w-5" />

        <span
          v-if="favorites.length > 0"
          class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white"
        >
          {{ favorites.length }}
        </span>
      </RouterLink>
    </div>

    <!-- Busca mobile -->
    <div class="container-page pb-3 md:hidden">
      <SearchBar />
    </div>

    <!-- Drawer Mobile -->
    <div
      v-if="open"
      class="fixed inset-0 z-50 bg-black/50"
      @click.self="open = false"
    >
      <div class="h-full w-72 bg-background p-6 shadow-lg">

        <RouterLink
          to="/admin/login"
          class="font-display text-xl font-extrabold"
          @click="open = false"
          title="Área administrativa"
        >
          Tênis <span class="text-primary">Prime</span>
        </RouterLink>

        <nav class="mt-6 flex flex-col gap-1">
          <RouterLink
            v-for="item in nav"
            :key="item.label"
            :to="item.to"
            class="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            @click="open = false"
          >
            {{ item.label }}
          </RouterLink>

          <RouterLink
            to="/catalogo"
            class="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            @click="open = false"
          >
            Catálogo
          </RouterLink>
        </nav>
      </div>
    </div>

  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, Menu } from 'lucide-vue-next'

import SearchBar from '@/components/products/SearchBar.vue'
import { useFavoritesStore } from '@/stores/favorites'

const open = ref(false)

const favoritesStore = useFavoritesStore()

const favorites = computed(() => favoritesStore.items)

const nav = [
  {
    label: 'Masculino',
    to: '/catalogo',
  },
  {
    label: 'Feminino',
    to: '/catalogo',
  },
  {
    label: 'Infantil',
    to: '/catalogo',
  },
  {
    label: 'Promoções',
    to: '/catalogo',
  },
]

const buttonClasses =
  'rounded-md px-3 py-2 text-sm font-medium hover:bg-muted'
</script>