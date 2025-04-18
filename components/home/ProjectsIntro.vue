<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
let images: HTMLElement[] = []

onMounted(() => {
  const splitProjectsText = new SplitType('.projects-intro-content .inner', { types: 'chars' })

  const introProjectsTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.projects-intro-images',
      start: 'top top',
      end: 'bottom bottom+=10%',
      scrub: 0.6,
      markers: true,
    },
  })

  gsap.set(splitProjectsText.chars, { y: '100%' })

  introProjectsTl.to(splitProjectsText.chars, { y: 0, stagger: 1 })
  images = gsap.utils.toArray('.grid-image')

  ScrollTrigger.create({
    trigger: '.projects-intro',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress
      images.forEach((el: HTMLElement, i: number) => {
        const direction = i % 2 === 0 ? -25 : 10
        gsap.set(el, {
          y: `${progress * direction}vw`,
        })
      })
    },
  })
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
          <img class="inner" src="/images/1.png" alt="" />
        </div>
        <div class="grid-image" data-image="2">
          <img class="inner" src="/images/2.png" alt="" />
        </div>
        <div class="grid-image" data-image="3">
          <img class="inner" src="/images/3.png" alt="" />
        </div>
        <div class="grid-image" data-image="4">
          <img class="inner" src="/images/4.png" alt="" />
        </div>
        <div class="grid-image" data-image="5">
          <img class="inner" src="/images/2.png" alt="" />
        </div>
        <div class="grid-image" data-image="6">
          <img class="inner" src="/images/1.png" alt="" />
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
    z-index: 1;
    > .inner {
      font-size: 18.5vw;
      font-weight: 800;
    }
  }
  > .projects-intro-images {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    > .grid-images {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: repeat(24, 1fr);
      width: 100%;
      height: 100%;
      > .grid-image {
        overflow: hidden;
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
          grid-column: 7/12;
          grid-row: 3/6;
        }
        &[data-image='3'] {
          grid-column: 2/5;
          grid-row: 8/12;
        }
        &[data-image='4'] {
          grid-column: 10/12;
          grid-row: 11/14;
        }
        &[data-image='5'] {
          grid-column: 3/7;
          grid-row: 15/18;
        }
        &[data-image='6'] {
          grid-column: 9/11;
          grid-row: 17/19;
        }
      }
    }
  }
}
</style>
