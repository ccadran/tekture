<script lang="ts" setup>
import gsap from 'gsap'
import SplitType from 'split-type'
import ScrollTrigger from 'gsap/ScrollTrigger'
import projectsData from '~/assets/data/projects.json'

// 6 emplacements dans la grille : 1 image (la 2ème) par projet
const gridImages = projectsData.slice(0, 6).map((project) => project.images[1])
let images: HTMLElement[] = []

// ⚙️ Réglages de l'animation lettre par lettre
// Chaque lettre a son propre trigger (réparti sur la hauteur du scroll), puis joue une anim temporelle (pas de scrub).
const LETTERS = {
  start: 'top top', // début de la zone de scroll où les lettres se déclenchent
  end: 'bottom bottom+=10%', // fin de la zone (la dernière lettre se déclenche ici)
  duration: 0.6, // durée du reveal de CHAQUE lettre (s)
  ease: 'power3.out',
  fromY: '100%', // position de départ de chaque lettre
}

onMounted(() => {
  // gsap.registerPlugin(ScrollTrigger)
  const splitProjectsText = new SplitType('.projects-intro-content .inner', { types: 'chars' })

  const chars = splitProjectsText.chars as HTMLElement[]
  gsap.set(chars, { y: LETTERS.fromY })

  // 1 tween (en pause) par lettre
  const tweens = chars.map((char) =>
    gsap.to(char, { y: 0, duration: LETTERS.duration, ease: LETTERS.ease, paused: true })
  )
  // seuil de progression (0 → 1) auquel chaque lettre se déclenche
  const thresholds = chars.map((_, i) => (chars.length > 1 ? i / (chars.length - 1) : 0))
  const shown = chars.map(() => false)

  ScrollTrigger.create({
    trigger: '.projects-intro-images',
    start: LETTERS.start,
    end: LETTERS.end,
    onUpdate: ({ progress }) => {
      tweens.forEach((tween, i) => {
        const shouldShow = progress > 0 && progress >= thresholds[i]
        if (shouldShow === shown[i]) return
        shown[i] = shouldShow
        shouldShow ? tween.play() : tween.reverse()
      })
    },
  })

  images = gsap.utils.toArray('.grid-image')

  ScrollTrigger.create({
    trigger: '.projects-intro',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress
      images.forEach((el: HTMLElement, i: number) => {
        const direction = i % 2 === 0 ? -25 : 10
        gsap.set(el, {
          y: `${progress * direction}vw`,
        })
      })
    },
  })
})
</script>

<template>
  <section class="projects-intro">
    <div class="projects-intro-content">
      <p class="inner">PROJECTS</p>
    </div>
    <div class="projects-intro-images">
      <div class="grid-images">
        <div v-for="(src, i) in gridImages" :key="src" class="grid-image" :data-image="i + 1">
          <img class="inner" :src="src" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.projects-intro {
  height: 300vh;
  position: relative;
  > .projects-intro-content {
    height: 100vh;
    width: 100vw;
    position: sticky;
    display: flex;
    align-items: end;
    top: 0;
    z-index: 1;
    > .inner {
      font-size: 18.5vw;
      font-weight: 800;
      overflow: hidden;
    }
  }
  > .projects-intro-images {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    > .grid-images {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: repeat(24, 1fr);
      width: 100%;
      height: 100%;
      > .grid-image {
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &[data-image='1'] {
          grid-column: 2/4;
          grid-row: 1/4;
        }
        &[data-image='2'] {
          grid-column: 7/12;
          grid-row: 3/6;
        }
        &[data-image='3'] {
          grid-column: 2/5;
          grid-row: 8/12;
        }
        &[data-image='4'] {
          grid-column: 10/12;
          grid-row: 11/14;
        }
        &[data-image='5'] {
          grid-column: 3/7;
          grid-row: 15/18;
        }
        &[data-image='6'] {
          grid-column: 9/11;
          grid-row: 17/19;
        }
      }
    }
  }
}

// ---------- Mobile (maquette : section de 2 écrans = 1136px de haut sur 320 de large) ----------
@media screen and (max-width: 760px) {
  .projects-intro {
    height: 200vh;
    > .projects-intro-content {
      padding: 10px;
      > .inner {
        font-size: 16.9vw;
      }
    }
    > .projects-intro-images > .grid-images {
      display: block;
      position: relative;
      > .grid-image {
        position: absolute;
        width: 21.7vw;
        aspect-ratio: 69.43 / 86.55;
        // left = x / 320, top = y / 1136
        &[data-image='1'] {
          left: 30.6%;
          top: 28.5%;
        }
        &[data-image='2'] {
          left: 67.4%;
          top: 38.1%;
        }
        &[data-image='3'] {
          left: 7.2%;
          top: 49.5%;
        }
        &[data-image='4'] {
          left: 52.1%;
          top: 59.5%;
        }
        &[data-image='5'] {
          left: 62.8%;
          top: 80.8%;
        }
        &[data-image='6'] {
          left: 17.8%;
          top: 84.6%;
        }
      }
    }
  }
}
</style>
