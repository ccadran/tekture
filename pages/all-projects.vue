<script lang="ts" setup>
import projectsData from '~/assets/data/projects.json'
</script>

<template>
  <div class="main">
    <div class="projects-list">
      <div class="project-data" v-for="project in projectsData">
        <div class="location">
          <p>{{ project.location }}</p>
        </div>
        <div class="name">
          {{ project.name }}
        </div>
        <div class="author-date">
          <a class="author" :href="project.author.link"
            ><p>{{ project.author.name }}</p></a
          >
          <p class="date">{{ project.date }}</p>
        </div>
      </div>
    </div>
    <div class="projects-assets">
      <div class="project-asset" v-for="project in projectsData">
        <div class="l-image"><img :src="project.images[1]" alt="" /></div>
        <div class="main-image"><img :src="project.images[0]" alt="" /></div>
        <div class="r-image"><img :src="project.images[2]" alt="" /></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.main {
  height: 100svh;
  .projects-list {
    position: absolute;
    bottom: 0;
    width: 100%;
    .project-data {
      display: flex;
      justify-content: space-between;
      .location {
        > p {
        }
      }
      .name {
      }
      .author-date {
        .author {
        }
        .date {
        }
      }
    }
  }

  .projects-assets {
    display: none;
  }
}
</style>
