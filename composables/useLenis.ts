// composables/useLenis.ts
import { ref, onMounted } from 'vue'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Étendre l'interface Window pour typer window.lenis
declare global {
  interface Window {
    lenis?: Lenis
  }
}

export const useLenis = () => {
  const lenisInstance = ref<Lenis | null>(null)

  onMounted(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        wheelMultiplier: 1,
        infinite: false,
        gestureOrientation: 'vertical',
        lerp: 0.3,
      })

      window.lenis = lenis
      lenisInstance.value = lenis

      ScrollTrigger.config({
        ignoreMobileResize: true,
      })

      // Scroller proxy
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value!)
          }
          return window.scrollY
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          }
        },
      })

      let lastScroll = 0

      lenis.on('scroll', ({ scroll }) => {
        const direction = scroll > lastScroll ? 'down' : scroll < lastScroll ? 'up' : 'still'
        lastScroll = scroll

        ScrollTrigger.update()

        document.body.setAttribute('data-scroll', scroll === 0 ? 'top' : direction)
      })

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)

      window.addEventListener('resize', () => {
        ScrollTrigger.refresh()
      })
    }
  })

  return {
    lenis: lenisInstance,
  }
}
