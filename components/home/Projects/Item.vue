<script lang="ts" setup>
import gsap from 'gsap'
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  activeProject: {
    type: Number,
    required: true,
    default: 0,
  },
})

const leftImage = ref<HTMLElement>()
const rightImage = ref<HTMLElement>()
onMounted(() => {
  leftImage.value = document.querySelector(`.project-content.project--${props.activeProject} .left-images .project-image`) as HTMLElement
  rightImage.value = document.querySelector(`.project-content.project--${props.activeProject} .right-images .project-image`) as HTMLElement
})

watch(
  () => props.activeProject,
  () => {
    leftImage.value = document.querySelector(`.project-content.project--${props.activeProject} .left-images .project-image`) as HTMLElement
    rightImage.value = document.querySelector(`.project-content.project--${props.activeProject} .right-images .project-image`) as HTMLElement
    console.log(leftImage.value.querySelector('img'))
  }
)
function exitTransition(destination: string) {
  const extiTl = gsap.timeline({
    onComplete() {
      console.log('yoo')

      navigateTo(`/projects/${destination}`)
    },
  })
  const focusedImage = leftImage.value!.querySelector('img')

  extiTl
    .to(leftImage.value!, { height: '60vh', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', scale: 1.3, ease: 'power1.inOut' })
    .to(rightImage.value!, { top: '50%', left: '50%', transform: 'translate(-50%,-50%)', ease: 'power1.inOut' }, 0)
  // .to(focusedImage, { scale: 1.3 }, 0)
}

// setTimeout(() => {
//   exitTransition()
// }, 2000)
</script>

<template>
  <div :class="'project-content project--' + index">
    <div class="project-text">
      <h2 class="title">{{ project.name }}</h2>
      <!-- <NuxtLink :to="'/projects/' + project.slug">Test</NuxtLink> -->
      <h4 @click="exitTransition(project.slug)">NAVIGUE</h4>

      <p class="description">{{ project.description }}</p>
    </div>

    <div class="left-images">
      <div class="project-image" :class="index % 2 === 0 ? 'top' : 'bottom'">
        <img :src="project.images[0]" alt="" />
      </div>
    </div>
    <div class="right-images">
      <div class="project-image" :class="index % 2 === 0 ? 'bottom' : 'top'">
        <img :src="project.images[1]" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.project-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 0;
  display: none;
  > .project-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
    align-items: center;
    max-width: 600px;
    margin-top: 14vh;
    > .title {
      width: fit-content;
      height: fit-content;
      overflow: hidden;
    }
    > .description {
      > .line {
        height: fit-content;
        width: fit-content;
        overflow: hidden;
      }
    }
  }

  .project-image {
    position: absolute;
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  > .left-images {
    .top {
      left: 72px;
      top: 10vh;
      height: 317px;
      aspect-ratio: 254/317;
    }
    .bottom {
      left: 72px;
      bottom: 10vh;

      height: 277px;
      aspect-ratio: 394/277;
    }
  }
  > .right-images {
    z-index: -1;
    .top {
      position: absolute;
      right: 72px;
      top: 10vh;
      aspect-ratio: 254/317;
      height: 317px;
    }
    .bottom {
      position: absolute;
      right: 72px;
      bottom: 10vh;
      height: 277px;
      aspect-ratio: 394/277;
    }
  }
}
</style>
