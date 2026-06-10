<template>
	<AdminLayout>
		<div class="p-6 space-y-6">
			<h1 class="text-2xl font-bold">Gerenciamento — Estatísticas</h1>

			<!-- Cards de resumo -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div class="p-4 border rounded">
					<div class="text-sm text-muted-foreground">Produtos totais</div>
					<div class="text-2xl font-semibold">{{ totalProducts }}</div>
				</div>

				<div class="p-4 border rounded">
					<div class="text-sm text-muted-foreground">Produtos ativos</div>
					<div class="text-2xl font-semibold">{{ activeProducts }}</div>
				</div>

				<div class="p-4 border rounded">
					<div class="text-sm text-muted-foreground">Vendas (estimadas)</div>
					<div class="text-2xl font-semibold">{{ totalSales }}</div>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<!-- Top vendedores -->
				<div class="lg:col-span-1 p-4 border rounded">
					<h2 class="font-semibold mb-3">Produtos mais vendidos</h2>
					<ul class="space-y-3">
						<li v-for="p in topSellers" :key="p.id" class="flex items-center justify-between">
							<div>
								<div class="font-medium">{{ p.name }}</div>
								<div class="text-sm text-muted-foreground">{{ p.brand }} • Vendas: {{ p.sales }}</div>
							</div>
							<div class="text-sm font-semibold">R$ {{ p.price }}</div>
						</li>
					</ul>
				</div>

				<!-- Produtos recentes (lista com ações) -->
				<div class="lg:col-span-2 p-4 border rounded">
					<div class="flex items-center justify-between mb-3">
						<h2 class="font-semibold">Produtos recentes / Gerenciar</h2>
						<RouterLink to="/admin/catalogo" class="text-sm text-primary">Ver catálogo</RouterLink>
					</div>

					<table class="w-full text-left table-auto">
						<thead>
							<tr class="text-sm text-muted-foreground">
								<th class="py-2">Produto</th>
								<th class="py-2">Preço</th>
								<th class="py-2">Vendas</th>
								<th class="py-2">Status</th>
								<th class="py-2">Ações</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="p in recentProducts" :key="p.id" class="border-t">
								<td class="py-3">
									<div class="font-medium">{{ p.name }}</div>
									<div class="text-sm text-muted-foreground">{{ p.brand }}</div>
								</td>
								<td class="py-3">R$ {{ p.price }}</td>
								<td class="py-3">{{ p.sales }}</td>
								<td class="py-3"> <span :class="p.active ? 'text-green-600' : 'text-red-600'">{{ p.active ? 'Ativo' : 'Inativo' }}</span></td>
								<td class="py-3">
									<div class="flex gap-2">
										<button @click="toggleActive(p)" class="px-2 py-1 border rounded text-sm">Toggle</button>
										<button @click="removeProductConfirm(p.id)" class="px-2 py-1 bg-red-600 text-white rounded text-sm">Remover</button>
										<RouterLink :to="`/produto/${p.id}`" class="px-2 py-1 border rounded text-sm">Ver</RouterLink>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup>
import { computed } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useProductsStore } from '@/stores/products'
import { RouterLink } from 'vue-router'

const productsStore = useProductsStore()

const totalProducts = computed(() => productsStore.products.length)
const activeProducts = computed(() => productsStore.products.filter(p => p.active).length)
const totalSales = computed(() => productsStore.products.reduce((s, p) => s + (Number(p.sales) || 0), 0))

const topSellers = computed(() => [...productsStore.products].sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5))

const recentProducts = computed(() => [...productsStore.products].sort((a, b) => Number(b.id || 0) - Number(a.id || 0)).slice(0, 20))

function removeProductConfirm(id) {
	if (confirm('Remover este produto?')) {
		productsStore.removeProduct(id)
	}
}

function toggleActive(product) {
	const updated = { ...product, active: !product.active }
	productsStore.updateProduct(updated)
}
</script>
