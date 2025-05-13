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
    <div class="project-page">
      <div>
        <img :src="currentProject!.images[0]" alt="" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.project-page {
  height: 100vh;
}
img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  object-fit: cover;
}
</style>
