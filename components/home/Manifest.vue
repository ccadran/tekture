<script lang="ts" setup>
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const manifestContent1 = ref<HTMLElement | null>(null)
const manifestContent2 = ref<HTMLElement | null>(null)
let sentences1
let sentences2

onMounted(() => {
  sentences1 = manifestContent1.value!.querySelectorAll('.sentence .inner')
  sentences2 = manifestContent2.value!.querySelectorAll('.sentence .inner')
  gsap.set(sentences2, { y: 20, opacity: 0 })
  console.log(sentences1)

  const manifestTl = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: '.manifest',
      start: 'top -=250vh',
      end: 'top -=250vh',
      toggleActions: 'play none reverse none',
      markers: true,
    },
  })

  manifestTl.to(sentences1, { y: -20, opacity: 0 }).to(sentences2, { y: 0, opacity: 1 }, 0)
})
</script>

<template>
  <section class="manifest">
    <div class="manifest-container">
      <div class="manifest-content" ref="manifestContent1">
        <div class="sentence">
          <p class="inner">1Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dotur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecat quasi ex!</p>
        </div>
      </div>
      <div class="manifest-content" ref="manifestContent2">
        <div class="sentence">
          <p class="inner">Lorem ipsum sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor , adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.manifest {
  height: 200vh;
  position: relative;
  > .manifest-container {
    height: 100vh;
    width: 100vw;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    > .manifest-content {
      position: absolute;
      display: flex;
      flex-direction: column;
      gap: 24px;
      > .sentence {
        overflow: hidden;
      }
    }
  }
}
</style>
