<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import projectsData from '~/assets/data/projects.json'

const activeProjectIndex = ref<number>(0)

const projectsSection = ref<HTMLElement | null>(null)

const navigationRef = ref()
const scrollTriggerInstance = ref<ScrollTrigger | null>(null)
const isMounted = ref(false)

const { projectsEnter, projectIn, projectOut, moveMarkers, scrollToProject, wrapLinesWithInner, cleanup } = useProjectAnimation()
onMounted(async () => {
  isMounted.value = true
  new SplitType('.description ', { types: 'lines' })
  new SplitType('.project-text .title ', { types: 'chars' })

  wrapLinesWithInner()

  projectsSection.value = document.querySelector('.projects')

  projectsEnter(activeProjectIndex.value)
  moveMarkers(activeProjectIndex.value)
  changeProjectOnScroll()
})

onBeforeUnmount(() => {
  cleanup()
})

function changeProjectOnScroll() {
  let lastStep = -1
  let step = 1 / projectsData.length

  scrollTriggerInstance.value = ScrollTrigger.create({
    trigger: projectsSection.value,
    start: 'top top',
    end: 'bottom bottom',
    onStart() {
      console.log('start')
    },
    onUpdate: (self) => {
      const currentStep = Math.floor(self.progress / step)
      if (currentStep !== lastStep && currentStep < projectsData.length) {
        lastStep = currentStep
        changeProject(lastStep)
      }
    },
  })
}

function changeProject(index: number) {
  if (!isMounted.value) return

  if (index === activeProjectIndex.value) return
  projectOut(activeProjectIndex.value)
  projectIn(index, false, navigationRef)
  activeProjectIndex.value = index
  moveMarkers(index)
}

function handleScrollToProject(index: number) {
  scrollToProject(index)
}

onBeforeUnmount(() => {
  isMounted.value = false
})
</script>

<template>
  <section class="projects">
    <div class="project-layout">
      <nav class="projects-navigation">
        <div class="markers">
          <img class="left" src="/icons/marker.svg" alt="" />
          <img class="right" src="/icons/marker.svg" alt="" />
        </div>
        <HomeProjectsNavigation :projectsData="projectsData" @clicked="handleScrollToProject($event)" ref="navigationRef" />
      </nav>
      <HomeProjectsItem v-for="(project, index) in projectsData" :project="project" :index="index" :activeProject="activeProjectIndex" />
    </div>
  </section>
</template>

<style lang="scss">
.projects {
  height: 600vh;
  background-color: white;
}
.project-layout {
  height: 100vh;
  position: sticky;
  top: 0;

  > .projects-navigation {
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    > .markers {
      position: absolute;
      display: flex;
      justify-content: space-between;
      left: 50%;
      transform: translateX(-50%);
      > .right {
        transform: rotate(180deg);
      }
    }
    > ul {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
      align-items: center;
      > .nav-item {
        width: fit-content;
        overflow: hidden;
        opacity: 0.5;
        transition: opacity 0.2s ease-in-out;
        &.active {
          opacity: 1;
        }
      }
    }
  }
}
</style>
