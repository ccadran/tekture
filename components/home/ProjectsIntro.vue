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
    <div class="projects-intro-images">
      <div class="grid-images">
        <div class="grid-image" data-image="1">
          <img src="/images/1.png" alt="" />
        </div>
        <div class="grid-image" data-image="2">
          <img src="/images/2.png" alt="" />
        </div>
        <div class="grid-image" data-image="3">
          <img src="/images/3.png" alt="" />
        </div>
      </div>
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
  > .projects-intro-images {
    width: 100%;
    height: 100%;
    > .grid-images {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: repeat(24, 1fr);
      width: 100%;
      height: 100%;
      > .grid-image {
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &[data-image='1'] {
          grid-column: 2/4;
          grid-row: 1/4;
        }
        &[data-image='2'] {
          grid-column: 6/12;
          grid-row: 3/6;
        }
        &[data-image='3'] {
          grid-column: 3/6;
          grid-row: 8/12;
        }
      }
    }
  }
}
</style>
