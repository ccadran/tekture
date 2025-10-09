<script lang="ts" setup>
interface UiIconBracketProps {
  width?: number
  height?: number
  right?: boolean
}
const props = withDefaults(defineProps<UiIconBracketProps>(), {
  width: 12,
  height: 50,
  right: false,
})
</script>

<template>
  <svg
    class="uiIconBracket"
    :width="props.width"
    :height="props.height"
    viewBox="0 0 12 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="{ '-right': props.right }"
  >
    <path d="M0.584229 49.9773V0.886353H11.9365V4.64488H4.87968V46.2187H11.9365V49.9773H0.584229Z" fill="black" />
  </svg>
</template>

<style lang="scss">
.uiIconBracket {
  &.-right {
    transform: rotate(180deg);
  }
}
</style>
