<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Adicionar Produto</h1>

      <form @submit.prevent="handleSubmit" class="grid gap-3 max-w-md">

        <!-- Imagens por URL -->
        <div>
          <label class="text-sm font-medium mb-2 block">Imagens do produto (URLs)</label>

          <div class="flex gap-2 mb-2">
            <input
              v-model="newImageUrl"
              placeholder="Cole a URL da imagem aqui"
              class="border px-3 py-2 rounded flex-1"
              @keydown.enter.prevent="addImageUrl"
            />
            <button type="button" @click="addImageUrl" class="px-3 py-2 bg-primary text-white rounded">
              Adicionar
            </button>
          </div>

          <!-- Preview das imagens -->
          <div v-if="images.length" class="mt-3 flex gap-2 overflow-x-auto">
            <div v-for="(img, idx) in images" :key="idx" class="relative shrink-0">
              <img :src="img" class="h-20 w-20 object-cover rounded border" />
              <button
                type="button"
                @click="removeImage(idx)"
                class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1"
              >x</button>
            </div>
          </div>

          <div v-if="images.length" class="mt-2">
            <img :src="images[0]" class="max-w-xs max-h-48 object-contain rounded border" />
            <div class="text-sm text-muted-foreground mt-1">Preview principal (1 de {{ images.length }})</div>
          </div>
        </div>

        <input v-model="name" placeholder="Nome" class="border px-3 py-2 rounded" required />
        <input v-model="brand" placeholder="Marca" class="border px-3 py-2 rounded" required />

        <div class="flex items-center gap-2">
          <input v-model.number="price" type="number" step="0.01" placeholder="Preço" class="border px-3 py-2 rounded flex-1" required />
          <input v-model="category" placeholder="Categoria" class="border px-3 py-2 rounded w-56" />
        </div>

        <div class="grid gap-3">
          <textarea v-model="material" placeholder="Material" class="border px-3 py-2 rounded min-h-[80px]"></textarea>
          <textarea v-model="conforto" placeholder="Conforto" class="border px-3 py-2 rounded min-h-[80px]"></textarea>
          <textarea v-model="indicacao" placeholder="Indicação de uso" class="border px-3 py-2 rounded min-h-[80px]"></textarea>
        </div>

        <label class="flex items-center gap-2">
          <input type="checkbox" v-model="active" /> Ativo
        </label>

        <div class="flex items-center gap-2">
          <input v-model="mercadoLink" placeholder="Link do Mercado Livre (opcional)" class="border px-3 py-2 rounded flex-1" />
          <a v-if="mercadoLink" :href="mercadoLink" target="_blank" rel="noopener" class="px-3 py-2 rounded bg-primary text-white">
            Ir para ML
          </a>
        </div>

        <div class="flex gap-2">
          <button type="submit" class="bg-primary text-white px-4 py-2 rounded">Salvar</button>
          <RouterLink to="/admin/dashboard" class="px-4 py-2 rounded border">Cancelar</RouterLink>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useProductsStore } from '@/stores/products'
import { useRouter, RouterLink } from 'vue-router'

const name = ref('')
const brand = ref('')
const price = ref(0)
const category = ref('Geral')
const active = ref(true)
const images = ref([])
const mercadoLink = ref('')
const material = ref('')
const conforto = ref('')
const indicacao = ref('')
const newImageUrl = ref('')

const productsStore = useProductsStore()
const router = useRouter()

function addImageUrl() {
  const url = newImageUrl.value.trim()
  if (!url) return
  images.value.push(url)
  newImageUrl.value = ''
}

function removeImage(idx) {
  images.value.splice(idx, 1)
}

async function handleSubmit() {
  const product = {
    name: name.value,
    brand: brand.value,
    price: Number(price.value),
    category: category.value || 'Geral',
    active: active.value,
    image: images.value[0] || '',
    images: images.value,
    mercadoLink: mercadoLink.value,
    destaque: false,
    promocao: false,
    oldPrice: null,
    rating: 0,
    reviews: 0,
    sales: 0,
    installments: 1,
    description: {
      material: material.value,
      conforto: conforto.value,
      indicacao: indicacao.value,
    },
  }

  try {
    await productsStore.addProduct(product)
    router.push('/admin/catalogo')
  } catch (error) {
    alert(error?.message || 'Erro ao cadastrar o produto.')
  }
}
</script>