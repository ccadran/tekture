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

const keyWords = ['innovation', 'expertise', 'sustainable', 'results', 'Strategy', 'fondation']
const currentIndices = ref<number[]>([])

const imageRefs = ref<HTMLImageElement[]>([])
const keyWordsRefs = ref<any[]>([])
const DISTANCE_X_THRESHOLD = 350
const DISTANCE_Y_THRESHOLD = 100
const SHUFFLE_DURATION = 1

const mouseTracking = ref({
  currentX: 0,
  currentY: 0,
  previousX: null as number | null,
  previousY: 0,
  distanceX: 0,
  distanceY: 0,
  totalXdistance: 0,
  totalYdistance: 0,
  currentImageIndex: 0,
})

const handleMouseMove = (e: MouseEvent) => {
  const m = mouseTracking.value
  m.currentX = e.clientX
  m.currentY = e.clientY
  if (m.previousX !== null) {
    m.distanceX = Math.abs(m.currentX - m.previousX)
    m.distanceY = Math.abs(m.currentY - m.previousY)

    m.totalXdistance += m.distanceX
    m.totalYdistance += m.distanceY

    if (m.totalXdistance > DISTANCE_X_THRESHOLD || m.totalYdistance > DISTANCE_Y_THRESHOLD) {
      animateImage(m.currentImageIndex, e.clientX, e.clientY)
      m.totalXdistance = 0
      m.totalYdistance = 0

      m.currentImageIndex = (m.currentImageIndex + 1) % imageRefs.value.length
    }
  }
  m.previousX = m.currentX
  m.previousY = m.currentY
}

const animateImage = (imageIndex: number, x: number, y: number) => {
  const image = imageRefs.value[imageIndex]
  if (!image) return
  gsap.killTweensOf(image)

  const imagesTl = gsap.timeline()
  imagesTl.fromTo(image, { x: x - image.offsetWidth / 2, y: y + 50, opacity: 0 }, { y, opacity: 1 }).to(image, { y: y + 20, opacity: 0 }, '>')
}
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  console.log(shuffleTextRef.value)
  currentIndices.value = keyWords.map((_, i) => i)

  textShuffleLoop()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
const shuffleTextRef = ref()

const handleClick = () => {
  if (shuffleTextRef.value) {
    shuffleTextRef.value.animate()
  } else {
    console.log('___________')
  }
}

let currentTextIndex = 0

const textShuffleLoop = () => {
  const ref = keyWordsRefs.value[currentTextIndex]
  const currentWordIndex = currentIndices.value[currentTextIndex]
  const nextWordIndex = (currentWordIndex + 1) % keyWords.length

  if (ref && ref.animate) {
    ref.animate(keyWords[currentWordIndex], keyWords[nextWordIndex])
  }

  currentIndices.value[currentTextIndex] = nextWordIndex

  currentTextIndex = (currentTextIndex + 1) % keyWordsRefs.value.length

  setTimeout(() => {
    textShuffleLoop()
  }, SHUFFLE_DURATION * 1000)
}
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
  <div class="shuffle-keywords">
    <UtilsTextShuffle
      v-for="(word, index) in keyWords"
      :duration="SHUFFLE_DURATION"
      :ref="
        (el) => {
          if (el) keyWordsRefs[index] = el
        }
      "
      >{{ word }}</UtilsTextShuffle
    >
    <!-- <UtilsTextShuffle
      :duration="SHUFFLE_DURATION"
      :ref="
        (el) => {
          if (el) keyWordsRefs[0] = el as HTMLElement
        }
      "
      >YOOOO</UtilsTextShuffle
    >
    <UtilsTextShuffle
      :duration="SHUFFLE_DURATION"
      from="IOCDZNSDCOIS"
      to="YOOOO"
      :ref="
        (el) => {
          if (el) keyWordsRefs[1] = el as HTMLElement
        }
      "
      >NDLSNVDSKL</UtilsTextShuffle
    >
    <UtilsTextShuffle
      :duration="SHUFFLE_DURATION"
      from="NCODSLNCS"
      to="YOOOO"
      :ref="
        (el) => {
          if (el) keyWordsRefs[2] = el as HTMLElement
        }
      "
    ></UtilsTextShuffle> -->
  </div>
  <section class="hero">
    <div class="content">
      <h1>TEKTURE</h1>
      <div class="baseline">
        <p>new gen architectural studio</p>
        <!-- <UtilsTextShuffle text="HELLO" ref="shuffleTextRef" /> -->
      </div>
      <p @click="handleClick">YOOO</p>
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
.shuffle-keywords {
  position: absolute;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
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
    > img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
