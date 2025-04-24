<script lang="ts" setup>
import gsap from 'gsap'

const projects = [
  {
    name: 'BNIM',
    description: 'Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/1.png', '/images/2.png'],
  },
  {
    name: 'CENTRE POMPIDOU',
    description: 'Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/3.png', '/images/4.png'],
  },
  {
    name: '23 DESIGN',
    description: 'Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/2.png', '/images/3.png'],
  },
  {
    name: 'ELARCH',
    description: 'Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/3.png', '/images/1.png'],
  },
  {
    name: 'STUSSY STORE',
    description: 'Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/4.png', '/images/2.png'],
  },
]

const activeProjectIndex = ref<number>(0)

const projectText = ref<HTMLElement | null>(null)
const leftImage = ref<HTMLElement | null>(null)
const rightImage = ref<HTMLElement | null>(null)

const projectOutTl = ref<gsap.core.Timeline>()
const projectInTl = ref<gsap.core.Timeline>()

onMounted(() => {
  projectOutTl.value = gsap
    .timeline({ paused: true, onComplete: () => {} })
    .to(projectText.value, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    .to(leftImage.value, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0)
    .to(rightImage.value, { opacity: 0, duration: 0.5, ease: 'power1.out' }, 0)

  projectInTl.value = gsap
    .timeline({ paused: true })
    .to(projectText.value, { opacity: 1, duration: 0.5, ease: 'power1.out' })
    .to(leftImage.value, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0)
    .to(rightImage.value, { opacity: 1, duration: 0.5, ease: 'power1.out' }, 0)
})

const changeProject = (index: number) => {
  if (index === activeProjectIndex.value) return

  resetTimelines()
  setTimeout(() => {
    activeProjectIndex.value = index
    projectInTl.value!.play()
  }, 500)
}

const resetTimelines = () => {
  projectOutTl.value!.progress(0)
  projectInTl.value!.progress(0)

  projectOutTl.value!.pause()
  projectInTl.value!.pause()
  projectOutTl.value!.play()
}
</script>

<template>
  <section class="projects">
    <div class="project-layout">
      <div class="project-text" ref="projectText">
        <h2>{{ projects[activeProjectIndex].name }}</h2>
        <p>{{ projects[activeProjectIndex].description }}</p>
      </div>
      <nav class="projects-navigation">
        <div class="markers"></div>
        <ul>
          <li v-for="(project, index) in projects" @click="changeProject(index)">
            <h4>{{ project.name }}</h4>
          </li>
        </ul>
      </nav>

      <div class="left-images" ref="leftImage">
        <div class="project-image" :class="activeProjectIndex % 2 === 0 ? 'top' : 'bottom'">
          <img :src="projects[activeProjectIndex].images[0]" alt="" />
        </div>
      </div>
      <div class="right-images" ref="rightImage">
        <div class="project-image" :class="activeProjectIndex % 2 === 0 ? 'bottom' : 'top'">
          <img :src="projects[activeProjectIndex].images[1]" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.project-layout {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  > .project-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
    max-width: 600px;
    margin-top: 14vh;
  }
  > .projects-navigation {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    > ul {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
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
      width: 254px;
      aspect-ratio: 254/317;
    }
    .bottom {
      left: 72px;
      bottom: 10vh;
      width: 394px;
      aspect-ratio: 394/277;
    }
  }
  > .right-images {
    .top {
      position: absolute;
      right: 72px;
      top: 10vh;
      width: 254px;
      aspect-ratio: 254/317;
    }
    .bottom {
      position: absolute;
      right: 72px;
      bottom: 10vh;
      width: 394px;
      aspect-ratio: 394/277;
    }
  }
}
</style>
