<script lang="ts" setup>
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const manifestContent1 = ref<HTMLElement | null>(null)
const manifestContent2 = ref<HTMLElement | null>(null)
let sentences1
let sentences2

onMounted(() => {
  // gsap.registerPlugin(ScrollTrigger)
  sentences1 = manifestContent1.value!.querySelectorAll('.sentence .inner')
  sentences2 = manifestContent2.value!.querySelectorAll('.sentence .inner')
  gsap.set(sentences2, { y: 20, opacity: 0 })

  const manifestTl = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: '.manifest',
      start: 'top top-=80%',
      end: 'top top-=80%',
      toggleActions: 'play none reverse none',
    },
  })

  manifestTl
    .to(sentences1, { y: -20, opacity: 0, ease: 'power1.out', duration: 0.5 })
    .to(sentences2, { y: 0, opacity: 1, ease: 'power1.out', duration: 0.5 }, 0)
})
</script>

<template>
  <section class="manifest">
    <div class="manifest-container">
      <div class="manifest-content" ref="manifestContent1">
        <div class="sentence">
          <p class="inner">At Tekture, we are a dynamic team of architects,</p>
        </div>
        <div class="sentence">
          <p class="inner">engineers, and designers committed to pushing the</p>
        </div>
        <div class="sentence">
          <p class="inner">boundaries of modern architecture.</p>
        </div>
      </div>
      <div class="manifest-content" ref="manifestContent2">
        <div class="sentence">
          <p class="inner">Our focus is on creating innovative, sustainable designs that</p>
        </div>
        <div class="sentence">
          <p class="inner">blend striking aesthetics with eco-friendly solutions, ensuring everye</p>
        </div>
        <!-- <div class="sentence">
          <p class="inner"></p>
        </div> -->
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.manifest {
  height: 300vh;
  position: relative;
  margin-bottom: 50vh;
  @media screen and (max-width: 760px) {
    height: 200vh;
  }
  > .manifest-container {
    height: 100vh;
    width: 80vw;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    > .manifest-content {
      position: absolute;
      display: flex;
      flex-direction: column;
      gap: 6px;
      > .sentence {
        overflow: hidden;
        > .inner {
          font-size: 24px;
          text-align: center;
          line-height: 130%;
          @media screen and (max-width: 760px) {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
