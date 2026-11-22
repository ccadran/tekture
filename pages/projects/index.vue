<script lang="ts" setup>
import projectsDataJson from '~/assets/data/projects.json'

import gsap from 'gsap'

const projectsData = ref(projectsDataJson)
const stickyContainer = ref<HTMLElement | null>(null)
const projectsContainer = ref<HTMLElement | null>(null)
const projectDataRefs = ref<HTMLElement[]>([])
const projectAssetsRefs = ref<HTMLElement[]>([])
const mainAssetRefs = ref<HTMLElement[]>([])
const projectNumber = ref<number>(0)
const projectDataHeight = ref<number>(0)
const activeProjectIndex = ref<number>(0)

// Espace entre le bas de la navbar et la première ligne de projet empilée
const NAV_GAP = 12

let ctx: gsap.Context | null = null

onMounted(() => {
  projectNumber.value = projectsData.value.length
  stickyContainer.value!.style.height = window.innerHeight * 1.5 * (projectNumber.value + 1) + 'px'

  ctx = gsap.context(() => {
    setProjectsDataAbsolute()
    initMainAssets()
    animateProjectsOnScroll()
  }, stickyContainer.value!)
  //After entry anim
})

onBeforeUnmount(() => {
  // Tue les ScrollTriggers/tweens de la page (sinon ils restent actifs sur les autres pages)
  ctx?.revert()
})

// Bas de la navbar (fixe) : les lignes de projets s'empilent en dessous au lieu de passer derrière
function getNavOffset() {
  const navbar = document.querySelector('.navbar')
  return navbar ? navbar.getBoundingClientRect().bottom + NAV_GAP : 0
}

function animateProjectsOnScroll() {
  const scrollTriggerStops = []
  const sectionHeight = window.innerHeight * 1.5

  for (let i = 0; i < projectNumber.value; i++) {
    const start = 0 + sectionHeight * i
    const end = 0 + sectionHeight * (i + 1)
    const object = {
      start,
      end,
    }
    scrollTriggerStops.push(object)
  }

  scrollTriggerStops.forEach((step, index) => {
    const lImage = projectAssetsRefs.value[index].querySelector('.l-image')
    const rImage = projectAssetsRefs.value[index].querySelector('.r-image')

    gsap.to(projectDataRefs.value[index], {
      top: () => getNavOffset() + projectDataHeight.value * index,
      scrollTrigger: {
        trigger: stickyContainer.value,
        start: step.start,
        end: step.end,
        scrub: true,
        invalidateOnRefresh: true,
        // Dès que le projet commence à être attaché au scroll => son image passe au centre
        onEnter: () => setActiveProject(index),
        onLeaveBack: () => setActiveProject(Math.max(index - 1, 0)),
      },
    })
    gsap.fromTo(
      lImage,
      { transform: 'translateY(100vh)' },
      {
        transform: 'translateY(-100vh)',
        scrollTrigger: {
          trigger: stickyContainer.value,
          start: step.start,
          end: step.end,
          scrub: true,
        },
      }
    )
    gsap.fromTo(
      rImage,
      { transform: 'translateY(140vh)' },
      {
        transform: 'translateY(-100vh)',
        scrollTrigger: {
          trigger: stickyContainer.value,
          start: step.start,
          end: step.end,
          scrub: true,
        },
      }
    )
  })
}

// Image du milieu : une seule visible à la fois (celle du projet actif), changement en fondu
function initMainAssets() {
  mainAssetRefs.value.forEach((asset, index) => {
    gsap.set(asset, { opacity: index === activeProjectIndex.value ? 1 : 0 })
  })
}

function setActiveProject(index: number) {
  if (index === activeProjectIndex.value) return
  const previous = mainAssetRefs.value[activeProjectIndex.value]
  const next = mainAssetRefs.value[index]
  activeProjectIndex.value = index

  gsap.to(previous, { opacity: 0, duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' })
  gsap.to(next, { opacity: 1, duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' })
}

function setProjectsDataAbsolute() {
  projectDataRefs.value.forEach((projectData) => {
    const rect = projectData.getBoundingClientRect()
    projectDataHeight.value = rect.height + 4

    projectData.style.top = rect.top + 'px'
    projectData.style.position = 'absolute'
    projectData.style.width = 'calc(100% - 60px)'
    projectData.style.left = '50%'
    projectData.style.transform = 'translateX(-50%)'
  })
}
</script>

<template>
  <div class="all-projects" ref="stickyContainer">
    <div class="projects-container" ref="projectsContainer">
      <div class="projects-list">
        <div
          class="project-data"
          v-for="(project, index) in projectsData"
          :ref="
            (el) => {
              if (el) projectDataRefs[index] = el as HTMLElement
            }
          "
        >
          <div class="location">
            <p>{{ project.location }}</p>
          </div>
          <div class="name">
            {{ project.name }}
          </div>
          <div class="author-date">
            <p>
              <a class="author" :href="project.author.link">{{ project.author.name }}</a
              >, {{ project.date }}
            </p>
          </div>
        </div>
      </div>
      <div class="projects-main-assets">
        <div
          class="main-asset"
          v-for="(project, index) in projectsData"
          :ref="
            (el) => {
              if (el) mainAssetRefs[index] = el as HTMLElement
            }
          "
        >
          <img :src="project.images[0]" alt="" />
        </div>
      </div>
      <div class="projects-assets">
        <div
          class="project-asset"
          v-for="(project, index) in projectsData"
          :ref="
            (el) => {
              if (el) projectAssetsRefs[index] = el as HTMLElement
            }
          "
        >
          <div class="l-image"><img :src="project.images[1]" alt="" /></div>
          <div class="r-image"><img :src="project.images[2]" alt="" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all-projects {
  height: 600vh;
  .projects-container {
    background-color: white;
    height: 100svh;
    width: 100vw;
    position: fixed;
    top: 0;

    .projects-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      gap: 4px;
      z-index: 100;

      position: fixed;
      mix-blend-mode: difference;

      .project-data {
        display: flex;
        justify-content: space-between;
        color: white;
        width: calc(100% - 60px);
        .location {
          > p {
            font-weight: 300;
            font-size: 12px;
            font-style: italic;
          }
        }
        .name {
          font-size: 14px;
          font-weight: 800;

          // opacity: 60%;
        }
        .author-date {
          font-size: 12px;
          display: flex;
          .author {
            color: white;
            text-decoration: underline;
            font-weight: 400;
          }
        }
      }
    }
    .projects-main-assets {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;

      .main-asset {
        width: 50%;
        height: 60%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;

        > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
    .projects-assets {
      height: 100vh;
      width: 100%;
      position: fixed;
      top: 0;
      > .project-asset {
        position: absolute;
        height: 100%;
        width: 100%;
        padding: 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > .l-image {
          width: 15%;
          img {
            object-fit: cover;
          }
        }
        > .r-image {
          width: 15%;
          img {
            object-fit: cover;
          }
        }
      }
    }
  }
}
</style>
