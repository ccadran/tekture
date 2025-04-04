<script lang="ts" setup>
import gsap from 'gsap'

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
const DISTANCE_X_THRESHOLD = 350
const DISTANCE_Y_THRESHOLD = 100

const mouseTracking = reactive({
  current: { x: 0, y: 0 },
  previous: { x: null as number | null, y: 0 },
  distance: { x: 0, y: 0 },
  totalDistance: { x: 0, y: 0 },
  currentImageIndex: 0,
  isMoving: false,
})
let rafId: number | null = null

const handleMouseMove = (e: MouseEvent) => {
  mouseTracking.current.x = e.clientX
  mouseTracking.current.y = e.clientY
  mouseTracking.isMoving = true

  if (!rafId) {
    rafId = requestAnimationFrame(updateMouseAnimation)
  }
}

const updateMouseAnimation = () => {
  const m = mouseTracking

  if (m.isMoving && m.previous.x !== null) {
    m.distance.x = Math.abs(m.current.x - m.previous.x)
    m.distance.y = Math.abs(m.current.y - m.previous.y)

    m.totalDistance.x += m.distance.x
    m.totalDistance.y += m.distance.y

    if (m.totalDistance.x > DISTANCE_X_THRESHOLD || m.totalDistance.y > DISTANCE_Y_THRESHOLD) {
      animateImage(m.currentImageIndex, m.current.x, m.current.y)
      m.totalDistance.x = 0
      m.totalDistance.y = 0

      m.currentImageIndex = (m.currentImageIndex + 1) % imageRefs.value.length
    }
  }

  m.previous.x = m.current.x
  m.previous.y = m.current.y
  m.isMoving = false

  rafId = requestAnimationFrame(updateMouseAnimation)
}

const animateImage = (imageIndex: number, x: number, y: number) => {
  const image = imageRefs.value[imageIndex]
  if (!image) return
  gsap.killTweensOf(image)

  const imagesTl = gsap.timeline()
  imagesTl
    .fromTo(image, { x: x - image.offsetWidth / 2, y: y + 50, opacity: 0 }, { y, opacity: 1, ease: 'power1.out' })
    .to(image, { y: y + 20, opacity: 0, ease: 'power1.inOut' }, '>')
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="mousemove-images">
    <div
      v-for="(image, index) in images"
      :key="image.id"
      class="floating-image"
      :ref="
(el) => {
  if (el) imageRefs[index] = el as HTMLImageElement
}
"
    >
      <img :src="image.src" :alt="`Image ${image.id}`" />
    </div>
  </div>
</template>

<style lang="scss">
.mousemove-images {
  z-index: -1;
  height: 100vh;
  width: 100vw;
  position: absolute;
  pointer-events: none;
  > .floating-image {
    position: absolute;
    opacity: 0.5;
    width: 200px;
    aspect-ratio: 3/4;
    overflow: hidden;
    will-change: transform, opacity;
    > img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
