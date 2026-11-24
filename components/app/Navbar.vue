<script lang="ts" setup>
const route = useRoute()
const { leave } = usePageTransition()

// Navigation avec le calque blanc (fade-in -> changement de page -> fade-out)
function goTo(path: string) {
  if (route.path === path) return
  leave(path)
}

// Anim d'entrée selon la page d'arrivée (voir composables/useNavbarAnimation.ts)
onMounted(() => {
  if (route.path === '/') navbarHomeEnter()
  else if (route.meta.navbarEnter !== 'page') navbarEnterTimeline()
  // sinon : la page joue l'anim dans sa propre timeline
})
</script>

<template>
  <nav class="navbar">
    <NuxtLink @click="$router.back()" class="home-link">TEKTURE</NuxtLink>

    <ul class="nav-links">
      <li class="nav-link menu-item">
        <!-- <a> simple (pas NuxtLink) : sinon le RouterLink navigue avant notre @click.prevent -->
        <a href="/projects" @click.prevent="goTo('/projects')"><span>Works</span></a>
      </li>
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
      span {
        display: inline-block;
      }
    }
  }
}
</style>
