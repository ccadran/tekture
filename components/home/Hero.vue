<script lang="ts" setup>
import gsap from 'gsap'
const hero = ref<HTMLElement | null>(null)
const title1 = ref<HTMLElement | null>(null)
const title2 = ref<HTMLElement | null>(null)
const baseline = ref<HTMLElement | null>(null)

onMounted(() => {
  const loaderTl = gsap.timeline()

  //todo tl for baseline

  loaderTl
    .fromTo(title1.value, { left: '0%' }, { left: '50%' })
    .fromTo(title2.value, { left: '100%' }, { left: '50%' }, 0)
    .fromTo(title1.value, { y: '-35%' }, { y: '0%', duration: 0.5, ease: 'power1.inOut' }, '>')
    .fromTo(title2.value, { y: '35%' }, { y: '0%', duration: 0.5, ease: 'power1.inOut' }, '<')
    .fromTo(baseline.value, { y: '-200%', opacity: 0 }, { y: '0%', opacity: 1 }, '>-0.15')
    .to('.marker.-left', { left: '-16px' }, '>')
    .to('.marker.-right', { right: '-16px' }, '<')
    .fromTo('.baseline .content', { clipPath: 'inset( 0% 50% 0% 50%)' }, { clipPath: 'inset( 0% 0% 0% 0%)' }, '>-0.5')
})
</script>

<template>
  <!-- <HomeHeroImagesMove /> -->
  <HomeHeroKeywords />

  <section class="hero" ref="hero">
    <div class="content">
      <div class="main-title-container">
        <h1 class="inner">TEKTURE</h1>
        <h1 ref="title1" class="main-title">TEKTURE</h1>
        <h1 ref="title2" class="main-title">TEKTURE</h1>
      </div>
      <div ref="baseline" class="baseline">
        <img class="marker -left" src="/icons/marker.svg" alt="" />
        <p class="content">new gen architectural studio</p>
        <img class="marker -right" src="/icons/marker.svg" alt="" />
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
    > .main-title-container {
      font-size: 124px;
      font-weight: 800;
      position: relative;
      > .inner {
        visibility: hidden;
      }
      > .main-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &:nth-of-type(2) {
          clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
        }
        &:nth-of-type(3) {
          clip-path: polygon(49.5% 0, 100% 0, 100% 100%, 49.5% 100%);
        }
      }
    }
    > .baseline {
      display: flex;
      align-items: center;
      gap: 8px;
      > .marker {
        position: absolute;
        transform: translateX(-48%);
        &.-left {
          left: 48%;
        }
        &.-right {
          right: 48%;
          transform: rotate(180deg);
        }
      }
      > .content {
        clip-path: inset(0 50% 0 50%);
      }
    }
  }
}
</style>
