<script lang="ts" setup>
import projectsDataJson from '~/assets/data/projects.json'

import gsap from 'gsap'
import { useUi } from '~/stores/ui'

// L'anim d'entrée de la navbar (au chargement direct de la page) est jouée dans la timeline d'ici
definePageMeta({ navbarEnter: 'page' })

const projectsData = ref(projectsDataJson)
const stickyContainer = ref<HTMLElement | null>(null)
const projectsContainer = ref<HTMLElement | null>(null)
const projectDataRefs = ref<HTMLElement[]>([])
const projectAssetsRefs = ref<HTMLElement[]>([])
const mainAssetRefs = ref<HTMLElement[]>([])
const projectNumber = ref<number>(0)
const projectDataHeight = ref<number>(0)
// Projet dont l'image est au centre (la 1re est révélée par l'anim d'entrée)
const activeProjectIndex = ref<number>(0)

const uiStore = useUi()

// CTA "Open" qui suit la souris au hover de l'image principale (même logique que le "Close" du slug).
// Le hover est calculé sur le cadre réel de l'image active (qui change d'un projet à l'autre) :
// on teste la position souris dans son rect à chaque mouvement ET à chaque changement de projet.
const ctaOpen = ref<HTMLElement | null>(null)
const isHoveringImage = ref(false)
let isCtaShown = false
let isOpening = false
const mouse = {
  x: parseFloat(uiStore.mousePos.x),
  y: parseFloat(uiStore.mousePos.y),
  known: uiStore.mousePos.x.endsWith('px'),
}

// Collé à la souris sans durée tant qu'il est caché : au fade-in il est déjà au bon endroit
function placeCta() {
  if (!ctaOpen.value) return
  gsap.killTweensOf(ctaOpen.value, 'left,top')
  gsap.set(ctaOpen.value, { left: mouse.x, top: mouse.y })
}

function onMouseMove(e: MouseEvent) {
  uiStore.mousePos.x = `${e.clientX}px`
  uiStore.mousePos.y = `${e.clientY}px`
  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse.known = true

  if (!isCtaShown) placeCta()
  else gsap.to(ctaOpen.value, { left: mouse.x, top: mouse.y, ease: 'power1.out', duration: 0.35, overwrite: 'auto' })
  updateHover()
}

function updateHover() {
  const img = mainAssetRefs.value[activeProjectIndex.value]?.querySelector('img')
  let inside = false
  if (img && mouse.known && !isOpening) {
    const r = img.getBoundingClientRect()
    inside = mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom
  }
  if (inside === isHoveringImage.value) return
  isHoveringImage.value = inside
  inside ? showCta() : hideCta()
}

function showCta() {
  placeCta()
  isCtaShown = true
  gsap.to(ctaOpen.value, { opacity: 1, duration: 0.5, overwrite: 'auto' })
}

function hideCta() {
  isCtaShown = false
  gsap.to(ctaOpen.value, { opacity: 0, duration: 0.25, overwrite: 'auto' })
}

function onMainAssetsClick() {
  if (isHoveringImage.value) openActiveProject()
}

/**
 * Transition vers le slug (réglages modulables, `at` = position dans la timeline) :
 * tout fade out sauf l'image du centre, qui se redimensionne pour prendre exactement la place
 * de l'image focus du slug (60vh, ratio 254/317, scale 1.3, cover) => la view transition
 * (durée 0) n'a plus qu'à échanger les deux, sans saut. Même principe que home -> slug.
 */
const OPEN_ANIM = {
  fadeOut: { at: 0, duration: 0.5, ease: 'power1.inOut' },
  image: { at: 0.1, duration: 1, ease: 'power2.inOut' },
}
// Image focus du slug (voir .focused-image dans pages/projects/[slug].vue)
const SLUG_IMAGE = { heightVh: 60, ratio: 254 / 317, scale: 1.3 }

// 1re image du slug : les projets impairs y inversent images[0] et images[1].
// On affiche la même au centre pour que la transition tombe sur la même image.
function centerImageIndex(index: number) {
  return index % 2 === 0 ? 0 : 1
}

function openActiveProject() {
  const project = projectsData.value[activeProjectIndex.value]
  const img = mainAssetRefs.value[activeProjectIndex.value]?.querySelector('img')
  if (!project || !img || isOpening) return
  isOpening = true
  updateHover()
  // Plus de scroll pendant la transition (relancé au démontage)
  window.lenis?.stop()

  const { fadeOut, image } = OPEN_ANIM
  const targetHeight = (window.innerHeight * SLUG_IMAGE.heightVh) / 100

  // On fige la taille actuelle en px pour pouvoir l'animer, et on passe en cover
  // (l'image se recadre au fur et à mesure que son ratio change)
  const rect = img.getBoundingClientRect()
  gsap.set(img, { width: rect.width, height: rect.height, maxWidth: 'none', maxHeight: 'none', objectFit: 'cover' })

  ctx?.add(() => {
    gsap
      .timeline({
        onComplete() {
          navigateTo(`/projects/${project.slug}`)
        },
      })
      .to(['.projects-list', '.projects-assets'], { opacity: 0, duration: fadeOut.duration, ease: fadeOut.ease }, fadeOut.at)
      .to(
        img,
        {
          width: targetHeight * SLUG_IMAGE.ratio,
          height: targetHeight,
          scale: SLUG_IMAGE.scale,
          duration: image.duration,
          ease: image.ease,
        },
        image.at
      )
  })
}

// Espace entre le bas de la navbar et la première ligne de projet empilée
const NAV_GAP = 12

let ctx: gsap.Context | null = null
// Timeline de la navbar : créée hors du ctx (la navbar vit dans app.vue, elle ne doit pas
// être remise en caché par ctx.revert() quand on quitte la page)
let navTl: gsap.core.Timeline | null = null

onMounted(() => {
  projectNumber.value = projectsData.value.length
  stickyContainer.value!.style.height = window.innerHeight * 1.5 * (projectNumber.value + 1) + 'px'

  ctx = gsap.context(() => {
    setProjectsDataAbsolute()
    initMainAssets()
    animateProjectsOnScroll()
  }, stickyContainer.value!)

  window.addEventListener('mousemove', onMouseMove)

  // Anim d'entrée quand le calque blanc de transition disparaît (ou direct si arrivée sans transition)
  onPageRevealed(() => {
    if (!ctx) return // page déjà démontée
    ctx.add(() => enterAnim())
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  if (isOpening) window.lenis?.start()
  // Tue les ScrollTriggers/tweens de la page (sinon ils restent actifs sur les autres pages)
  // On termine la navbar et on la détache de la timeline de page avant le revert
  if (navTl) {
    navTl.progress(1)
    navTl.parent?.remove(navTl)
    navTl = null
  }
  ctx?.revert()
  ctx = null
})

/**
 * Réglages de l'anim d'entrée (tout est modulable ici).
 * `at` = position dans la timeline GSAP :
 *   0 / 0.5      -> temps absolu (s)
 *   '>'          -> à la fin de l'étape précédente ; '>-0.3' = 0.3s avant la fin
 *   '<'          -> en même temps que le début de l'étape précédente ; '<+0.2' = 0.2s après
 */
const ENTER_ANIM = {
  // Navbar : seulement si on arrive directement sur la page (reload) ; sinon elle est déjà affichée
  navbar: {
    at: 0.8,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    fromYPercent: -100,
  },
  // Image du milieu (projet actif) : fade-in
  mainImage: {
    at: 0.6,
    duration: 0.8,
    ease: 'power1.inOut',
  },
  // Noms des projets : arrivent depuis le haut jusqu'à leur place + fade-in, en stagger
  names: {
    at: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    fromYPercent: -100,
  },
  // Location + author/date : fade-in ligne par ligne, une fois les noms affichés
  infos: {
    at: 0.3,
    duration: 0.6,
    ease: 'power1.out',
    stagger: 0.08,
    fromYPercent: 0, // ex. -50 pour qu'elles glissent aussi un peu
  },
}

function enterAnim() {
  const { navbar, mainImage, names, infos } = ENTER_ANIM
  const tl = gsap.timeline()

  ctx?.ignore(() => (navTl = navbarEnterTimeline(navbar)))
  if (navTl) tl.add(navTl, navbar.at)

  // On révèle le conteneur (et pas une image précise) : au reload en milieu de page, le projet
  // actif peut encore changer (restauration du scroll => onEnter des ScrollTriggers) pendant l'anim
  tl.fromTo(
    '.projects-main-assets',
    { opacity: 0 },
    {
      opacity: 1,
      duration: mainImage.duration,
      ease: mainImage.ease,
      onStart() {
        isMainRevealed = true
      },
    },
    mainImage.at
  )

  tl.fromTo(
    '.project-data .name',
    { yPercent: names.fromYPercent, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: names.duration, ease: names.ease, stagger: names.stagger },
    names.at
  )

  // Une sous-timeline pour les infos : chaque ligne (location + author/date ensemble) démarre
  // `stagger` secondes après la précédente ; le bloc entier est placé à `infos.at`
  const infosTl = gsap.timeline()
  projectDataRefs.value.forEach((row, i) => {
    infosTl.fromTo(
      row.querySelectorAll('.location, .author-date'),
      { yPercent: infos.fromYPercent, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: infos.duration, ease: infos.ease },
      i * infos.stagger
    )
  })
  tl.add(infosTl, infos.at)

  return tl
}

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
        // En remontant : on revient à l'image du projet précédent (la 1re reste affichée tout en haut)
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
// Tant que l'image du centre n'est pas révélée, les changements de projet sont instantanés
// (sinon double fade au reload : fade du changement de projet + fade de l'anim d'entrée)
let isMainRevealed = false

// Conteneur caché (révélé par ENTER_ANIM.mainImage), image active déjà à 1 à l'intérieur
function initMainAssets() {
  gsap.set('.projects-main-assets', { opacity: 0 })
  mainAssetRefs.value.forEach((asset, index) => gsap.set(asset, { opacity: index === activeProjectIndex.value ? 1 : 0 }))
}

function setActiveProject(index: number) {
  if (index === activeProjectIndex.value) return
  // index -1 (ou aucun précédent) => pas d'élément, on ne tween que ce qui existe
  const previous = mainAssetRefs.value[activeProjectIndex.value]
  const next = mainAssetRefs.value[index]
  activeProjectIndex.value = index
  // La nouvelle image n'a pas forcément le même cadre : on recalcule le hover
  updateHover()

  if (!isMainRevealed) {
    if (previous) gsap.set(previous, { opacity: 0, overwrite: 'auto' })
    if (next) gsap.set(next, { opacity: 1, overwrite: 'auto' })
    return
  }
  if (previous) gsap.to(previous, { opacity: 0, duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' })
  if (next) gsap.to(next, { opacity: 1, duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' })
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
    <div ref="ctaOpen" class="cta-open">
      <p>Open</p>
    </div>
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
      <div class="projects-main-assets" :class="{ 'is-hovering': isHoveringImage }" @click="onMainAssetsClick">
        <div
          class="main-asset"
          v-for="(project, index) in projectsData"
          :ref="
            (el) => {
              if (el) mainAssetRefs[index] = el as HTMLElement
            }
          "
        >
          <img
            :src="project.images[centerImageIndex(index)]"
            alt=""
            :style="index === activeProjectIndex ? { viewTransitionName: `project-${project.slug}` } : undefined"
          />
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
          <div class="l-image"><img :src="project.images[1 - centerImageIndex(index)]" alt="" /></div>
          <div class="r-image"><img :src="project.images[2]" alt="" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.all-projects {
  height: 600vh;
  .cta-open {
    opacity: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    transform: translate(-50%, -80%);
    padding: 10px;
    pointer-events: none;
    mix-blend-mode: difference;
    > p {
      color: white;
    }
  }
  .projects-container {
    background-color: white;
    height: 100svh;
    // 100% et pas 100vw : 100vw inclut la scrollbar => centre décalé de ~la moitié de sa largeur
    // par rapport au slug (centré sur la largeur sans scrollbar) => saut vers la gauche au switch
    width: 100%;
    position: fixed;
    top: 0;

    .projects-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: end;
      // Centré dès le rendu serveur (avant que le JS passe les lignes en absolute centrées)
      align-items: center;
      gap: 4px;
      z-index: 100;
      // Laisse passer la souris vers l'image principale (seuls les liens restent cliquables)
      pointer-events: none;
      a {
        pointer-events: auto;
      }

      position: fixed;
      mix-blend-mode: difference;

      .project-data {
        display: flex;
        justify-content: space-between;
        color: white;
        width: calc(100% - 60px);
        // Cachés jusqu'à l'anim d'entrée
        .name,
        .location,
        .author-date {
          opacity: 0;
        }
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
      width: 100%;
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

        pointer-events: none;
        // L'image prend sa taille réelle (ratio conservé) dans le cadre : son rect = zone de hover
        display: flex;
        align-items: center;
        justify-content: center;

        > img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
        }
      }
      &.is-hovering {
        cursor: pointer;
      }
    }
    .projects-assets {
      pointer-events: none;
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
        // Position de départ du parallax posée en CSS : sinon, au reload, les images
        // sont visibles au centre jusqu'à ce que GSAP applique son état "from"
        > .l-image {
          width: 15%;
          transform: translateY(100vh);
          img {
            object-fit: cover;
          }
        }
        > .r-image {
          width: 15%;
          transform: translateY(140vh);
          img {
            object-fit: cover;
          }
        }
      }
    }
  }
}
</style>
