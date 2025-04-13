<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
onMounted(() => {
  const spliteProjectsText = new SplitType('.projects-intro-content .inner', { types: 'chars' })
})
</script>

<template>
  <section class="projects-intro">
    <div class="projects-intro-content">
      <p class="inner">PROJECTS</p>
    </div>
  </section>
</template>

<style lang="scss">
.projects-intro {
  height: 200vh;
  position: relative;
  > .projects-intro-content {
    height: 100vh;
    width: 100vw;
    position: sticky;
    display: flex;
    align-items: end;
    top: 0;
    > .inner {
      font-size: 18.5vw;
      font-weight: 800;
    }
  }
}
</style>
