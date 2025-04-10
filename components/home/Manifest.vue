<script lang="ts" setup>
import gsap from 'gsap'
const manifestContent1 = ref<HTMLElement | null>(null)
const manifestContent2 = ref<HTMLElement | null>(null)
let sentences1
let sentences2

onMounted(() => {
  sentences1 = manifestContent1.value!.querySelectorAll('.sentence .inner')
  sentences2 = manifestContent2.value!.querySelectorAll('.sentence .inner')

  console.log(sentences1)

  const manifestTl = gsap.timeline()
  manifestTl.set(sentences2, { y: 20 }).to(sentences1, { y: -20, stagger: 0.2 }).to(sentences2, { y: 0, stagger: 0.2 }, 0)
})
</script>

<template>
  <section class="manifest">
    <div class="manifest-container">
      <div class="manifest-content" ref="manifestContent1">
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
      </div>
      <div class="manifest-content" ref="manifestContent2">
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
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
