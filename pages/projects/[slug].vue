<script lang="ts" setup>
import gsap from 'gsap'
import projectsData from '~/assets/data/projects.json'
import type { Project } from '~/types'

const route = useRoute()
const currentProject = ref<Project>()
const currentFocusedImage = ref<number>(-1)

const projectImages = ref<string[]>([])
const imageRefs = shallowRef<HTMLElement[]>([])

onMounted(async () => {
  currentProject.value = projectsData.find((project) => project.slug == route.params.slug)
  projectImages.value = currentProject.value!.images

  await nextTick()
  enterAnim()
  setTimeout(() => {
    // animateIndexChange()
  }, 200)
})

function enterAnim() {
  const enterTl = gsap.timeline({
    onComplete() {
      currentFocusedImage.value = 0
    },
  })
  const images = imageRefs.value.map((el) => el.querySelector('img'))
  enterTl.fromTo(
    images,
    { transform: 'translateX(-100%)', opacity: 0 },
    {
      transform: 'translateX(0%)',
      opacity: 1,
      stagger: {
        each: 0.085,
        ease: 'power1.in',
      },
    }
  )
}

function nextImage() {
  const newImage = (currentFocusedImage.value + 1) % projectImages!.value.length
  changeActiveImage(newImage)
}
function prevImage() {
  const newImage = (currentFocusedImage.value - 1 + projectImages!.value.length) % projectImages!.value.length
  changeActiveImage(newImage)
}

function changeActiveImage(targetImageIndex: number) {
  animateIndexChange(currentFocusedImage.value, targetImageIndex)
  currentFocusedImage.value = targetImageIndex
}

function animateIndexChange(previousIndex: number, targetIndex: number) {
  const indexWrapper = document.querySelector('.index-wrapper')
  const allIndexes = indexWrapper?.querySelectorAll('.index')

  if (!allIndexes || allIndexes.length === 0) return

  let isProgressing = targetIndex > previousIndex
  if (Math.abs(targetIndex - previousIndex) > 1) {
    if (targetIndex - previousIndex > 1) {
      isProgressing = true
    } else {
      isProgressing = false
    }
  }
  console.log(targetIndex - previousIndex)

  const indexTl = gsap.timeline({ defaults: { duration: 0.3, ease: 'power1.inOut' } })

  indexTl
    .to(allIndexes[previousIndex], { x: isProgressing ? '100%' : '-100%' })
    .fromTo(allIndexes[targetIndex], { x: isProgressing ? '-100%' : '100%' }, { x: '0%' }, 0.1)
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
      <div class="counter title">
        <div class="index-container">
          <div class="index-wrapper">
            <span class="index" v-for="i in projectImages.length" :key="i" :class="{ active: i - 1 === currentFocusedImage }">
              {{ i }}
            </span>
          </div>
        </div>
        <span class="length">/ {{ projectImages.length }}</span>
      </div>
    </div>
    <div class="slider">
      <p @click="prevImage" class="slider-navigation prev">prev</p>
      <div class="slider-images">
        <div
          v-for="(image, index) in currentProject?.images"
          :ref="(el) => (imageRefs[index] = el as HTMLElement)"
          :class="['image-slider', { active: index === currentFocusedImage }]"
          @click="changeActiveImage(index)"
        >
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
      display: flex;
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
