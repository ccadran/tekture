<script lang="ts" setup>
import projectsDataJson from '~/assets/data/projects.json'

import gsap from 'gsap'

const projectsData = ref(projectsDataJson)
const stickyContainer = ref<HTMLElement | null>(null)
const projectsContainer = ref<HTMLElement | null>(null)
const projectDataRefs = ref<HTMLElement[]>([])
const projectAssetsRefs = ref<HTMLElement[]>([])
const projectNumber = ref<number>(0)
const projectDataHeight = ref<number>(0)

console.log(projectsData)

onMounted(() => {
  projectNumber.value = projectsData.value.length
  stickyContainer.value!.style.height = window.innerHeight * (projectNumber.value + 1) + 'px'
  setProjectsDataAbsolute()
  animateProjectsOnScroll()
  //After entry anim
})

function animateProjectsOnScroll() {
  const scrollTriggerStops = []
  const sectionHeight = window.innerHeight

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
    gsap.to(projectDataRefs.value[index], {
      top: projectDataHeight.value * index,
      scrollTrigger: {
        trigger: stickyContainer.value,
        start: step.start,
        end: step.end,
        scrub: true,
      },
    })
  })
}

function setProjectsDataAbsolute() {
  projectDataRefs.value.forEach((projectData) => {
    const rect = projectData.getBoundingClientRect()
    projectDataHeight.value = rect.height + 4

    projectData.style.top = rect.top + 'px'
    projectData.style.position = 'absolute'
    projectData.style.width = '100%'
  })
}
</script>

<template>
  <div class="main" ref="stickyContainer">
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
          <div class="main-image"><img :src="project.images[0]" alt="" /></div>
          <div class="r-image"><img :src="project.images[2]" alt="" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.main {
  height: 600vh;
  .projects-container {
    background-color: white;
    position: sticky;
    height: 100svh;
    .projects-list {
      background-color: white;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      gap: 4px;

      .project-data {
        display: flex;
        justify-content: space-between;
        mix-blend-mode: difference;
        color: white;
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
          opacity: 60%;
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

    .projects-assets {
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      // display: none;
      > .project-asset {
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > .l-image {
          width: 15%;
          img {
            object-fit: cover;
          }
        }
        > .main-image {
          width: 50%;
          height: 60%;

          > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
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
