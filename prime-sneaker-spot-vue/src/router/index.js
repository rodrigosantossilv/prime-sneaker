import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Catalogo from '../views/Catalogo.vue'
import Produto from '../views/Produto.vue'
import Favoritos from '../views/Favoritos.vue'
import AdminLogin from '../views/admin/Login.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminCatalog from '../views/admin/Catalogo.vue'
import AdminProdutoForm from '../views/admin/ProdutoForm.vue'
import AdminRemover from '../views/admin/Remover.vue'
import AdminEstatisticas from '../views/admin/Estatisiticas.vue'

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/catalogo',
    component: Catalogo,
  },
  {
    path: '/produto/:id',
    component: Produto,
  },
  {
    path: '/favoritos',
    component: Favoritos,
  },
  {
    path: '/admin/login',
    component: AdminLogin,
  },
  {
    path: '/admin/dashboard',
    component: AdminDashboard,
  },
  {
    path: '/admin/catalogo',
    component: AdminCatalog,
  },
  {
    path: '/admin/produto/novo',
    component: AdminProdutoForm,
  },
  {
    path: '/admin/remover',
    component: AdminRemover,
  },
  {
    path: '/admin/estatisticas',
    component: AdminEstatisticas,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})