/**
 * Breakpoints partagés JS <-> CSS.
 * ⚠️ Garder synchronisé avec les media queries SCSS :
 *   mobile : @media screen and (max-width: 760px)
 *   tablet : @media screen and (min-width: 761px) and (max-width: 1024px)
 */
export const BREAKPOINTS = {
  mobile: 760,
  tablet: 1024,
}

export function isMobile() {
  return window.matchMedia(`(max-width: ${BREAKPOINTS.mobile}px)`).matches
}

export function isTablet() {
  return window.matchMedia(`(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`).matches
}

/**
 * Taille de l'image focus du slug (`scale` = zoom de départ de l'anim d'entrée : 1.3 sur desktop/tablette, aucun en mobile).
 * Cible des transitions home -> slug et works -> slug : l'image y est amenée exactement
 * à cette taille pour que la view transition (durée 0) n'ait plus qu'à échanger les deux.
 * ⚠️ Garder synchronisé avec `.focused-image` dans pages/projects/[slug].vue
 */
export function getSlugImageSize() {
  if (isMobile()) {
    // Largeur de l'écran - 40px de marges (20 de chaque côté), plafonnée à 66% de la hauteur d'écran
    // en hauteur d'image (ratio 242/324) : min(100vw - 40px, 49.3vh) côté CSS
    const width = Math.min(window.innerWidth - 40, (window.innerHeight * 49.3) / 100)
    return { width, height: (width * 324) / 242, scale: 1 }
  }
  const height = (window.innerHeight * 60) / 100
  return { width: (height * 254) / 317, height, scale: 1.3 }
}
