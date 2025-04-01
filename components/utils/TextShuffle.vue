<!-- components/ShuffleText.vue -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

// Props
interface Props {
  text: string
  duration?: number
  delay?: number
  steps?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1,
  delay: 0,
  steps: 10,
})

// Register GSAP plugin

gsap.registerPlugin(TextPlugin)

// References
const textElement = ref<HTMLElement | null>(null)
const displayText = ref(props.text)

// Constants
const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'

/**
 * Create and start a text shuffle animation
 */
function animate() {
  if (!textElement.value) return

  const interval = props.duration / props.steps
  const tl = gsap.timeline({ delay: props.delay })

  for (let i = 0; i < props.steps; i++) {
    const isLastStep = i === props.steps - 1
    tl.to(textElement.value, {
      duration: interval,
      text: {
        value: (() => {
          return props.text
            .split('')
            .map((char) => {
              if (isLastStep) return char
              return randomChars[Math.floor(Math.random() * randomChars.length)]
            })
            .join('')
        })(),
      },
      ease: 'none',
    })
  }

  return tl
}

// Expose method to parent components
defineExpose({
  animate,
})

// Start animation when component mounts
onMounted(() => {
  //   animate()
})
</script>

<template>
  <span ref="textElement">{{ displayText }}</span>
</template>
