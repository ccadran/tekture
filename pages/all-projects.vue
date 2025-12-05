<script lang="ts" setup>
import projectsData from '~/assets/data/projects.json'
</script>

<template>
  <div class="main">
    <div class="project-container">
      <div class="projects-list">
        <div class="project-data" v-for="project in projectsData">
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
        <div class="project-asset" v-for="project in projectsData">
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
  .project-container {
    background-color: white;
    position: sticky;
    height: 100svh;
    .projects-list {
      position: fixed;
      bottom: 0;
      width: 100%;

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
      > .project-asset {
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        > .l-image {
          width: 15%;
          img {
            object-fit: cover;
          }
        }
        > .main-image {
          width: 50%;

          max-height: 60%;

          > img {
            width: 100%;
            height: 100%;
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
