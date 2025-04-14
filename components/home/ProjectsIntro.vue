<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const splitProjectsText = new SplitType('.projects-intro-content .inner', { types: 'chars' })

  const introProjectsTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.projects-intro',
      start: 'top top',
      end: 'bottom bottom+=10%',
      scrub: 0.6,
      markers: true,
    },
  })

  gsap.set(splitProjectsText.chars, { y: '100%' })

  introProjectsTl.to(splitProjectsText.chars, { y: 0, stagger: 1 })

  console.log(splitProjectsText)
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
  height: 300vh;
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
