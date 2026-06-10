<template>
  <footer class="mt-16 border-t bg-sidebar text-sidebar-foreground">
    <div class="container-page grid gap-10 py-12 md:grid-cols-4">

      <!-- Logo -->
      <div>
        <span class="font-display text-xl font-extrabold">
          Tênis <span class="text-primary">Prime</span>
        </span>

        <p class="mt-3 text-sm text-sidebar-foreground/70">
          Os melhores tênis do Mercado Livre, reunidos e curados em um só lugar.
        </p>
      </div>

      <!-- Institucional -->
      <div>
        <h4 class="mb-3 text-sm font-semibold">
          Institucional
        </h4>

        <ul class="space-y-2 text-sm text-sidebar-foreground/70">
          <li>
            <RouterLink to="/" class="hover:text-primary">
              Sobre o site
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/" class="hover:text-primary">
              Política de Privacidade
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/" class="hover:text-primary">
              Termos de Uso
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/" class="hover:text-primary">
              Contato
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Redes -->
      <div>
        <h4 class="mb-3 text-sm font-semibold">
          Redes
        </h4>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-primary"
        >
          <Instagram class="h-4 w-4" />
          Instagram
        </a>
      </div>

      <!-- Newsletter -->
      <div>
        <h4 class="mb-3 text-sm font-semibold">
          Newsletter
        </h4>

        <p class="mb-3 text-sm text-sidebar-foreground/70">
          Receba as melhores ofertas no seu e-mail.
        </p>

        <form
          class="flex gap-2"
          @submit.prevent="handleSubmit"
        >
          <input
            v-model="email"
            type="email"
            required
            placeholder="Seu e-mail"
            class="flex-1 rounded-md border bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Assinar
          </button>
        </form>
      </div>

    </div>

    <div class="border-t border-sidebar-border">
      <div
        class="container-page py-4 text-center text-xs text-sidebar-foreground/60"
      >
        As compras são realizadas no Mercado Livre através de links de afiliado.

        © {{ currentYear }} Tênis Prime.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Instagram } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const email = ref('')

const currentYear = new Date().getFullYear()

function handleSubmit() {
  if (!email.value.includes('@')) {
    return
  }

  toast.success(
    'E-mail cadastrado! Você receberá nossas ofertas.'
  )

  email.value = ''
}
</script>