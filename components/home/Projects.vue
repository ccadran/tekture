<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    name: 'BNIM',
    description: 'Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/1.png', '/images/2.png'],
  },
  {
    name: 'CENTRE POMPIDOU',
    description: '2Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/3.png', '/images/4.png'],
  },
  {
    name: '23 DESIGN',
    description: '3Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/2.png', '/images/3.png'],
  },
  {
    name: 'ELARCH',
    description: '4Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/3.png', '/images/1.png'],
  },
  {
    name: 'STUSSY STORE',
    description: '5Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.',
    images: ['/images/4.png', '/images/2.png'],
  },
]

const activeProjectIndex = ref<number>(0)
const navItemsRefs = ref<any[]>([])

/**
 * ANIMATE ELEMENT
 */
const titleChars = ref<NodeListOf<Element> | null>(null)
const descriptionLines = ref<NodeListOf<Element> | null>(null)
const leftImage = ref<HTMLElement | null>(null)
const rightImage = ref<HTMLElement | null>(null)
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

const changeProjectOnScroll = () => {
  const projectsSection = document.querySelector('.projects')
  let lastStep = -1
  let step = 1 / projects.length

  ScrollTrigger.create({
    trigger: projectsSection,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const currentStep = Math.floor(self.progress / step)
      if (currentStep !== lastStep && currentStep < projects.length) {
        lastStep = currentStep

        changeProject(lastStep)
      }
    },
  })
}

const projectsEnter = (index: number) => {
  const projectsSection = document.querySelector('.projects')
  gsap
    .timeline({
      scrollTrigger: {
        trigger: projectsSection,
        start: 'top center-=20%',
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

const projectOut = (index: number) => {
  const targetProject = document.querySelector(`.project--${index} `)
  gsap
    .timeline()
    .to(targetProject, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    .set(targetProject, { zIndex: projects.length - 1 })
}
const projectIn = (index: number, isProjectsEnter?: boolean) => {
  const targetProject = document.querySelector(`.project--${index} `) as HTMLElement
  titleChars.value = targetProject?.querySelectorAll('.title .char')
  descriptionLines.value = targetProject?.querySelectorAll('.description .line .inner')
  leftImage.value = targetProject?.querySelector('.left-images .project-image')
  rightImage.value = targetProject?.querySelector('.right-images .project-image')
  console.log(leftImage.value)

  const tl = gsap
    .timeline()
    .set(targetProject, { zIndex: projects.length, opacity: 1 })
    .fromTo(
      descriptionLines.value,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.75, ease: 'power1.inOut' }
    )
    .fromTo(titleChars.value, { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.75, ease: 'power1.inOut' }, 0.2)
    .fromTo(leftImage.value, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power1.inOut' }, 0.6)
    .fromTo(rightImage.value, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power1.inOut' }, 0.65)

  if (!isProjectsEnter) {
    tl.add(navItemsRefs.value[index].animate(), 0)
  }

  return tl
}

const wrapLinesWithInner = () => {
  const lineElements = document.querySelectorAll('.line')

  lineElements.forEach((line) => {
    const content = line.innerHTML

    line.innerHTML = `<div class="inner">${content}</div>`
  })
}

const moveMarkers = (index: number) => {
  const currentNavItemRect = document.querySelector(`.nav-project--${index}`)?.getBoundingClientRect()
  const projectsNavRect = projectsNav.value?.getBoundingClientRect()
  const relativeTop = currentNavItemRect!.top - projectsNavRect!.top
  const currentNavItemWidth = currentNavItemRect!.width

  gsap.to(navMarkers.value, { top: relativeTop, width: currentNavItemWidth + 40 })
}
const changeProject = (index: number) => {
  if (index === activeProjectIndex.value) return
  projectOut(activeProjectIndex.value)
  projectIn(index)
  activeProjectIndex.value = index
  moveMarkers(index)
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
          <li :class="'nav-item nav-project--' + index" v-for="(project, index) in projects" @click="changeProject(index)">
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
      <div :class="'project-content project--' + index" v-for="(project, index) in projects">
        <div class="project-text">
          <h2 class="title">{{ project.name }}</h2>

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
  > .project-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
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
        > .char {
        }
      }
      > .description {
        > .line {
          height: fit-content;
          width: fit-content;
          overflow: hidden;
          > .inner {
          }
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
}
</style>
