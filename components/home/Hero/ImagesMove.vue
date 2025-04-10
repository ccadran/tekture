<script lang="ts" setup>
import gsap from 'gsap'

const props = defineProps<{
  heroElement: HTMLElement | null
}>()

const images = ref([
  { id: 1, src: '/images/1.png' },
  { id: 2, src: '/images/2.png' },
  { id: 3, src: '/images/3.png' },
  { id: 4, src: '/images/4.png' },
  { id: 5, src: '/images/1.png' },
  { id: 6, src: '/images/2.png' },
  { id: 7, src: '/images/3.png' },
])

const imageContainerRef = ref<HTMLElement | null>(null)
const imageRefs = ref<HTMLImageElement[]>([])
const DISTANCE_X_THRESHOLD = 350
const DISTANCE_Y_THRESHOLD = 100

let rafId: number | null = null

const mouseTracking = reactive({
  current: { x: 0, y: 0 },
  previous: { x: null as number | null, y: 0 },
  distance: { x: 0, y: 0 },
  totalDistance: { x: 0, y: 0 },
  currentImageIndex: 0,
  isMoving: false,
})

const handleMouseMove = (e: MouseEvent) => {
  const rect = imageContainerRef.value!.getBoundingClientRect()

  const isInBounds = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom

  if (!isInBounds) return

  mouseTracking.current.x = e.pageX
  mouseTracking.current.y = e.pageY
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

onMounted(async () => {
  await nextTick()

  if (imageContainerRef.value) {
    imageContainerRef.value.addEventListener('mousemove', handleMouseMove)
  }
})

onUnmounted(() => {
  if (imageContainerRef.value) {
    imageContainerRef.value.removeEventListener('mousemove', handleMouseMove)
  }
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <div ref="imageContainerRef" class="mousemove-images">
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
  height: 80vh;
  width: 100vw;
  position: absolute;
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
