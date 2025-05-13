<script lang="ts" setup>
import projectsData from '~/assets/data/projects.json'
import type { Project } from '~/types'

const route = useRoute()
const currentProject = ref<Project>()
onBeforeMount(() => {
  currentProject.value = projectsData.find((project) => project.slug == route.params.slug)
  console.log(currentProject.value)
})
</script>

<template>
  <main class="main">
    <div class="focused-content">
      <div class="focused-image">
        <img :src="currentProject?.images[0]" alt="" />
      </div>
      <div class="project-informations">
        <p class="location">{{ currentProject?.location }}</p>
        <img src="/icons/square.svg" alt="" />
        <a :href="currentProject?.author.link" class="author">{{ currentProject?.author.name }}</a>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
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
      aspect-ratio: 362/484;
      max-height: 60vh;

      > img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
    > .project-informations {
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
}
</style>
