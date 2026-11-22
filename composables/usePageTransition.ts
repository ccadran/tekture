import gsap from 'gsap'

/**
 * Sortie de page avec un calque blanc global (dans app.vue) :
 * fade-in du calque -> navigation -> on attend que la nouvelle page soit montée
 * ET que Nuxt ait restauré le scroll -> fade-out du calque.
 *
 * Le calque vit dans app.vue (et pas dans la page) pour survivre au changement de page,
 * sinon on voit la nouvelle page s'afficher en haut puis sauter à la position restaurée.
 */
export function usePageTransition() {
  const nuxtApp = useNuxtApp()
  const router = useRouter()

  function getLayer() {
    return document.querySelector<HTMLElement>('.page-transition-layer')
  }

  function leave() {
    const layer = getLayer()

    gsap.to(layer, {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.inOut',
      overwrite: true,
      onComplete() {
        // Pas de view transition pour cette navigation : le calque blanc s'en charge.
        // (Sinon le navigateur fige/capture l'écran pendant le montage de la home => flash.)
        // Le plugin view-transition de Nuxt lit `to.meta.viewTransition` dans un beforeResolve,
        // qui passe après les beforeEach.
        const removeGuard = router.beforeEach((to) => {
          to.meta.viewTransition = false
          removeGuard()
        })

        nuxtApp.hooks.hookOnce('page:loading:end', () => {
          // Le scrollBehavior de Nuxt restaure la position dans un setTimeout après page:finish :
          // on laisse passer quelques frames avant de révéler la page.
          setTimeout(() => {
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                gsap.to(layer, { opacity: 0, duration: 0.6, ease: 'power1.inOut' })
              })
            )
          }, 0)
        })

        // Arrivée directe sur la page (pas d'historique interne) : router.back() quitterait le site
        if (window.history.state?.back) router.back()
        else navigateTo('/')
      },
    })
  }

  return { leave }
}
