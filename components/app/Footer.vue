<script lang="ts" setup>
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

onMounted(() => {
  // gsap.registerPlugin(ScrollTrigger)
  const footerTl = initFooterTl()
  ScrollTrigger.create({
    trigger: '.main',
    start: 'bottom bottom-=1%',
    onEnter() {
      window.lenis?.scrollTo('.footer', { offset: 0, duration: 1, lock: true })
      footerTl.play()
    },
  })
  ScrollTrigger.create({
    trigger: '.main',
    start: 'bottom bottom-=49%',
    onLeaveBack() {
      footerTl.reverse()
      window.lenis?.scrollTo('.main', {
        offset: document.querySelector('.main')!.scrollHeight - window.innerHeight, // Assure que le bas du .main est visible
        duration: 1,
        lock: true,
        immediate: false,
      })
    },
  })

  gsap.fromTo(
    'footer .title',
    { transform: 'scaleY(0.0)' },
    {
      transform: 'scaleY(1.0)',
      scrollTrigger: {
        trigger: '.main',
        start: 'bottom bottom',
        end: 'bottom bottom-=30%',
        scrub: true,
      },
    }
  )
})
function initFooterTl() {
  return gsap
    .timeline({ paused: true })
    .fromTo(
      '.contact',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        delay: 0.35,
        onStart() {
          gsap.fromTo(
            '.marker',
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.25,
              repeat: 2,
              yoyo: true,
              ease: 'power1.inOut',
            }
          )
        },
      }
    )
    .fromTo(
      'footer .location',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
      },
      0.75
    )
}
</script>

<template>
  <footer class="footer">
    <p class="location">Prinsengracht 315 . 1016 GZ Amsterdam</p>
    <div class="contact">
      <img class="marker" src="/icons/marker.svg" alt="" />
      <h4>Contact us</h4>
      <img class="marker" src="/icons/marker.svg" alt="" />
    </div>
    <h2 class="title">TEKTURE</h2>
  </footer>
</template>

<style lang="scss">
.footer {
  z-index: -1;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: sticky;
  bottom: 0;
  padding-top: 24px;
  > .location {
    font-size: 18px;
    font-weight: 400;
  }
  > .contact {
    display: flex;
    align-items: center;
    gap: 10px;
    > h4 {
      font-size: 22px;
    }
    > img:nth-of-type(2) {
      transform: rotate(180deg);
    }
  }
  > .title {
    font-size: 21.5vw;
    font-weight: 800;
    line-height: 70%;
    transform-origin: bottom;
  }
}
</style>
