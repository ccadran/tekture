<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'

const text1 = ref<HTMLElement | null>(null)
const text2 = ref<HTMLElement | null>(null)

let splits: SplitType[] = []
let manifestTl: gsap.core.Timeline | null = null
let resizeTimeout: ReturnType<typeof setTimeout> | undefined
let lastWidth = 0

function countLines(el: HTMLElement) {
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight)
  return Math.round(el.getBoundingClientRect().height / lineHeight)
}

// Les deux textes doivent avoir le même nombre de lignes : on resserre celui qui en a le moins
function equalizeLines(els: HTMLElement[]) {
  els.forEach((el) => (el.style.maxWidth = ''))
  const target = Math.max(...els.map(countLines))
  els.forEach((el) => {
    let width = 100
    while (countLines(el) < target && width > 30) {
      width -= 2
      el.style.maxWidth = `${width}%`
    }
  })
}

function setup() {
  const els = [text1.value!, text2.value!]
  equalizeLines(els)

  // Un masque par ligne : .line (overflow hidden) > .inner (animé)
  splits = els.map((el) => new SplitType(el, { types: 'lines' }))
  els.forEach((el) => {
    el.querySelectorAll<HTMLElement>('.line').forEach((line) => {
      line.innerHTML = `<span class="inner">${line.innerHTML}</span>`
    })
  })

  const sentences1 = text1.value!.querySelectorAll('.line .inner')
  const sentences2 = text2.value!.querySelectorAll('.line .inner')
  gsap.set(sentences2, { yPercent: 100, opacity: 0 })

  manifestTl = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: '.manifest',
      start: 'top top-=30%',
      end: 'max',
      toggleActions: 'play none none reverse',
    },
  })

  manifestTl
    .to(sentences1, { yPercent: -100, opacity: 0, ease: 'power3.out', easeReverse: 'power3.out', duration: 0.8, stagger: 0.125 })
    .to(sentences2, { yPercent: 0, opacity: 1, ease: 'power3.out', easeReverse: 'power3.out', duration: 0.8, stagger: 0.125 }, 0)
}

function teardown() {
  manifestTl?.scrollTrigger?.kill()
  manifestTl?.kill()
  manifestTl = null
  splits.forEach((split) => split.revert())
  splits = []
}

function onResize() {
  // Évite de tout refaire sur les resize verticaux (barre d'adresse mobile)
  if (window.innerWidth === lastWidth) return
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    lastWidth = window.innerWidth
    teardown()
    setup()
  }, 200)
}

onMounted(() => {
  lastWidth = window.innerWidth
  setup()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  clearTimeout(resizeTimeout)
  teardown()
})
</script>

<template>
  <section class="manifest">
    <div class="manifest-container">
      <div class="manifest-content">
        <p class="text" ref="text1">
          At Tekture, we are a dynamic team of architects, engineers, and designers committed to pushing the boundaries of modern architecture.
        </p>
      </div>
      <div class="manifest-content">
        <p class="text" ref="text2">
          Our focus is on creating innovative, sustainable designs that blend striking aesthetics with eco-friendly solutions, ensuring everye
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.manifest {
  height: 150vh;
  position: relative;
  margin-bottom: 50vh;
  @media screen and (max-width: 760px) {
    height: 200vh;
    // Pas de demi-écran vide avant l'intro des projets en mobile
    margin-bottom: 0;
  }
  > .manifest-container {
    height: 100vh;
    width: 80vw;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    > .manifest-content {
      position: absolute;
      display: flex;
      justify-content: center;
      width: 100%;
      > .text {
        font-size: 24px;
        text-align: center;
        text-wrap: balance;
        line-height: 130%;
        margin: 0 auto;
        @media screen and (max-width: 760px) {
          font-size: 12px;
        }
        .line {
          overflow: hidden;
          display: block;
          // Le masque = exactement la hauteur d'une ligne (le line-height de 130% laisse déjà la place aux jambages)
          > .inner {
            display: block;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 760px) {
  .manifest > .manifest-container {
    width: calc(100% - 26px);
  }
}
</style>
