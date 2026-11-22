import { defineNuxtPlugin } from '#app'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { Observer } from 'gsap/Observer'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(TextPlugin, ScrollTrigger, ScrambleTextPlugin, ScrollToPlugin, SplitText, Observer)

  return {
    provide: {
      gsap,
    },
  }
})
