<script lang="ts" setup>
const hero = ref<HTMLElement | null>(null)
</script>

<template>
  <HomeHeroImagesMove :hero-element="hero" />
  <HomeHeroKeywords />
  <section class="hero" ref="hero">
    <div class="content">
      <h1>TEKTURE</h1>
      <div class="baseline">
        <p>new gen architectural studio</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  > .content {
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    gap: 32px;
    > h1 {
      font-size: 124px;
      font-weight: 800;
    }
  }
}
</style>
