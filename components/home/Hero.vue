<script lang="ts" setup>
import gsap from 'gsap'

const hero = ref<HTMLElement | null>(null)
const title1 = ref<HTMLElement | null>(null)
const title2 = ref<HTMLElement | null>(null)
const baseline = ref<HTMLElement | null>(null)

const imagesMoveRef = ref()
const keywordsRef = ref()

// Blocage du scroll pendant l'intro.
// ⚠️ Hero est monté AVANT que app.vue crée Lenis (onMounted enfant → parent) : on attend qu'il existe.
let introPlaying = true
let rafId = 0
const stopLenisWhenReady = () => {
  if (!introPlaying) return
  if (window.lenis) window.lenis.stop()
  else rafId = requestAnimationFrame(stopLenisWhenReady)
}
// Lenis stoppé ne bloque que molette + touch : on bloque aussi clavier et drag de scrollbar
const onKey = (e: KeyboardEvent) => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) e.preventDefault()
}
const onScroll = () => window.scrollTo(0, 0)
const endIntro = () => {
  introPlaying = false
  cancelAnimationFrame(rafId)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
  window.lenis?.start()
}

onBeforeUnmount(endIntro)

onMounted(() => {
  window.scrollTo(0, 0)
  stopLenisWhenReady()
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll)
  const loaderTl = gsap.timeline({
    delay: 0.1,
    onComplete: endIntro,
  })

  const baselineTl = gsap.timeline()
  baselineTl
    .fromTo(baseline.value, { y: '-200%', opacity: 0 }, { y: '0%', opacity: 1, ease: 'power1.out' }, '>-0.15')
    .to('.marker.-left', { left: '-16px' }, '>')
    .to('.marker.-right', { right: '-16px' }, '<')
    .fromTo('.baseline .content', { clipPath: 'inset( 0% 50% 0% 50%)' }, { clipPath: 'inset( 0% 0% 0% 0%)' }, '>-0.5')

    .fromTo(
      '.marker',
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.25,
        repeat: 2,
        yoyo: true,
        ease: 'power1.inOut',
        onComplete() {
          gsap.to('.marker', { opacity: 1, duration: 0.25, ease: 'power1.inOut' })
        },
      },
      '>'
    )

  loaderTl
    .set('.content', { visibility: 'visible' })
    .fromTo(title1.value, { left: '0%' }, { left: '50%' })
    .fromTo(title2.value, { left: '100%' }, { left: '50%' }, 0)
    .fromTo(title1.value, { y: '-35%' }, { y: '0%', duration: 0.5, ease: 'power1.inOut' }, 1)
    .fromTo(title2.value, { y: '35%' }, { y: '0%', duration: 0.5, ease: 'power1.inOut' }, 1)
    .add(baselineTl, 1.25)
    .add(keywordsRef.value.keywordsEnter(), '<')
})
</script>

<template>
  <section class="hero" ref="hero">
    <HomeHeroImagesMove ref="imagesMoveRef" />
    <HomeHeroKeywords ref="keywordsRef" />
    <div class="content">
      <div class="main-title-container">
        <h1 class="inner">TEKTURE</h1>
        <h1 ref="title1" class="main-title">TEKTURE</h1>
        <h1 ref="title2" class="main-title">TEKTURE</h1>
      </div>
      <div ref="baseline" class="baseline">
        <img class="marker -left" src="/icons/marker.svg" alt="" />
        <p class="content">new gen architectural studio</p>
        <img class="marker -right" src="/icons/marker.svg" alt="" />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  > .content {
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
    gap: 32px;
    visibility: hidden;
    > .main-title-container {
      font-size: 124px;
      font-weight: 800;
      position: relative;
      // ⚠️ les h1 ont le font-size: 2em du navigateur : la taille réelle est fixée sur les h1 en mobile/tablet
      @media screen and (max-width: 760px) {
        line-height: 0.8;
        > h1 {
          // Maquette : 54px sur 320 => TEKTURE ≈ 76% de la largeur
          font-size: 16.875vw;
        }
      }
      @media screen and (min-width: 761px) and (max-width: 1024px) {
        > h1 {
          font-size: 17vw;
        }
      }
      > .inner {
        visibility: hidden;
      }
      > .main-title {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &:nth-of-type(2) {
          clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
        }
        &:nth-of-type(3) {
          clip-path: polygon(49.5% 0, 100% 0, 100% 100%, 49.5% 100%);
        }
      }
    }
    > .baseline {
      display: flex;
      align-items: center;
      gap: 8px;
      > .marker {
        position: absolute;
        transform: translateX(-48%);
        &.-left {
          left: 48%;
        }
        &.-right {
          right: 48%;
          transform: rotate(180deg);
        }
      }
      > .content {
        clip-path: inset(0 50% 0 50%);
      }
      @media screen and (max-width: 760px) {
        font-size: 10px;
        font-weight: 600;
        gap: 3.4px;
        > .marker {
          // triangles de la maquette : 5.2px de large en mobile (12px en desktop)
          width: 4.5px;
        }
      }
    }
  }
}

@media screen and (max-width: 760px) {
  .hero {
    // Pas de souris en mobile : pas d'images qui suivent le curseur (absentes de la maquette)
    .mousemove-images {
      display: none;
    }
    > .content {
      gap: 13px;
    }
  }
}
</style>
