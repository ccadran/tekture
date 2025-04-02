<!-- components/ShuffleText.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

// Props
interface Props {
  from: string
  to: string
  duration?: number
  steps?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1,
  steps: 10,
})

// Register GSAP plugin
gsap.registerPlugin(TextPlugin)

// References
const textElement = ref<HTMLElement | null>(null)
const displayText = ref(props.from)

// Animation function
function animate() {
  if (!textElement.value) return

  const tl = gsap.timeline()
  const interval = props.duration / props.steps

  // Animation intermédiaire avec caractères aléatoires
  for (let i = 0; i < props.steps - 1; i++) {
    tl.to(textElement.value, {
      duration: interval,
      text: {
        value: getRandomText(),
      },
      ease: 'none',
    })
  }

  // Étape finale avec le texte cible
  tl.to(textElement.value, {
    duration: interval,
    text: {
      value: props.to,
    },
    ease: 'none',
  })

  return tl
}

// Génère un texte avec des caractères aléatoires
function getRandomText() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  return Array(Math.max(props.from.length, props.to.length))
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')
}

// Expose la méthode d'animation
defineExpose({ animate })
</script>

<template>
  <span ref="textElement">{{ displayText }}</span>
</template>
