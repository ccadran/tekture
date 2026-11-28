<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import projectsDataJson from '~/assets/data/projects.json'
import { useUi } from '~/stores/ui'

const uiStore = useUi()

const projectsData = ref(projectsDataJson)

const activeProjectIndex = ref<number>(0)

const projectsSection = ref<HTMLElement | null>(null)

const navigationRef = ref()
const ctaEnter = ref<HTMLElement | null>(null)
const scrollTriggerInstance = ref<ScrollTrigger | null>(null)
const isMounted = ref(false)
const isProjectsVisible = ref<boolean>(false)
const isCtaEnterVisible = ref<boolean>(true)
const projectItemsRefs = ref<any>([])

const { projectsEnter, projectIn, projectOut, moveMarkers, wrapLinesWithInner, cleanup } = useProjectAnimation()

onMounted(async () => {
  isMounted.value = true
  new SplitType('.description ', { types: 'lines' })
  new SplitType('.project-text .title ', { types: 'words, chars' })

  wrapLinesWithInner()

  projectsSection.value = document.querySelector('.projects')

  const restoredIndex = uiStore.lastProjectIndex
  uiStore.lastProjectIndex = null
  if (restoredIndex !== null) activeProjectIndex.value = restoredIndex

  // Pas de changement de projet pendant l'intro de la section
  const introTl = projectsEnter(activeProjectIndex.value, restoredIndex !== null)
  introTl?.eventCallback('onStart', () => {
    isAnimating.value = true
  })
  introTl?.eventCallback('onComplete', () => {
    isAnimating.value = false
  })
  moveMarkers(activeProjectIndex.value)
  initProjectsObserver()

  if (restoredIndex !== null) {
    // Retour depuis un projet : on ne se fie pas à la restauration de scroll du router
    // (position prise au clic, parfois avant que la section soit calée).
    // On attend qu'elle soit passée (page:finish + setTimeout côté Nuxt) puis on recale + verrouille la section.
    nuxtApp.hooks.hookOnce('page:finish', () => {
      setTimeout(() => requestAnimationFrame(() => lockSection(true)), 0)
    })
  }

  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('keydown', onKeyDown)

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isProjectsVisible.value = entry.isIntersecting
        if (!ctaEnter.value) return
        if (isProjectsVisible.value) {
          showCtaEnter()
        } else {
          hideCtaEnter()
        }
      })
    },
    { threshold: 0.16 }
  )
  observer.observe(projectsSection.value!)

  // Le CTA ne doit pas passer au-dessus des liens du footer.
  // ⚠️ Le footer est sticky (bottom: 0, z-index: -1) : il est toujours "dans" le viewport, un IntersectionObserver ne marche pas.
  // Il est réellement révélé quand le bas de la section projets remonte au-dessus du bas de l'écran.
  window.addEventListener('scroll', checkFooterReveal, { passive: true })

  window.addEventListener('mousemove', onMouseMove)
})

let observer: IntersectionObserver | null = null
const isFooterVisible = ref(false)

function checkFooterReveal() {
  if (!projectsSection.value) return
  const revealed = projectsSection.value.getBoundingClientRect().bottom < window.innerHeight - 40
  if (revealed === isFooterVisible.value) return
  isFooterVisible.value = revealed
  if (!ctaEnter.value) return
  if (revealed) hideCtaEnter()
  else if (isProjectsVisible.value) showCtaEnter()
}

function onMouseMove(e: MouseEvent) {
  uiStore.mousePos.x = `${e.clientX}px`
  uiStore.mousePos.y = `${e.clientY}px`
  if (!isProjectsVisible.value || !ctaEnter.value) return
  gsap.to(ctaEnter.value, { left: e.clientX, top: e.clientY, ease: 'power1.out', duration: 0.35 })
}

/**
 * Changement de projet "un coup de scroll = un projet" :
 * - quand la section arrive en haut de l'écran on la verrouille (lenis.stop) et l'Observer prend la main ;
 * - chaque coup de molette / swipe passe au projet suivant/précédent, ignoré si une anim est en cours ;
 * - au-delà du dernier (ou avant le premier) projet, on déverrouille et on sort de la section.
 */
const nuxtApp = useNuxtApp()
const isAnimating = ref(false)
const isLocked = ref(false)
let projectsObserver: Observer | null = null

/**
 * Détection des "coups de scroll" molette/trackpad.
 * Un geste trackpad = des deltas qui montent (impulsion) puis décroissent (inertie) pendant ~1s.
 * Un NOUVEAU coup est détecté si :
 *  - il arrive après une pause (> WHEEL_GAP_MS sans event), ou
 *  - pendant l'inertie d'un coup précédent (deltas déjà en baisse), les deltas remontent brusquement.
 * Chaque coup détecté est "consommé" : la suite de ce même geste (montée + inertie) est ignorée.
 */
const WHEEL_GAP_MS = 120
const WHEEL_RISE_RATIO = 1.4 // delta > précédent * 1.4 ...
const WHEEL_RISE_MIN = 4 // ... et au moins +4px (évite le bruit en fin d'inertie)
let lastWheelTime = 0
let lastWheelAbs = 0
let wheelPeakPassed = true // false tant que le geste consommé n'a pas atteint son pic

function consumeCurrentWheelGesture() {
  wheelPeakPassed = false
}

function isNewWheelGesture(e: WheelEvent) {
  const now = performance.now()
  // deltaMode 1 = lignes (Firefox + souris) : on ramène en px
  const abs = Math.abs(e.deltaY) * (e.deltaMode === 1 ? 16 : 1)
  const gap = now - lastWheelTime
  const prev = lastWheelAbs
  lastWheelTime = now
  lastWheelAbs = abs

  if (gap > WHEEL_GAP_MS) return true
  if (!wheelPeakPassed) {
    if (abs < prev) wheelPeakPassed = true // l'impulsion est finie, on est dans l'inertie
    return false
  }
  return abs > prev * WHEEL_RISE_RATIO && abs - prev > WHEEL_RISE_MIN
}

function onWheel(e: WheelEvent) {
  // On analyse tous les events (même non verrouillé) pour connaître l'état du geste en cours
  const isNewGesture = isNewWheelGesture(e)
  if (!isNewGesture || e.deltaY === 0) return
  consumeCurrentWheelGesture()

  if (!isLocked.value) return
  goToProject(activeProjectIndex.value + (e.deltaY > 0 ? 1 : -1))
}

function getSectionTop() {
  return projectsSection.value!.getBoundingClientRect().top + window.scrollY
}

/**
 * @param immediate recalage instantané (retour depuis un projet, sous le calque blanc).
 * Sinon on finit la course en douceur : on arrive dans la zone de verrouillage à quelques px
 * de la cible, souvent pendant un scroll animé (snap du footer / de l'entrée de section),
 * et un saut instantané se voyait sur 1 frame.
 */
function lockSection(immediate = false) {
  if (isLocked.value || !isMounted.value) return
  const lenis = window.lenis
  isLocked.value = true
  // Le geste (et son inertie) qui nous a amenés ici ne doit pas changer de projet
  consumeCurrentWheelGesture()
  projectsObserver?.enable()
  if (!lenis) return

  // Lenis borne scrollTo à sa hauteur en cache (recalculée avec 250ms de debounce) :
  // juste après un changement de page elle peut encore être celle de la page précédente.
  lenis.resize()

  const stopIfStillLocked = () => {
    if (isLocked.value) lenis.stop()
  }
  const top = getSectionTop()
  if (immediate || Math.abs(lenis.scroll - top) < 1) {
    lenis.scrollTo(top, { immediate: true, force: true })
    stopIfStillLocked()
    return
  }
  // lerp => on repart de la position actuelle et on décélère jusqu'à la cible, sans à-coup.
  // lock: true bloque la molette pendant ces quelques frames.
  lenis.scrollTo(top, { lerp: 0.15, force: true, lock: true, onComplete: stopIfStillLocked })
}

function unlockSection() {
  if (!isLocked.value) return
  isLocked.value = false
  projectsObserver?.disable()
  window.lenis?.start()
}

function initProjectsObserver() {
  // Touch uniquement (chaque swipe est un geste distinct) ; la molette passe par onWheel
  projectsObserver = Observer.create({
    target: window,
    type: 'touch',
    tolerance: 10,
    preventDefault: true,
    onUp: () => goToProject(activeProjectIndex.value + 1),
    onDown: () => goToProject(activeProjectIndex.value - 1),
  })
  projectsObserver.disable()

  // Zone de verrouillage : quelques px autour du moment où la section touche le haut de l'écran
  scrollTriggerInstance.value = ScrollTrigger.create({
    trigger: projectsSection.value,
    start: 'top top+=5',
    end: 'top top-=5',
    onEnter: () => lockSection(), // en descendant (ou saut de scroll, ex. restauration au retour d'un projet)
    onEnterBack: () => lockSection(), // en remontant depuis le footer
    // Encore verrouillé alors qu'on sort de la zone => drag de la scrollbar : on libère
    onLeave: unlockSection,
    onLeaveBack: unlockSection,
  })
}

// Lenis stoppé ne bloque que molette + touch : le clavier change de projet à la place de scroller
const NEXT_KEYS = ['ArrowDown', 'PageDown', ' ']
const PREV_KEYS = ['ArrowUp', 'PageUp']
function onKeyDown(e: KeyboardEvent) {
  if (!isLocked.value) return
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

  const isPrev = PREV_KEYS.includes(e.key) || (e.key === ' ' && e.shiftKey)
  const isNext = !isPrev && NEXT_KEYS.includes(e.key)
  if (!isPrev && !isNext && e.key !== 'Home' && e.key !== 'End') return

  e.preventDefault()
  if (e.repeat) return
  if (isNext) goToProject(activeProjectIndex.value + 1)
  if (isPrev) goToProject(activeProjectIndex.value - 1)
}

function goToProject(index: number) {
  if (!isLocked.value || isAnimating.value) return

  if (index >= projectsData.value.length) {
    // Après le dernier projet : on file vers le footer
    unlockSection()
    window.lenis?.scrollTo('.footer', { duration: 1, lock: true })
    return
  }
  if (index < 0) {
    // Avant le premier projet : on remonte vers l'intro
    unlockSection()
    window.lenis?.scrollTo(getSectionTop() - window.innerHeight, { duration: 1.2, lock: true })
    return
  }
  changeProject(index)
}

function changeProject(index: number) {
  if (!isMounted.value || isAnimating.value) return
  if (index === activeProjectIndex.value) return

  isAnimating.value = true
  projectOut(activeProjectIndex.value)
  projectIn(index, false, navigationRef).eventCallback('onComplete', () => {
    isAnimating.value = false
  })
  activeProjectIndex.value = index
  moveMarkers(index)
}

function showCtaEnter() {
  if (isFooterVisible.value) return
  isCtaEnterVisible.value = true
  ctaEnter.value!.style.display = 'block'
  ctaEnter.value!.style.left = uiStore.mousePos.x
  ctaEnter.value!.style.top = uiStore.mousePos.y
  gsap.to(ctaEnter.value, { opacity: 1, duration: 0.75, overwrite: 'auto' })
}
function hideCtaEnter() {
  isCtaEnterVisible.value = false
  gsap.to(ctaEnter.value, {
    opacity: 0,
    duration: 0.25,
    overwrite: 'auto',
    onComplete: () => {
      ctaEnter.value!.style.display = 'none'
    },
  })
}

function handleProjectClick() {
  if (isCtaEnterVisible.value && !isAnimating.value) {
    isAnimating.value = true // bloque le scroll de projets pendant l'anim de sortie
    uiStore.lastProjectIndex = activeProjectIndex.value
    projectItemsRefs.value[activeProjectIndex.value].exitTransition(projectsData.value[activeProjectIndex.value].slug)
    hideCtaEnter()
  }
}

onBeforeUnmount(() => {
  isMounted.value = false
  cleanup()
  scrollTriggerInstance.value?.kill()
  projectsObserver?.kill()
  // Sinon Lenis reste stoppé (overflow hidden) sur la page suivante
  unlockSection()
  observer?.disconnect()
  window.removeEventListener('scroll', checkFooterReveal)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <section class="projects">
    <div ref="ctaEnter" class="cta-enter">
      <p>ENTER</p>
    </div>
    <div class="project-layout" @click="handleProjectClick">
      <nav class="projects-navigation" @mouseenter="hideCtaEnter" @mouseleave="showCtaEnter">
        <div class="markers">
          <img class="left" src="/icons/marker.svg" alt="" />
          <img class="right" src="/icons/marker.svg" alt="" />
        </div>
        <HomeProjectsNavigation :projectsData="projectsData" @clicked="changeProject($event)" ref="navigationRef" />
      </nav>
      <HomeProjectsItem
        v-for="(project, index) in projectsData"
        :project="project"
        :index="index"
        :activeProject="activeProjectIndex"
        :ref="
          (el) => {
            if (el) projectItemsRefs[index] = el
          }
        "
      />
    </div>
  </section>
</template>

<style lang="scss">
.projects {
  height: 100vh;
  background-color: white;
  .cta-enter {
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
  > .project-layout {
    height: 100vh;
    position: sticky;
    top: 0;
    cursor: pointer;

    > .projects-navigation {
      position: absolute;
      z-index: 6;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      > .markers {
        position: absolute;
        display: flex;
        justify-content: space-between;
        left: 50%;
        transform: translateX(-50%);
        > .right {
          transform: rotate(180deg);
        }
      }
    }
  }
}

// Pas de souris (tactile) : pas de CTA qui suit le curseur, on tape directement sur le projet
@media (hover: none) {
  .projects .cta-enter {
    visibility: hidden;
  }
}

// ---------- Mobile ----------
@media screen and (max-width: 760px) {
  .projects > .project-layout > .projects-navigation {
    // Sous l'image (voir la colonne dans Projects/Item.vue)
    top: calc(50% + 175px);
    transform: translateX(-50%);
    > .markers > img {
      width: 4.25px;
    }
  }
}
</style>
