<script lang="ts" setup>
import gsap from 'gsap'

import projectsData from '~/assets/data/projects.json'
import type { Project } from '~/types'

import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { useUi } from '~/stores/ui'

const uiStore = useUi()

const route = useRoute()
const { leave } = usePageTransition()
const currentFocusedImage = ref<number>(0)
const currentFocusedSliderImage = ref<number>(-1)

const projectImages = ref<string[]>([])
const imageRefs = shallowRef<HTMLElement[]>([])
const focusedContent = ref<HTMLElement>()
const focusedImage = ref<HTMLElement>()
const root = ref<HTMLElement>()
const ctaClose = ref<HTMLElement | null>(null)

// Le CTA "Close" est visible (et le clic actif) seulement quand l'anim d'entrée est finie,
// qu'on ne survole pas un élément interactif et qu'on n'est pas déjà en train de sortir.
const isEnterDone = ref(false)
const isHoveringUi = ref(false)
// La navbar vit dans app.vue (hors de la page) : on écoute son hover à la main
const isHoveringNav = ref(false)
const isLeaving = ref(false)
const canClose = computed(() => isEnterDone.value && !isHoveringUi.value && !isHoveringNav.value && !isLeaving.value)

const onNavEnter = () => (isHoveringNav.value = true)
const onNavLeave = () => (isHoveringNav.value = false)
let navbarEl: HTMLElement | null = null

const splitedText = ref()
const prevNavigation = ref()
const nextNavigation = ref()

const projectTitle = ref()
const currentProjectIndex = computed(() => projectsData.findIndex((project) => project.slug === route.params.slug))

const currentProject = computed<Project | undefined>(() => projectsData.find((p) => p.slug === route.params.slug))

const isEven = currentProjectIndex.value % 2 === 0

// Images prêtes dès le premier rendu (et pas dans onMounted) : la view transition
// capture le nouvel état au `page:finish`, l'image focus doit déjà avoir sa src.
if (currentProject.value) {
  const images = [...currentProject.value.images]
  if (images.length > 1 && !isEven) {
    ;[images[0], images[1]] = [images[1], images[0]]
  }
  projectImages.value = images
}

// Top-level await => le <Suspense> de NuxtPage attend que l'image soit décodée
// avant de déclencher `page:finish`, donc pas de frame vide pendant la transition.
if (import.meta.client && projectImages.value[0]) {
  const img = new Image()
  img.src = projectImages.value[0]
  await img.decode().catch(() => {})
}

const { enterAnim, nextImage, prevImage, changeActiveImage } = useProjectPageAnimation({
  splitedText,
  imageRefs,
  focusedImage,
  focusedContent,
  currentFocusedSliderImage,
  prevNavigation,
  nextNavigation,
  projectTitle,
  currentFocusedImage,
  projectImages,
})
onMounted(async () => {
  await nextTick()
  splitedText.value = new SplitText('.project-name', { type: 'words', autoSplit: true, wordsClass: 'word++' })

  if (mouse.known) placeCta()

  window.addEventListener('mousemove', onMouseMove)

  navbarEl = document.querySelector('.navbar')
  navbarEl?.addEventListener('mouseenter', onNavEnter)
  navbarEl?.addEventListener('mouseleave', onNavLeave)
  isHoveringNav.value = !!navbarEl?.matches(':hover')

  enterAnim().then(() => {
    isEnterDone.value = true
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  navbarEl?.removeEventListener('mouseenter', onNavEnter)
  navbarEl?.removeEventListener('mouseleave', onNavLeave)
  gsap.killTweensOf(ctaClose.value)
})

// Position souris connue ? (le store garde celle de la home ; vaut '0' si on arrive directement sur la page)
const mouse = {
  x: parseFloat(uiStore.mousePos.x),
  y: parseFloat(uiStore.mousePos.y),
  known: uiStore.mousePos.x.endsWith('px'),
}
// Le CTA ne suit la souris en douceur que lorsqu'il est affiché.
// Tant qu'il est caché, il est collé instantanément à la souris (gsap.set) :
// au moment du fade-in il est déjà au bon endroit, il ne "voyage" jamais depuis le coin.
let isCtaShown = false

// Place le CTA sous la souris sans durée (et coupe un éventuel suivi en cours)
function placeCta() {
  if (!ctaClose.value) return
  gsap.killTweensOf(ctaClose.value, 'left,top')
  gsap.set(ctaClose.value, { left: mouse.x, top: mouse.y })
}

function onMouseMove(e: MouseEvent) {
  uiStore.mousePos.x = `${e.clientX}px`
  uiStore.mousePos.y = `${e.clientY}px`
  mouse.x = e.clientX
  mouse.y = e.clientY

  if (!mouse.known) {
    mouse.known = true
    placeCta()
    if (canClose.value) showCtaClose()
    return
  }

  if (!isCtaShown) {
    placeCta()
    return
  }
  gsap.to(ctaClose.value, { left: mouse.x, top: mouse.y, ease: 'power1.out', duration: 0.35, overwrite: 'auto' })
}

function showCtaClose() {
  if (!mouse.known || !ctaClose.value) return
  placeCta()
  isCtaShown = true
  gsap.to(ctaClose.value, { opacity: 1, duration: 0.75, overwrite: 'auto' })
}
function hideCtaClose() {
  if (!ctaClose.value) return
  isCtaShown = false
  gsap.to(ctaClose.value, { opacity: 0, duration: 0.25, overwrite: 'auto' })
}

watch(canClose, (visible) => (visible ? showCtaClose() : hideCtaClose()))

function handleClose() {
  if (!canClose.value) return
  isLeaving.value = true
  leave()
}
</script>

<template>
  <main class="main" ref="root" @click="handleClose">
    <div ref="ctaClose" class="cta-close">
      <p>Close</p>
    </div>
    <!-- Mobile / tactile : bouton fixe en haut à droite (le "Close" qui suit la souris n'existe pas sans souris) -->
    <button class="btn-close" :class="{ 'is-visible': canClose }" type="button" aria-label="Close">Close</button>
    <div class="project-layout">
      <div ref="focusedContent" class="focused-content">
        <div ref="focusedImage" class="focused-image" :style="{ viewTransitionName: `project-${currentProject?.slug}` }">
          <img :src="projectImages[currentFocusedImage]" alt="" />
        </div>
        <div class="utils-project-informations">
          <p class="location">{{ currentProject?.location }}</p>
          <img src="/icons/square.svg" alt="" />
          <a :href="currentProject?.author.link" class="author" @mouseenter="isHoveringUi = true" @mouseleave="isHoveringUi = false">{{
            currentProject?.author.name
          }}</a>
        </div>
      </div>
      <div class="project-informations">
        <h1 class="project-name title" ref="projectTitle">
          {{ currentProject?.name }}
        </h1>
        <div class="counter title">
          <div class="index-container">
            <div class="index-wrapper">
              <span ref="activeIndex" class="index" v-for="i in projectImages.length" :key="i" :class="{ active: i - 1 === currentFocusedImage }">
                {{ i }}
              </span>
            </div>
          </div>
          <span class="length">/ {{ projectImages.length }}</span>
        </div>
      </div>
      <div class="slider" @mouseenter="isHoveringUi = true" @mouseleave="isHoveringUi = false">
        <p @click="prevImage" class="slider-navigation prev"><UtilsTextShuffle from="prev" to="prev" :duration="0.5" :step="5" ref="prevNavigation" /></p>
        <div class="slider-images">
          <div
            v-for="(image, index) in projectImages"
            :ref="(el) => (imageRefs[index] = el as HTMLElement)"
            :class="['image-slider', { active: index === currentFocusedSliderImage }]"
            @click="changeActiveImage(index)"
          >
            <img :src="image" alt="" />
          </div>
        </div>
        <p @click="nextImage" class="slider-navigation next"><UtilsTextShuffle from="next" to="next" :duration="0.5" :step="5" ref="nextNavigation" /></p>
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style lang="scss" scoped>
.main {
  height: 100vh;
  background-color: white;
  cursor: pointer;
  .cta-close {
    opacity: 0;
    position: fixed;
    z-index: 999;
    transform: translate(-50%, -80%);
    padding: 10px;
    pointer-events: none;
    mix-blend-mode: difference;
    > p {
      color: white;
    }
  }
  .project-layout {
    width: 100%;
    > .focused-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      width: 30%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      > .focused-image {
        height: 60vh;
        aspect-ratio: 254/317;
        // Zoom d'entrée (1.3 -> 1) : desktop/tablette seulement, annulé en mobile
        transform: scale(1.3);

        > img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
      > .utils-project-informations {
        display: none;
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
    > .project-informations {
      position: absolute;
      display: flex;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      justify-content: space-between;
      padding: 0 30px;
      > .project-name {
        flex-direction: column;
      }
      > .project-name,
      .counter {
        max-width: 20%;
        display: flex;
        opacity: 0;
        > .index-container {
          width: 40px;
          overflow: hidden;
          position: relative;
          margin-right: 6px;
          > .index-wrapper {
            position: relative;
            display: flex;
            > .index {
              width: 40px;

              text-align: center;
              position: absolute;
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
              &.active {
                opacity: 1;
              }
            }
          }
        }
      }
    }
    > .slider {
      display: flex;
      gap: 34px;
      align-items: baseline;
      height: 15vh;
      bottom: 24px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      justify-content: center;

      > .slider-navigation {
        font-weight: 600;
        font-size: 18px;
        width: 48px;
        position: relative;
        opacity: 0;

        > span {
          position: absolute;
          bottom: 0;
        }
      }
      > .slider-images {
        display: flex;
        gap: 24px;
        height: 100%;
        > .image-slider {
          transform: scale(0.8);
          transition: transform 0.4s;
          transform-origin: center bottom;
          height: 100%;
          aspect-ratio: 82/104;
          overflow: hidden;
          &.active {
            transform: scale(1);
          }
          > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
}

// Bouton "Close" fixe : seulement sur mobile / tactile (sinon c'est le "Close" qui suit le curseur)
.main .btn-close {
  display: none;
  position: fixed;
  // 24px sous la navbar (bas de la navbar mobile = 18px), 20px du bord droit
  top: calc(18px + 24px);
  right: 20px;
  z-index: 20;
  padding: 0;
  font-size: 10px;
  line-height: 1;
  font-weight: 400;
  color: black;
  background: none;
  border: 0;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s;
  text-transform: uppercase;
  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }
}

// Pas de souris (tactile) : pas de "Close" qui suit le curseur, bouton fixe à la place
@media (hover: none) {
  .main .cta-close {
    visibility: hidden;
  }
  .main .btn-close {
    display: block;
  }
}
@media screen and (max-width: 760px) {
  .main {
    // Garde-fou : aucun débordement horizontal (l'image fait 100vw - 40px)
    // (position relative : sinon les enfants en absolute ne sont pas rognés)
    position: relative;
    overflow-x: clip;
  }
  .main .btn-close {
    display: block;
  }
}

// ---------- Mobile (maquette 320 x 568) ----------
// Image 242 x 324 centrée (11px sous le centre), titre 15px au-dessus, infos 6px en dessous,
// prev/next + miniatures en bas.
// ⚠️ Taille de l'image synchronisée avec getSlugImageSize() (composables/useBreakpoints.ts)
@media screen and (max-width: 760px) {
  .main .project-layout {
    // Largeur de l'image : écran - 40px (20px de marge de chaque côté), plafonnée pour que sa hauteur
    // reste <= 66vh (ne jamais toucher le titre ni prev/next sur les écrans larges/courts)
    --image-w: min(calc(100vw - 40px), 49.3vh);
    --image-h: calc(var(--image-w) * 324 / 242);
    > .focused-content {
      width: auto;
      gap: 0;
      > .focused-image {
        // Hauteur explicite : avec height auto + aspect-ratio, l'img (height 100%) étire le cadre
        width: var(--image-w);
        height: var(--image-h);
        transform: none;
        aspect-ratio: auto;
      }
      // Hors flux : n'influence pas le centrage de l'image.
      // Centré avec left/right + justify (pas de translate CSS : GSAP l'écrase en animant y)
      > .utils-project-informations {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        justify-content: center;
        gap: 5.35px;
        font-size: 9.36px;
        white-space: nowrap;
        > img {
          width: 3.34px;
        }
      }
    }
    > .project-informations {
      // Bas du titre = haut de l'image (centre à 50% + 11px) - 15px, quelle que soit sa taille
      top: auto;
      bottom: calc(50% + var(--image-h) / 2 + 4px);
      transform: none;
      justify-content: center;
      padding: 0 12px;
      > .project-name {
        display: block;
        max-width: none;
        font-size: 32px;
        text-align: center;
      }
      > .counter {
        display: none;
      }
    }
    > .slider {
      // Miniatures 26.5 x 33.3 (active 33.6 x 42.3), 11px entre elles, à 12px du bas
      bottom: 12px;
      height: 42.33px;
      gap: 0;
      align-items: flex-end;
      > .slider-navigation {
        // prev / next aux bords (marges 12), 8px au-dessus des miniatures
        position: absolute;
        top: -18px;
        width: auto;
        font-size: 10px;
        line-height: 1;
        &.prev {
          left: calc(12px - (100vw - 100%) / 2);
        }
        &.next {
          right: calc(12px - (100vw - 100%) / 2);
        }
        > span {
          position: static;
        }
      }
      > .slider-images {
        // gap de layout : 11px visibles - 2 x 3.35px de réduction (scale 0.8 des inactives)
        gap: 4.3px;
      }
    }
  }
}

// ---------- Tablette (sans maquette) ----------
@media screen and (min-width: 761px) and (max-width: 1024px) {
  .main .project-layout {
    > .project-informations {
      > .project-name,
      .counter {
        font-size: 40px;
      }
    }
    > .slider {
      height: 80px;
      gap: 20px;
      > .slider-images {
        gap: 12px;
      }
    }
  }
}
</style>
