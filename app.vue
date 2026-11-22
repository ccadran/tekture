<script setup>
import { useLenis } from '~/composables/useLenis'

const { lenis } = useLenis()
</script>

<template>
  <div class="transition-layer page-transition-layer"></div>
  <AppNavbar />
  <NuxtPage />
</template>

<style></style>
