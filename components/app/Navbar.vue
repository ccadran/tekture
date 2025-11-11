<script lang="ts" setup>
import gsap from 'gsap'

onMounted(() => {
  enterAnim()
})

function enterAnim() {
  const loaderNavTl = gsap.timeline({ delay: 1.25 })

  loaderNavTl
    .set('.navbar', { visibility: 'visible' })
    .fromTo('.navbar .home-link', { opacity: 0 }, { opacity: 1 })
    .to('.navbar .home-link', { scrambleText: { text: 'TEXTURE', speed: 1 }, duration: 2 }, 0)
    .fromTo('.nav-link span', { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, stagger: 0.15 }, 0.15)
}
</script>

<template>
  <nav class="navbar">
    <NuxtLink @click="$router.back()" class="home-link">TEKTURE</NuxtLink>

    <ul class="nav-links">
      <li class="nav-link menu-item"><span>Works</span></li>
      <li class="nav-link menu-item"><span>About</span></li>
      <li class="nav-link menu-item"><span>Contact</span></li>
    </ul>
  </nav>
</template>

<style lang="scss">
.navbar {
  position: fixed;
  top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100vw - 60px);
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;
  z-index: 11;
  > .home-link {
    font-size: 18px;
    font-weight: 800;
  }
  > .nav-links {
    display: flex;
    > .nav-link {
      margin-left: 32px;
      @media screen and (max-width: 760px) {
        margin-left: 12px;
      }
      // overflow: hidden;
      > span {
        display: inline-block;
      }
    }
  }
}
</style>
