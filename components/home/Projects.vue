<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'

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
})

const projectOut = (index: number) => {
  const targetProject = document.querySelector(`.project--${index} `)
  gsap
    .timeline()
    .to(targetProject, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    .set(targetProject, { zIndex: projects.length - 1 })
}
const projectIn = (index: number) => {
  const targetProject = document.querySelector(`.project--${index} `) as HTMLElement
  titleChars.value = targetProject?.querySelectorAll('.title .char')
  descriptionLines.value = targetProject?.querySelectorAll('.description .line .inner')
  leftImage.value = targetProject?.querySelector('.left-images .project-image')
  rightImage.value = targetProject?.querySelector('.right-images .project-image')
  console.log(leftImage.value)

  gsap
    .timeline()
    .set(targetProject, { zIndex: projects.length, opacity: 1 })
    .fromTo(titleChars.value, { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.5, ease: 'power1.inOut' })
    .fromTo(
      descriptionLines.value,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.5, ease: 'power1.inOut' },
      0.2
    )
    .fromTo(leftImage.value, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, 0.3)
    .fromTo(rightImage.value, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.inOut' }, 0.35)
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
          <li :class="'nav-project--' + index" v-for="(project, index) in projects" @click="changeProject(index)">
            <h4>{{ project.name }}</h4>
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
.project-layout {
  height: 100vh;
  position: relative;

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
      > li {
        width: fit-content;
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
    // visibility: hidden;
    opacity: 0;
    &.project--0 {
      opacity: 1;
      z-index: 5;
      // visibility: visible;
    }
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
