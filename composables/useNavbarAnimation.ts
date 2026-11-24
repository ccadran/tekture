import gsap from 'gsap'

/**
 * Anims d'entrée de la navbar.
 *
 * La navbar vit dans app.vue : elle n'est montée qu'une fois (au chargement du site).
 * Son anim d'entrée ne se joue donc qu'au premier chargement, et dépend de la page d'arrivée :
 *  - home                                  -> anim "loader" (scramble TEKTURE), jouée par la navbar
 *  - page avec `definePageMeta({ navbarEnter: 'page' })` -> la page l'ajoute dans SA timeline
 *                                             via `navbarEnterTimeline()` (réglages à la main)
 *  - autres pages                          -> anim par défaut, jouée par la navbar
 * Si on arrive sur une page via la navigation interne, la navbar est déjà visible : rien ne se joue.
 */

let hasEntered = false

export type NavbarEnterOptions = {
  duration?: number
  ease?: string
  stagger?: number
  /** Décalage vertical de départ des liens (en % de leur hauteur) */
  fromYPercent?: number
}

/** Anim de la home (après le loader) */
export function navbarHomeEnter() {
  if (hasEntered) return null
  hasEntered = true

  return gsap
    .timeline({ delay: 1.25 })
    .set('.navbar', { visibility: 'visible' })
    .fromTo('.navbar .home-link', { opacity: 0 }, { opacity: 1 })
    .to('.navbar .home-link', { scrambleText: { text: 'TEXTURE', speed: 1 }, duration: 2 }, 0)
    .fromTo('.nav-link span', { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, stagger: 0.15 }, 0.15)
}

/**
 * Anim des autres pages : renvoie une timeline (à ajouter dans une timeline de page avec
 * `tl.add(navTl, at)` ; jouée direct sinon), ou `null` si la navbar est déjà affichée.
 */
export function navbarEnterTimeline({ duration = 0.6, ease = 'power3.out', stagger = 0.08, fromYPercent = -100 }: NavbarEnterOptions = {}) {
  if (hasEntered) return null
  hasEntered = true

  return gsap
    .timeline()
    .set('.navbar', { visibility: 'visible' })
    .fromTo(
      ['.navbar .home-link', '.nav-link span'],
      { yPercent: fromYPercent, opacity: 0 },
      { yPercent: 0, opacity: 1, duration, ease, stagger },
      0
    )
}
