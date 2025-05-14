<script lang="ts" setup>
import gsap from 'gsap'
import projectsData from '~/assets/data/projects.json'
import type { Project } from '~/types'

const route = useRoute()
const currentProject = ref<Project>()
const currentFocusedImage = ref<number>(0)
const previousFocusedImage = ref<number>(0)
const projectImages = ref<string[]>([])

onMounted(async () => {
  currentProject.value = projectsData.find((project) => project.slug == route.params.slug)
  projectImages.value = currentProject.value!.images
  previousFocusedImage.value = projectImages.value.length - 1

  await nextTick()
  enterAnim()
})

const enterAnim = () => {
  const targetedImage = document.querySelector(`.image-slider.image--${currentFocusedImage.value}`)
  targetedImage?.classList.add('active')
}

const nextImage = () => {
  previousFocusedImage.value = currentFocusedImage.value
  currentFocusedImage.value = (currentFocusedImage.value + 1) % projectImages!.value.length
  animateSliderImages()
}
const prevImage = () => {
  previousFocusedImage.value = currentFocusedImage.value
  currentFocusedImage.value = (currentFocusedImage.value - 1 + projectImages!.value.length) % projectImages!.value.length
  animateSliderImages()
}

const animateSliderImages = (targetImageIndex?: number) => {
  const targetIndex = targetImageIndex ? targetImageIndex : currentFocusedImage.value
  const targetedImage = document.querySelector(`.image-slider.image--${targetIndex}`)
  const currentImage = document.querySelector(`.image-slider.active`)

  targetedImage?.classList.add('active')

  currentImage?.classList.remove('active')
  if (targetImageIndex) {
    currentFocusedImage.value = targetImageIndex
    previousFocusedImage.value = (currentFocusedImage.value - 1 + projectImages!.value.length) % projectImages!.value.length
  }
}
</script>

<template>
  <main class="main">
    <div class="focused-content">
      <div class="focused-image">
        <img :src="currentProject?.images[currentFocusedImage]" alt="" />
      </div>
      <div class="utils-project-informations">
        <p class="location">{{ currentProject?.location }}</p>
        <img src="/icons/square.svg" alt="" />
        <a :href="currentProject?.author.link" class="author">{{ currentProject?.author.name }}</a>
      </div>
    </div>
    <div class="project-informations">
      <h1 class="title">{{ currentProject?.name }}</h1>
      <p class="counter title">1/8</p>
    </div>
    <div class="slider">
      <p @click="prevImage" class="slider-navigation prev">prev</p>
      <div class="slider-images">
        <div v-for="(image, index) in currentProject?.images" :class="'image-slider image--' + index" @click="animateSliderImages(index)">
          <img :src="image" alt="" />
        </div>
      </div>
      <p @click="nextImage" class="slider-navigation next">next</p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
  background-color: white;
  > .focused-content {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    > .focused-image {
      height: 60vh;

      > img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
    > .utils-project-informations {
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 14px;
      > .location {
        font-style: italic;
        font-weight: 300;
      }
      > .author {
        text-decoration: underline;
      }
    }
  }
  > .project-informations {
    position: absolute;
    display: flex;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    justify-content: space-between;
    padding: 0 30px;
    > .title,
    .counter {
      max-width: 20%;
    }
  }
  > .slider {
    display: flex;
    gap: 34px;
    align-items: baseline;
    height: 15vh;
    bottom: 24px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    justify-content: center;

    > .slider-navigation {
      font-weight: 600;
      font-size: 18px;
    }
    > .slider-images {
      display: flex;
      gap: 24px;
      height: 100%;
      > .image-slider {
        transform: scale(0.8);
        transition: transform 0.4s;
        transform-origin: center bottom;
        height: 100%;
        aspect-ratio: 82/104;
        &.active {
          transform: scale(1);
        }
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
