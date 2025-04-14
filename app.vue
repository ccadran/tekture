<script setup>
import { useLenis } from '~/composables/useLenis'

// Initialiser Lenis une seule fois au niveau du composant racine
const { lenis } = useLenis()
</script>

<template>
  <div>
    <UiNavbar />
    <HomeHero />
    <HomeManifest />
    <HomeProjectsIntro />
    <div class="div"></div>
  </div>
</template>

<style>
.div {
  height: 150vh;
}
</style>
