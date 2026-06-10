<template>
  <SiteLayout>
    <div class="container-page py-8">
      <h1 class="mb-1 text-3xl font-extrabold">
        Catálogo
      </h1>

      <p class="mb-6 text-sm text-muted-foreground">
        {{ results.length }}
        produto{{ results.length !== 1 ? 's' : '' }}
        encontrado{{ results.length !== 1 ? 's' : '' }}
      </p>

      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="flex-1">
          <SearchBar
            :initial-value="q"
            placeholder="Buscar por nome ou marca..."
            @search="q = $event"
          />
        </div>

        <select
          v-model="sort"
          class="rounded-md border px-3 py-2"
        >
          <option value="destaque">
            Destaques
          </option>

          <option value="popular">
            Mais populares
          </option>

          <option value="price-asc">
            Menor preço
          </option>

          <option value="price-desc">
            Maior preço
          </option>
        </select>
      </div>

      <div class="flex gap-8">
        <aside class="hidden w-60 shrink-0 lg:block">
          <div class="sticky top-24 rounded-xl border bg-card p-5">
            <Filters
              :brands="brands"
              :categories="categories"
              :price="price"

              @toggle-brand="toggleBrand"
              @toggle-category="toggleCategory"
              @price-change="price = $event"
              @clear="clearFilters"
            />
          </div>
        </aside>

        <div class="flex-1">
          <div
            v-if="results.length === 0"
            class="rounded-xl border border-dashed p-12 text-center text-muted-foreground"
          >
            Nenhum produto encontrado.
          </div>

          <div
            v-else
            class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
          >
            <ProductCard
              v-for="product in results"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </SiteLayout>
</template>

<script setup>
import { ref, computed } from 'vue'

import SiteLayout from '@/layouts/SiteLayout.vue'

import SearchBar from '@/components/products/SearchBar.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import Filters from '@/components/products/Filters.vue'

import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

const q = ref('')
const brands = ref([])
const categories = ref([])
const price = ref('all')
const sort = ref('destaque')

function toggleBrand(brand) {
  if (brands.value.includes(brand)) {
    brands.value =
      brands.value.filter(b => b !== brand)
  } else {
    brands.value.push(brand)
  }
}

function toggleCategory(category) {
  if (categories.value.includes(category)) {
    categories.value =
      categories.value.filter(c => c !== category)
  } else {
    categories.value.push(category)
  }
}

function clearFilters() {
  q.value = ''
  brands.value = []
  categories.value = []
  price.value = 'all'
}

const results = computed(() => {
  let list =
    productsStore.products.filter(
      p => p.active
    )

  const search =
    q.value.trim().toLowerCase()

  if (search) {
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search)
    )
  }

  if (brands.value.length) {
    list = list.filter(
      p =>
        brands.value.includes(p.brand)
    )
  }

  if (categories.value.length) {
    list = list.filter(
      p =>
        categories.value.includes(
          p.category
        )
    )
  }

  if (price.value === 'lt200') {
    list = list.filter(
      p => p.price < 200
    )
  }

  if (price.value === '200-400') {
    list = list.filter(
      p =>
        p.price >= 200 &&
        p.price <= 400
    )
  }

  if (price.value === 'gt400') {
    list = list.filter(
      p => p.price > 400
    )
  }

  switch (sort.value) {
    case 'price-asc':
      list.sort(
        (a, b) =>
          a.price - b.price
      )
      break

    case 'price-desc':
      list.sort(
        (a, b) =>
          b.price - a.price
      )
      break

    case 'popular':
      list.sort(
        (a, b) =>
          b.sales - a.sales
      )
      break

    default:
      list.sort(
        (a, b) =>
          Number(b.destaque) -
            Number(a.destaque) ||
          b.sales - a.sales
      )
  }

  return list
})
</script>