<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'
import projectsData from '~/assets/data/projects.json'

const activeProjectIndex = ref<number>(0)

const projectsSection = ref<HTMLElement | null>(null)

const navigationRef = ref()
const ctaEnter = ref<HTMLElement | null>(null)
const scrollTriggerInstance = ref<ScrollTrigger | null>(null)
const isMounted = ref(false)
const isProjectsVisible = ref<boolean>(false)
const currentMouse = { x: '0', y: '0' }

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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isProjectsVisible.value = entry.isIntersecting
        if (!ctaEnter.value) return
        if (isProjectsVisible.value) {
          showCtaEnter()
        } else {
          hideCtaEnter()
        }
      })
    },
    { threshold: 0.1 }
  )
  observer.observe(projectsSection.value!)

  window.addEventListener('mousemove', (e) => {
    currentMouse.x = `${e.clientX}px`
    currentMouse.y = `${e.clientY}px`
    if (!isProjectsVisible.value) return
    gsap.to(ctaEnter.value, { left: e.clientX, top: e.clientY, ease: 'power1.out', duration: 0.35 })
  })
})

function showCtaEnter() {
  ctaEnter.value!.style.display = 'block'
  ctaEnter.value!.style.left = currentMouse.x
  ctaEnter.value!.style.top = currentMouse.y
  gsap.to(ctaEnter.value, { opacity: 1, duration: 0.75 })
}
function hideCtaEnter() {
  gsap.to(ctaEnter.value, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      ctaEnter.value!.style.display = 'none'
    },
  })
}

function changeProjectOnScroll() {
  let lastStep = -1
  let step = 1 / projectsData.length

  scrollTriggerInstance.value = ScrollTrigger.create({
    trigger: projectsSection.value,
    start: 'top top',
    end: 'bottom bottom',

    onEnter() {
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
  cleanup()
})
</script>

<template>
  <section class="projects">
    <div ref="ctaEnter" class="cta-enter">
      <p>ENTER</p>
    </div>
    <div class="project-layout">
      <nav class="projects-navigation" @mouseenter="hideCtaEnter" @mouseleave="showCtaEnter">
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
  .cta-enter {
    opacity: 0;
    position: fixed;
    z-index: 999;
    transform: translate(-50%, -80%);
    padding: 10px;
    pointer-events: none;
    mix-blend-mode: difference;
    > p {
      color: white;
    }
  }
}
.project-layout {
  height: 100vh;
  position: sticky;
  top: 0;
  cursor: pointer;

  > .projects-navigation {
    position: absolute;
    z-index: 6;
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
  }
}
</style>
