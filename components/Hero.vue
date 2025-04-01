<script lang="ts" setup>
import gsap from 'gsap'
import { onMounted, onUnmounted, ref } from 'vue'

const images = ref([
  { id: 1, src: '/images/1.png' },
  { id: 2, src: '/images/2.png' },
  { id: 3, src: '/images/3.png' },
  { id: 4, src: '/images/4.png' },
  { id: 5, src: '/images/1.png' },
  { id: 6, src: '/images/2.png' },
  { id: 7, src: '/images/3.png' },
])

const imageRefs = ref<HTMLImageElement[]>([])
let currentX: number
let previousX: number | null = null
let distanceX: number
let distanceY: number
let currentY: number
let previousY: number
let totalYdistance = 0
let totalXdistance = 0
let i = 0
const handleMouseMove = (e: MouseEvent) => {
  currentX = e.clientX
  currentY = e.clientY
  if (previousX !== null) {
    distanceX = Math.abs(currentX - previousX)
    distanceY = Math.abs(currentY - previousY)

    totalXdistance += distanceX
    totalYdistance += distanceY

    if (totalXdistance > 150 || totalYdistance > 100) {
      const imageX = e.clientX
      const imageY = e.clientY
      const imagesTl = gsap.timeline()
      imagesTl
        .fromTo(
          imageRefs.value[i],
          {
            x: imageX,
            y: imageY + 50,
            opacity: 0,
          },
          {
            y: imageY,
            opacity: 1,
          }
        )
        .to(imageRefs.value[i], { y: imageY + 50, opacity: 0 }, 0.5)
      totalXdistance = 0
      totalYdistance = 0
      if (i < imageRefs.value.length - 1) {
        i++
      } else {
        i = 0
      }
    }
  }
  previousX = currentX
  previousY = currentY
}
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="mousemove-images">
    <img
      v-for="(image, index) in images"
      :key="image.id"
      :src="image.src"
      :alt="`Image ${image.id}`"
      :style="image.style"
      :ref="
        (el) => {
          if (el) imageRefs[index] = el as HTMLImageElement
        }
      "
      class="floating-image"
    />
  </div>
  <section class="hero">
    <div class="content">
      <h1>TEKTURE</h1>
      <div class="baseline">
        <p>new gen architectural studio</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  > .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    > h1 {
      font-size: 124px;
      font-weight: 800;
    }
  }
}
.mousemove-images {
  height: 100vh;
  width: 100vw;
  position: absolute;
  pointer-events: none;
  > img {
    position: absolute;
    opacity: 0.5;
  }
}
</style>
