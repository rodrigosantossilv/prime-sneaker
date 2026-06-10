<template>
  <div class="min-h-screen bg-muted flex items-center justify-center px-4">
    <div class="w-full max-w-sm bg-background rounded-2xl border border-border shadow-sm p-8">

      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="font-display text-2xl font-extrabold">
          Tênis <span class="text-primary">Prime</span>
        </h1>
        <p class="text-sm text-muted-foreground mt-1">Painel Administrativo</p>
      </div>

      <!-- Erro -->
      <div
        v-if="erro"
        class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
      >
        {{ erro }}
      </div>

      <!-- Form -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-foreground">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@tenisprime.com"
            class="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background transition"
            @keyup.enter="handleLogin"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-foreground">Senha</label>
          <input
            v-model="senha"
            type="password"
            placeholder="••••••••"
            class="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm outline-none focus:border-primary focus:bg-background transition"
            @keyup.enter="handleLogin"
          />
        </div>

        <button
          class="w-full bg-primary text-white font-bold rounded-lg py-2.5 text-sm hover:opacity-90 transition mt-2 disabled:opacity-50"
          :disabled="carregando"
          @click="handleLogin"
        >
          {{ carregando ? 'Entrando...' : 'Entrar' }}
        </button>
      </div>

      <p class="text-center text-xs text-muted-foreground mt-6">
        Acesso restrito a administradores
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

async function handleLogin() {
  erro.value = ''
  if (!email.value || !senha.value) {
    erro.value = 'Preencha e-mail e senha.'
    return
  }
  carregando.value = true
  await new Promise(r => setTimeout(r, 500))
  const result = authStore.login(email.value, senha.value)
  carregando.value = false
  if (result.success) {
    router.push('/admin/dashboard')
  } else {
    erro.value = result.message
  }
}
</script>