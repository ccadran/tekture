export const useUi = defineStore('useUi', () => {
  const mousePos = { x: '0', y: '0' }
  // Index du projet ouvert depuis la home : au retour, on réaffiche directement ce projet sans rejouer l'intro
  const lastProjectIndex = ref<number | null>(null)
  return { mousePos, lastProjectIndex }
})
