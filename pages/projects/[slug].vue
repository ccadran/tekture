<script lang="ts" setup>
import gsap from 'gsap'

import projectsData from '~/assets/data/projects.json'
import type { Project } from '~/types'

import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

gsap.registerPlugin(ScrambleTextPlugin)

gsap.registerPlugin(SplitText)

const route = useRoute()
const router = useRouter()
const currentProject = ref<Project>()
const currentFocusedImage = ref<number>(-1)
const currentFocusedSliderImage = ref<number>(-1)

const projectImages = ref<string[]>([])
const imageRefs = shallowRef<HTMLElement[]>([])
const focusedContent = ref<HTMLElement>()
const focusedImage = ref<HTMLElement>()
const root = ref<HTMLElement>()

const splitedText = ref()
const prevNavigation = ref()
const nextNavigation = ref()

const projectTitle = ref()
const currentProjectIndex = computed(() => projectsData.findIndex((project) => project.slug === route.params.slug))
const isEven = currentProjectIndex.value % 2 === 0

const activeIndex = computed(() => {
  return document.querySelector('.index-container .index')
})

const { enterAnim, nextImage, prevImage, changeActiveImage } = useProjectPageAnimation({
  splitedText,
  imageRefs,
  focusedImage,
  focusedContent,
  currentFocusedSliderImage,
  activeIndex,
  prevNavigation,
  nextNavigation,
  projectTitle,
  currentFocusedImage,
  projectImages,
})
onMounted(async () => {
  currentProject.value = projectsData[currentProjectIndex.value]

  // invert first two pictures
  projectImages.value = [...currentProject.value!.images]
  if (projectImages.value.length > 1 && !isEven) {
    ;[projectImages.value[0], projectImages.value[1]] = [projectImages.value[1], projectImages.value[0]]
  }

  await nextTick()
  splitedText.value = new SplitText('.project-name', { type: 'words', autoSplit: true, wordsClass: 'word++' })

  currentFocusedImage.value = 0

  enterAnim()
})

function leavePage() {
  gsap.to('.main .transition-layer', {
    opacity: 1,
    onComplete() {
      router.back()
    },
  })
}
</script>

<template>
  <main class="main" ref="root">
    <div class="transition-layer"></div>
    <NuxtLink @click="leavePage" class="close-cta" ref="closeCta">
      <img src="/icons/bracket.svg" alt="" />
      <p class="menu-item">Close</p>
      <img src="/icons/bracket.svg" alt="" />
    </NuxtLink>
    <div ref="focusedContent" class="focused-content">
      <div ref="focusedImage" class="focused-image">
        <img :src="projectImages[currentFocusedImage]" alt="" />
      </div>
      <div class="utils-project-informations">
        <p class="location">{{ currentProject?.location }}</p>
        <img src="/icons/square.svg" alt="" />
        <a :href="currentProject?.author.link" class="author">{{ currentProject?.author.name }}</a>
      </div>
    </div>
    <div class="project-informations">
      <h1 class="project-name title" ref="projectTitle">
        {{ currentProject?.name }}
      </h1>
      <div class="counter title">
        <div class="index-container">
          <div class="index-wrapper">
            <span ref="activeIndex" class="index" v-for="i in projectImages.length" :key="i" :class="{ active: i - 1 === currentFocusedImage }">
              {{ i }}
            </span>
          </div>
        </div>
        <span class="length">/ {{ projectImages.length }}</span>
      </div>
    </div>
    <div class="slider">
      <p @click="prevImage" class="slider-navigation prev"><UtilsTextShuffle from="prev" to="prev" :duration="0.5" :step="5" ref="prevNavigation" /></p>
      <div class="slider-images">
        <div
          v-for="(image, index) in projectImages"
          :ref="(el) => (imageRefs[index] = el as HTMLElement)"
          :class="['image-slider', { active: index === currentFocusedSliderImage }]"
          @click="changeActiveImage(index)"
        >
          <img :src="image" alt="" />
        </div>
      </div>
      <p @click="nextImage" class="slider-navigation next"><UtilsTextShuffle from="next" to="next" :duration="0.5" :step="5" ref="nextNavigation" /></p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
  background-color: white;
  > .close-cta {
    display: flex;
    position: absolute;
    right: 30px;
    top: 90px;
    align-items: center;
    gap: 2px;
    opacity: 0;
    img:nth-of-type(2) {
      transform: rotate(180deg);
    }
  }
  > .focused-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    > .focused-image {
      height: 60vh;
      aspect-ratio: 254/317;
      transform: scale(1.3);

      > img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
    > .utils-project-informations {
      display: none;
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
    > .project-name {
      flex-direction: column;
    }
    > .project-name,
    .counter {
      max-width: 20%;
      display: flex;
      opacity: 0;
      > .index-container {
        width: 40px;
        overflow: hidden;
        position: relative;
        margin-right: 6px;
        > .index-wrapper {
          position: relative;
          display: flex;
          > .index {
            width: 40px;

            text-align: center;
            position: absolute;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            &.active {
              opacity: 1;
            }
          }
        }
      }
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
      width: 48px;
      position: relative;
      opacity: 0;

      > span {
        position: absolute;
        bottom: 0;
      }
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
        overflow: hidden;
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
