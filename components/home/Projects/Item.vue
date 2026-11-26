<script lang="ts" setup>
import gsap from 'gsap'
import type { Project } from '~/types'

export interface ProjectItem {
  project: Project
  index: number
  activeProject: number
}
const props = withDefaults(defineProps<ProjectItem>(), {
  activeProject: 0,
})

const leftImage = ref<HTMLElement>()
const rightImage = ref<HTMLElement>()
const projectText = ref<HTMLElement>()
const isEven = computed(() => props.index % 2 === 0)

function exitTransition(destination: string) {
  const extiTl = gsap.timeline({
    onComplete() {
      navigateTo(`/projects/${destination}`)
    },
  })

  extiTl.to(projectText.value!, { opacity: 0 }, 0).to('.projects-navigation', { opacity: 0 }, 0)

  // L'image principale prend exactement la taille de l'image focus du slug (selon le breakpoint)
  const mainImage = isEven.value ? leftImage.value! : rightImage.value!
  const { width, height, scale } = getSlugImageSize()
  const otherImage = isEven.value ? rightImage.value! : leftImage.value!
  extiTl
    .to(mainImage, { width, height, top: '50%', left: '50%', xPercent: -50, yPercent: -50, x: 0, y: 0, scale, ease: 'power1.inOut' }, 0)
    .to(otherImage, { top: '50%', left: '50%', xPercent: -50, yPercent: -50, x: 0, y: 0, ease: 'power1.inOut' }, 0)
}

defineExpose({ exitTransition })
</script>

<template>
  <div :class="['project-content', `project--${index}`]">
    <div class="project-text" ref="projectText">
      <h2 class="title">{{ project.name }}</h2>
      <p class="description">{{ project.description }}</p>
    </div>

    <div class="left-images" :class="{ '-even': isEven }">
      <div ref="leftImage" class="project-image" :class="isEven ? 'top' : 'bottom'" :style="isEven ? { viewTransitionName: `project-${project.slug}` } : ''">
        <img :src="project.images[0]" alt="" />
      </div>
    </div>
    <div class="right-images" :class="{ '-even': isEven }">
      <div ref="rightImage" class="project-image" :class="isEven ? 'bottom' : 'top'" :style="!isEven ? { viewTransitionName: `project-${project.slug}` } : ''">
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
  display: none;
  z-index: 7;
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
    z-index: -1;
    .top {
      left: 72px;
      top: 10vh;
      height: 317px;
      aspect-ratio: 254/317;
    }
    .bottom {
      left: 72px;
      bottom: 10vh;

      height: 277px;
      aspect-ratio: 394/277;
    }
    &.-even {
      z-index: 0;
    }
  }
  > .right-images {
    .top {
      position: absolute;
      right: 72px;
      top: 10vh;
      aspect-ratio: 254/317;
      height: 317px;
    }
    .bottom {
      position: absolute;
      right: 72px;
      bottom: 10vh;
      height: 277px;
      aspect-ratio: 394/277;
    }
    &.-even {
      z-index: -1;
    }
  }
}

// ---------- Mobile (maquette 320 x 568) ----------
// Colonne centrée verticalement : texte (63px) / 39 / image (295px) / 39 / menu (85px) = 521px
// => haut de la colonne à 50% - 261px
@media screen and (max-width: 760px) {
  .project-content {
    > .project-text {
      gap: 4px;
      max-width: none;
      margin-top: calc(50vh - 261px);
      > .title {
        font-size: 32px;
      }
      > .description {
        width: 242px;
        font-size: 8px;
      }
    }
    // Une seule image en mobile : la principale (.top), centrée sous le texte
    // (pas de transform CSS : l'anim de sortie anime xPercent/yPercent)
    .project-image.top {
      top: calc(50% - 159px);
      left: calc(50% - 127px);
      right: auto;
      width: 254px;
      height: 295px;
      aspect-ratio: auto;
    }
    .project-image.bottom {
      display: none;
    }
  }
}

// ---------- Tablette (sans maquette) : images réduites et rapprochées des bords, texte plus étroit ----------
@media screen and (min-width: 761px) and (max-width: 1024px) {
  .project-content {
    > .project-text {
      max-width: 420px;
      > .title {
        font-size: 40px;
      }
    }
    .project-image.top {
      height: 220px;
    }
    .project-image.bottom {
      height: 190px;
    }
    > .left-images .project-image {
      left: 30px;
    }
    > .right-images .project-image {
      right: 30px;
    }
  }
}
</style>
