<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

interface Props {
  from?: string
  to?: string
  duration?: number
  steps?: number
}

const props = withDefaults(defineProps<Props>(), {
  from: '',
  to: '',
  duration: 1,
  steps: 10,
})

gsap.registerPlugin(TextPlugin)

const textElement = ref<HTMLElement | null>(null)
const displayText = ref(props.from || '')

function animate({
  fromText = props.from,
  toText = props.to,
  duration = props.duration,
  steps = props.steps,
}: { fromText?: string; toText?: string; duration?: number; steps?: number } = {}) {
  if (!textElement.value) return

  displayText.value = fromText

  const tl = gsap.timeline()
  const interval = duration / props.steps

  for (let i = 0; i < props.steps - 1; i++) {
    tl.to(textElement.value, {
      duration: interval,
      text: {
        value: getRandomText(fromText, toText),
      },
      ease: 'none',
    })
  }

  tl.to(textElement.value, {
    duration: interval,
    text: {
      value: toText,
    },
    ease: 'none',
  })

  return tl
}

function getRandomText(fromText: string, toText: string) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'

  return Array(Math.max(fromText.length, toText.length))
    .fill(0)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')
}

defineExpose({ animate, $el: textElement })
</script>

<template>
  <span ref="textElement"
    ><slot>
      {{ displayText }}
    </slot>
  </span>
</template>
