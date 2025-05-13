<script setup>
import { useLenis } from '~/composables/useLenis'

const { lenis } = useLenis()
</script>

<template>
  <AppNavbar />
  <NuxtPage />
  <AppFooter />

  <!-- <div class="div"></div> -->
</template>

<style>
.div {
  height: 150vh;
}
</style>
