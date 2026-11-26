<script lang="ts" setup>
import gsap from 'gsap'

const keyWords = ['innovation', 'expertise', 'sustainable', 'results', 'Strategy', 'fondation']
const currentIndices = ref<number[]>([])
const keyWordsRefs = ref<any[]>([])
const SHUFFLE_DURATION = 1

onMounted(async () => {
  currentIndices.value = keyWords.map((_, i) => i)
  await nextTick()
})

function enterAnim() {
  const domElements = keyWordsRefs.value.map((componentRef) => componentRef.$el)

  const keyWordsTl = gsap.timeline()

  keyWordsTl.fromTo(
    domElements,
    { opacity: 0 },
    {
      opacity: 0.4,
      stagger: {
        amount: 1.5,
        onStart() {
          const currentElement = this.targets()[0]
          const index = domElements.indexOf(currentElement)

          keyWordsRefs.value[index].animate({ fromText: domElements[index].textContent, toText: domElements[index].textContent, duration: 0.5, steps: 5 })
        },
      },
      onComplete() {
        textShuffleLoop()
      },
    }
  )
}

let currentTextIndex = 0

function textShuffleLoop() {
  const ref = keyWordsRefs.value[currentTextIndex]
  const currentWordIndex = currentIndices.value[currentTextIndex]
  const nextWordIndex = (currentWordIndex + 1) % keyWords.length

  if (ref && ref.animate) {
    ref.animate({ fromText: keyWords[currentWordIndex], toText: keyWords[nextWordIndex] })
  }

  currentIndices.value[currentTextIndex] = nextWordIndex

  currentTextIndex = (currentTextIndex + 1) % keyWordsRefs.value.length

  setTimeout(() => {
    textShuffleLoop()
  }, SHUFFLE_DURATION * 1000)
}

defineExpose({
  keywordsEnter: () => enterAnim,
})
</script>

<template>
  <div class="shuffle-keywords">
    <UtilsTextShuffle
      v-for="(word, index) in keyWords"
      :duration="SHUFFLE_DURATION"
      class="keyword"
      :ref="
        (el) => {
          if (el) keyWordsRefs[index] = el
        }
      "
      >{{ word }}</UtilsTextShuffle
    >
  </div>
</template>

<style lang="scss">
.shuffle-keywords {
  position: absolute;

  height: 100vh;
  // 100% et pas 100vw : 100vw inclut la scrollbar => overflow-x
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  > .keyword {
    position: absolute;
    transform: translate(-50%, -50%);
    // Largeur réelle du mot : sinon, collé au bord droit, la boîte (shrink-to-fit) est plus étroite
    // que le mot et celui-ci déborde de la page (overflow-x)
    width: max-content;
    white-space: nowrap;
    font-weight: 100;
    opacity: 0;
    &:nth-of-type(1) {
      left: 6vw;
      top: 12vh;
    }
    &:nth-of-type(2) {
      left: 22vw;
      bottom: 14vh;
    }
    &:nth-of-type(3) {
      left: 34vw;
      top: 24vh;
    }
    &:nth-of-type(4) {
      right: 40vw;
      bottom: 24vh;
    }
    &:nth-of-type(5) {
      right: 30vw;
      top: 14vh;
    }
    &:nth-of-type(6) {
      right: 10vw;
      top: 50vh;
    }
  }
}

// ---------- Mobile ----------
// Positions de la maquette 320 x 568, converties en centre du mot (le mot est centré par translate -50%)
@media screen and (max-width: 760px) {
  .shuffle-keywords > .keyword {
    font-size: 8px;
    font-weight: 200;
    right: auto;
    bottom: auto;
    // innovation
    &:nth-of-type(1) {
      left: 46vw;
      top: 5.8vh;
    }
    // expertise
    &:nth-of-type(2) {
      left: 10.2vw;
      top: 18.9vh;
    }
    // sustainable
    &:nth-of-type(3) {
      left: 74.6vw;
      top: 31.6vh;
    }
    // results
    &:nth-of-type(4) {
      left: 90.4vw;
      top: 59.1vh;
    }
    // Strategy
    &:nth-of-type(5) {
      left: 24.5vw;
      top: 80.8vh;
    }
    // fondation
    &:nth-of-type(6) {
      left: 60.9vw;
      top: 95.9vh;
    }
  }
}
</style>
