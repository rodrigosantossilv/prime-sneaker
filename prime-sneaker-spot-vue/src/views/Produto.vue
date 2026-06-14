<template>
  <SiteLayout>
    <div v-if="!product" class="container-page py-24 text-center">
      <h1 class="text-2xl font-bold">Produto não encontrado</h1>

      <RouterLink
        to="/catalogo"
        class="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-white"
      >
        Voltar ao catálogo
      </RouterLink>
    </div>

    <div v-else class="container-page py-8">
      <button
        @click="goBack"
        class="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft class="h-4 w-4" />
        Voltar
      </button>

      <div class="grid gap-10 lg:grid-cols-2">

        <!-- GALERIA -->
        <div>
          <div class="overflow-hidden rounded-2xl border bg-muted">
            <img
              :src="gallery[activeImg]"
              :alt="product.name"
              class="aspect-square w-full object-cover"
            />
          </div>

          <div class="mt-3 flex gap-3">
            <button
              v-for="(img,index) in gallery"
              :key="index"
              @click="activeImg = index"
              :class="[
                'h-20 w-20 overflow-hidden rounded-lg border-2',
                index === activeImg
                  ? 'border-primary'
                  : 'border-transparent'
              ]"
            >
              <img
                :src="img"
                class="h-full w-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- INFORMAÇÕES -->
        <div>

          <div class="flex items-center gap-2">
            <span
              class="text-sm font-semibold uppercase tracking-wide text-primary"
            >
              {{ product.brand }}
            </span>

            <span
              class="rounded-md bg-muted px-2 py-1 text-xs"
            >
              {{ CATEGORY_LABELS[product.category] }}
            </span>

            <span
              v-if="product.destaque"
              class="rounded-md bg-primary px-2 py-1 text-xs text-white"
            >
              Mais vendido
            </span>
          </div>

          <h1 class="mt-2 text-3xl font-extrabold">
            {{ product.name }}
          </h1>

          <!-- Avaliações -->
          <div class="mt-3 flex items-center gap-2 text-sm">

            <span class="flex items-center">
              <Star
                v-for="n in 5"
                :key="n"
                :class="[
                  'h-4 w-4',
                  n <= Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                ]"
              />
            </span>

            <span class="font-medium">
              {{ product.rating.toFixed(1) }}
            </span>

            <span class="text-muted-foreground">
              ({{ product.reviews }} avaliações)
            </span>
          </div>

          <!-- PREÇO -->
          <div class="mt-6 rounded-xl border bg-card p-5">

            <div
              v-if="product.promocao && product.oldPrice"
              class="flex items-center gap-2"
            >
              <span class="text-sm line-through text-muted-foreground">
                {{ formatBRL(product.oldPrice) }}
              </span>

              <span
                class="rounded-md bg-green-600 px-2 py-1 text-xs text-white"
              >
                -{{ discountPercent(product.oldPrice, product.price) }}%
              </span>
            </div>

            <div class="text-4xl font-extrabold">
              {{ formatBRL(product.price) }}
            </div>

            <div class="mt-1 text-sm text-green-600">
              {{ formatParcelas(product.price, product.installments) }}
            </div>

            <div v-if="mercadoPrice" class="mt-3 rounded-xl border bg-slate-50 p-4 text-slate-900">
              <div class="text-sm font-medium text-slate-600">Preço Mercado Livre atual</div>
              <div class="mt-1 text-2xl font-bold">
                {{ formatBRL(mercadoPrice.price) }}
              </div>
              <div class="mt-1 text-xs text-muted-foreground">
                {{ mercadoPrice.currency }} • {{ mercadoPrice.availableQuantity }} em estoque
              </div>
            </div>

            <div v-if="mercadoError" class="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              {{ mercadoError }}
            </div>

            <div class="mt-5 flex gap-3">

              <a
                :href="product.mercadoLink"
                target="_blank"
                rel="noreferrer"
                class="flex flex-1 items-center justify-center rounded-md bg-primary px-4 py-3 text-white"
              >
                <ShoppingCart class="mr-2 h-5 w-5" />

                Comprar no Mercado Livre
              </a>

              <button
                @click="toggleFavorite(product.id)"
                class="rounded-md border px-4"
              >
                <Heart
                  :class="[
                    'h-5 w-5',
                    isFav &&
                    'fill-red-500 text-red-500'
                  ]"
                />
              </button>

            </div>

            <p class="mt-3 text-xs text-muted-foreground">
              A compra é finalizada no Mercado Livre através do seu link de afiliado.
            </p>

          </div>

          <!-- DESCRIÇÃO -->
          <div class="mt-6 space-y-3">

            <h2 class="text-lg font-bold">
              Descrição
            </h2>

            <DescRow
              label="Material"
              :value="product.description.material"
            />

            <DescRow
              label="Conforto"
              :value="product.description.conforto"
            />

            <DescRow
              label="Indicação de uso"
              :value="product.description.indicacao"
            />

          </div>

        </div>
      </div>

      <!-- RELACIONADOS -->
      <section
        v-if="relatedProducts.length"
        class="mt-16"
      >
        <h2 class="mb-6 text-2xl font-bold">
          Produtos relacionados
        </h2>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <ProductCard
            v-for="item in relatedProducts"
            :key="item.id"
            :product="item"
          />
        </div>
      </section>

    </div>
  </SiteLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import {
  Heart,
  Star,
  ShoppingCart,
  ChevronLeft,
} from 'lucide-vue-next'

import SiteLayout from '@/layouts/SiteLayout.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import DescRow from '@/components/products/DescRow.vue'

import { useProductsStore } from '@/stores/products'
import { useFavoritesStore } from '@/stores/favorites'

import {
  CATEGORY_LABELS,
} from '@/lib/data'

import {
  formatBRL,
  formatParcelas,
  discountPercent,
} from '@/lib/format'


const route = useRoute()

const productsStore = useProductsStore()
const favoritesStore = useFavoritesStore()

const activeImg = ref(0)

const product = computed(() => {
  const productId = Number(route.params.id)
  return productsStore.products.find(
    p => p.id === productId
  )
})

watch(
  () => route.params.id,
  () => {
    activeImg.value = 0
  }
)

const gallery = computed(() => {
  if (!product.value) return []

  return product.value.images?.length
    ? product.value.images
    : [product.value.image]
})

const isFav = computed(() => {
  if (!product.value) return false

  return favoritesStore.items.includes(
    product.value.id
  )
})

function toggleFavorite(id) {
  favoritesStore.toggleFavorite(id)
}

function goBack() {
  history.back()
}

const relatedProducts = computed(() => {
  if (!product.value) return []

  return productsStore.products
    .filter(
      p =>
        p.active &&
        p.id !== product.value.id &&
        p.category === product.value.category
    )
    .slice(0, 4)
})

const mercadoPrice = ref(null)
const mercadoError = ref('')

async function loadMercadoPrice() {
  if (!product.value || !product.value.mercadoLink) {
    mercadoPrice.value = null
    mercadoError.value = ''
    return
  }

  try {
    const response = await fetch(`/api/products/${product.value.id}/mercado-price`)
    if (!response.ok) {
      const data = await response.json().catch(() => null)
      mercadoError.value = data?.message || 'Não foi possível carregar o preço Mercado Livre.'
      mercadoPrice.value = null
      return
    }
    mercadoPrice.value = await response.json()
    mercadoError.value = ''
  } catch (error) {
    mercadoPrice.value = null
    mercadoError.value = 'Erro ao carregar preço Mercado Livre.'
  }
}

watch(
  () => product.value,
  () => {
    loadMercadoPrice()
  },
  { immediate: true }
)
</script>