<script lang="ts" setup>
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div :class="'project-content project--' + index">
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
</template>

<style lang="scss">
.project-content {
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
</style>
