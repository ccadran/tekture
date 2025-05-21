<script lang="ts" setup>
import type { Project } from '~/types'
const emit = defineEmits(['clicked'])

const props = defineProps<{
  projectsData: Project[]
}>()

const navItemsRefs = ref<any[]>([])

function animateItem(index: number) {
  return navItemsRefs.value[index].animate()
}

defineExpose({
  animateItem,
})
</script>

<template>
  <ul>
    <li :class="'nav-item nav-project--' + index" v-for="(project, index) in props.projectsData" @click="emit('clicked', index)">
      <h4>
        <UtilsTextShuffle
          :from="project.name"
          :to="project.name"
          :duration="0.6"
          :steps="10"
          :ref="
            (el) => {
              if (el) navItemsRefs[index] = el
            }
          "
        />
      </h4>
    </li>
  </ul>
</template>

<style lang="scss"></style>
