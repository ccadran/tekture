<script lang="ts" setup>
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
gsap.registerPlugin(ScrambleTextPlugin)

onMounted(() => {
  enterAnim()
})

function enterAnim() {
  const loaderNavTl = gsap.timeline({ delay: 1.25 })

  loaderNavTl
    .fromTo('.navbar .home', { opacity: 0 }, { opacity: 1 })
    .to('.navbar .home', { scrambleText: { text: 'TEXTURE', speed: 1 }, duration: 2 }, 0)
    .fromTo('.nav-link span', { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, stagger: 0.15 }, 0.15)
}
</script>

<template>
  <nav class="navbar">
    <a class="home" href="/">TEKTURE</a>
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

  > .home {
    font-size: 18px;
    font-weight: 800;
  }
  > .nav-links {
    display: flex;
    > .nav-link {
      margin-left: 32px;
      // overflow: hidden;
      > span {
        display: inline-block;
      }
    }
  }
}
</style>
