<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Adicionar Produto</h1>

      <form @submit.prevent="handleSubmit" class="grid gap-3 max-w-md">

        <!-- Área de imagem: preview, paste e upload (multiplas) -->
        <div>
          <label class="text-sm font-medium mb-2 block">Imagem do produto</label>
          <div
            class="border-dashed border-2 rounded p-4 flex items-center justify-center text-center cursor-pointer"
            @click="fileInput.click()"
            @paste.prevent="handlePaste"
          >
            <div v-if="images.length">
              <img :src="images[0]" class="max-w-xs max-h-48 object-contain rounded" />
              <div class="mt-2 text-sm text-muted-foreground">Imagem colada/carregada (mostrando 1 de {{ images.length }})</div>
            </div>
            <div v-else>
              <div class="text-sm text-muted-foreground">Cole (Ctrl+V) uma imagem ou clique para selecionar arquivos</div>
            </div>
            <input ref="fileInput" type="file" accept="image/*" class="hidden" multiple @change="handleFileChange" />
          </div>

          <div v-if="images.length" class="mt-3 flex gap-2 overflow-x-auto">
            <button v-for="(img, idx) in images" :key="idx" type="button" @click="removeImage(idx)" class="relative">
              <img :src="img" class="h-20 w-20 object-cover rounded border" />
              <span class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1">x</span>
            </button>
          </div>
        </div>

        <input v-model="name" placeholder="Nome" class="border px-3 py-2 rounded" />
        <input v-model="brand" placeholder="Marca" class="border px-3 py-2 rounded" />

        <div class="flex items-center gap-2">
          <input v-model.number="price" type="number" placeholder="Preço" class="border px-3 py-2 rounded flex-1" />
          <input v-model="category" placeholder="Categoria" class="border px-3 py-2 rounded w-56" />
        </div>

        <label class="flex items-center gap-2"><input type="checkbox" v-model="active" /> Ativo</label>

        <!-- Link do Mercado Livre -->
        <div class="flex items-center gap-2">
          <input v-model="marketplaceLink" placeholder="Link do Mercado Livre (opcional)" class="border px-3 py-2 rounded flex-1" />
          <a v-if="marketplaceLink" :href="marketplaceLink" target="_blank" rel="noopener" class="px-3 py-2 rounded bg-primary text-white">Ir para ML</a>
        </div>

        <div class="flex gap-2">
          <button class="bg-primary text-white px-4 py-2 rounded">Salvar</button>
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
const category = ref('')
const active = ref(true)
const images = ref([])
const marketplaceLink = ref('')

const productsStore = useProductsStore()
const router = useRouter()

const fileInput = ref(null)

function handleFileChange(e) {
  const list = e.target.files
  if (!list || !list.length) return
  for (const f of Array.from(list)) {
    const reader = new FileReader()
    reader.onload = () => {
      images.value.push(reader.result)
    }
    reader.readAsDataURL(f)
  }
}

function removeImage(idx) {
  images.value.splice(idx, 1)
}

async function handlePaste(e) {
  const items = (e.clipboardData || window.clipboardData).items
  if (!items) return
  for (const it of items) {
    if (it.kind === 'file') {
      const f = it.getAsFile()
      if (f) {
        const reader = new FileReader()
        reader.onload = () => images.value.push(reader.result)
        reader.readAsDataURL(f)
        return
      }
    }
    if (it.kind === 'string') {
      it.getAsString(txt => {
        // se for URL de imagem, usar como imagem
        if (/^https?:\/\/.+\.(png|jpe?g|gif|webp)$/i.test(txt)) {
          images.value.push(txt)
        } else if (/mercadolibre/i.test(txt)) {
          marketplaceLink.value = txt
        }
      })
    }
  }
}

async function handleSubmit() {
  const product = {
    name: name.value || 'Novo produto',
    brand: brand.value || 'Marca',
    price: Number(price.value) || 0,
    category: category.value || 'Geral',
    destaque: false,
    sales: 0,
    active: active.value,
    images: images.value.length ? images.value : [],
    image: images.value.length ? images.value[0] : '',
    marketplaceLink: marketplaceLink.value || '',
    mercadoLink: marketplaceLink.value || '',
    rating: 0,
    reviews: 0,
    description: { material: '', conforto: '', indicacao: '' },
    installments: 1,
    promocao: false,
    oldPrice: null,
  }

  try {
    await productsStore.addProduct(product)
    router.push('/admin/catalogo')
  } catch (error) {
    alert('Erro ao cadastrar o produto. Tente novamente.')
  }
}
</script>

