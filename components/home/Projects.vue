<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import projectsData from '~/assets/data/projects.json'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const activeProjectIndex = ref<number>(0)
const navItemsRefs = ref<any[]>([])

/**
 * ANIMATE ELEMENT
 */
const projectsNav = ref<HTMLElement | null>(null)
const navMarkers = ref<HTMLElement | null>(null)

onMounted(() => {
  new SplitType('.description ', { types: 'lines' })
  new SplitType('.title ', { types: 'chars' })
  wrapLinesWithInner()
  projectsNav.value = document.querySelector('.projects-navigation')
  navMarkers.value = document.querySelector('.markers')
  projectsEnter(activeProjectIndex.value)
  moveMarkers(activeProjectIndex.value)
  changeProjectOnScroll()
})

const projectsEnter = (index: number) => {
  const projectsSection = document.querySelector('.projects')
  const projectsContent = document.querySelector('.project-layout') as HTMLElement

  if (!projectsSection || !projectsContent) return

  //snap section
  ScrollTrigger.create({
    trigger: projectsSection,
    start: 'top bottom-=10%',
    onEnter: () => {
      window.lenis?.scrollTo(projectsContent, {
        offset: 0,
        duration: 1.2,
        lock: true,
      })
    },
  })

  gsap
    .timeline({
      scrollTrigger: {
        trigger: projectsContent,
        start: 'top center',
        once: true,
      },
    })
    .fromTo(
      '.nav-item h4',
      { y: '100%', opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: {
          from: 'end',
          each: 0.05,
          ease: 'power1',
        },
      }
    )
    .add(projectIn(index, true), 0.05)
    .fromTo(
      navMarkers.value,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.25,
        repeat: 2,
        yoyo: true,
        ease: 'power1.inOut',
      },
      '>-=0.5'
    )
}

const changeProjectOnScroll = () => {
  const projectsSection = document.querySelector('.projects')
  let lastStep = -1
  let step = 1 / projectsData.length

  ScrollTrigger.create({
    trigger: projectsSection,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const currentStep = Math.floor(self.progress / step)
      if (currentStep !== lastStep && currentStep < projectsData.length) {
        lastStep = currentStep
        changeProject(lastStep)
      }
    },
  })
}

const projectIn = (index: number, isProjectsEnter?: boolean) => {
  const { targetProject, titleChars, descriptionLines, leftImage, rightImage } = getProjectElements(index)

  const tl = gsap
    .timeline()
    .set(targetProject, { zIndex: projectsData.length, opacity: 1 })
    .fromTo(descriptionLines, { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.75, ease: 'power1.inOut' })
    .fromTo(titleChars, { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.75, ease: 'power1.inOut' }, 0.2)
    .fromTo(leftImage, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power1.inOut' }, 0.6)
    .fromTo(rightImage, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power1.inOut' }, 0.65)

  if (!isProjectsEnter) {
    tl.add(navItemsRefs.value[index].animate(), 0)
  }

  return tl
}

const projectOut = (index: number) => {
  const { targetProject } = getProjectElements(index)
  gsap
    .timeline()
    .to(targetProject, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    .set(targetProject, { zIndex: projectsData.length - 1 })
}

const moveMarkers = (index: number) => {
  const currentNavItemRect = document.querySelector(`.nav-project--${index}`)?.getBoundingClientRect()
  const projectsNavRect = projectsNav.value?.getBoundingClientRect()
  const relativeTop = currentNavItemRect!.top - projectsNavRect!.top
  const currentNavItemWidth = currentNavItemRect!.width

  gsap.to(navMarkers.value, { top: relativeTop, width: currentNavItemWidth + 40 })
}

const wrapLinesWithInner = () => {
  const lineElements = document.querySelectorAll('.line')

  lineElements.forEach((line) => {
    const content = line.innerHTML

    line.innerHTML = `<div class="inner">${content}</div>`
  })
}

const getProjectElements = (index: number) => {
  const targetProject = document.querySelector(`.project--${index}`) as HTMLElement
  return {
    targetProject,
    titleChars: targetProject?.querySelectorAll('.title .char'),
    descriptionLines: targetProject?.querySelectorAll('.description .line .inner'),
    leftImage: targetProject?.querySelector('.left-images .project-image'),
    rightImage: targetProject?.querySelector('.right-images .project-image'),
  }
}
const changeProject = (index: number) => {
  if (index === activeProjectIndex.value) return
  projectOut(activeProjectIndex.value)
  projectIn(index)
  activeProjectIndex.value = index
  moveMarkers(index)
}

const scrollToProject = (index: number) => {
  const projectsSection = document.querySelector('.projects') as HTMLElement

  const sectionStart = projectsSection!.offsetTop
  const totalScrollable = projectsSection!.scrollHeight - window.innerHeight
  const step = totalScrollable / (projectsData.length - 1)
  const targetScroll = sectionStart + step * index
  console.log(step)

  window.lenis!.scrollTo(targetScroll, {
    lock: true,
    immediate: true,
  })
}
</script>

<template>
  <section class="projects">
    <div class="project-layout">
      <nav class="projects-navigation">
        <div class="markers">
          <img class="left" src="/icons/marker.svg" alt="" />
          <img class="right" src="/icons/marker.svg" alt="" />
        </div>
        <ul>
          <li :class="'nav-item nav-project--' + index" v-for="(project, index) in projectsData" @click="scrollToProject(index)">
            <h4>
              <UtilsTextShuffle
                :from="project.name"
                :to="project.name"
                :duration="0.6"
                :steps="10"
                :ref="
                  (el) => {
                    if (el) navItemsRefs[index] = el
                  }
                "
              />
            </h4>
          </li>
        </ul>
      </nav>
      <HomeProjectsItem v-for="(project, index) in projectsData" :project="project" :index="index" />
    </div>
  </section>
</template>

<style lang="scss">
.projects {
  height: 600vh;
}
.project-layout {
  height: 100vh;
  position: sticky;
  top: 0;

  > .projects-navigation {
    position: absolute;
    z-index: 10;
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
      }
    }
  }
}
</style>
