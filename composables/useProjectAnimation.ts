import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import projectsData from '~/assets/data/projects.json'

const scrollTriggers = shallowRef<ScrollTrigger[]>([])
export function useProjectAnimation() {
  // gsap.registerPlugin(ScrollTrigger)
  function getElement(index?: number) {
    const targetProject = document.querySelector(`.project--${index}`) as HTMLElement
    const projectsSection = document.querySelector('.projects') as HTMLElement
    const projectsContent = document.querySelector('.project-layout') as HTMLElement
    const navMarkers = document.querySelector('.projects-navigation .markers') as HTMLElement
    const projectsNav = document.querySelector('.projects-navigation') as HTMLElement

    return {
      targetProject,
      titleChars: targetProject?.querySelectorAll('.title .char'),
      descriptionLines: targetProject?.querySelectorAll('.description .line .inner'),
      leftImage: targetProject?.querySelector('.left-images .project-image'),
      rightImage: targetProject?.querySelector('.right-images .project-image'),
      projectsSection,
      projectsContent,
      navMarkers,
      projectsNav,
    }
  }

  function projectIn(index: number, isProjectsEnter: boolean, navigationRef?: Ref) {
    const { targetProject, descriptionLines, titleChars, leftImage, rightImage } = getElement(index)

    const tl = gsap
      .timeline()
      .set(targetProject, { zIndex: projectsData.length, opacity: 1, display: 'flex' })
      .fromTo(descriptionLines, { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.75, ease: 'power1.inOut' })
      .fromTo(titleChars, { opacity: 0, y: 100 }, { opacity: 1, y: 0, stagger: { each: 0.025, from: 'random' }, duration: 0.75, ease: 'power1.inOut' }, 0.2)
      .fromTo(leftImage, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power1.inOut' }, 0.6)
      .fromTo(rightImage, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power1.inOut' }, 0.65)

    if (!isProjectsEnter && navigationRef?.value) {
      tl.add(navigationRef?.value.animateItem(index), 0)
    }
    const navItemActive = document.querySelector(`.nav-project--${index}`)
    navItemActive?.classList.add('active')

    return tl
  }

  function projectOut(index: number) {
    const { targetProject } = getElement(index)

    gsap
      .timeline()
      .to(targetProject, { opacity: 0, duration: 0.5, ease: 'power1.out' })
      .set(targetProject, { zIndex: projectsData.length - 1 })
      .set(targetProject, { display: 'none' })
    const navItemActive = document.querySelector(`.nav-project--${index}`)
    navItemActive?.classList.remove('active')
  }

  /**
   * @param isRestoring retour depuis une page projet : pas d'intro, le projet `index` est affiché
   * directement (le scroll est restauré par Nuxt juste après le montage).
   */
  function projectsEnter(index: number, isRestoring = false) {
    const { projectsSection, projectsContent, navMarkers } = getElement()
    // Le saut de scroll de la restauration déclenche onEnter : on l'ignore pour ne pas re-snapper
    let ignoreNextEnter = isRestoring
    const enterTrigger = ScrollTrigger.create({
      trigger: projectsSection,
      start: 'top bottom-=10%',
      onEnter: () => {
        if (ignoreNextEnter) {
          ignoreNextEnter = false
          return
        }
        window.lenis?.scrollTo(projectsContent, {
          offset: 0,
          duration: 1.2,
          lock: true,
        })
      },
      onLeaveBack: () => {
        ignoreNextEnter = false
      },
    })
    scrollTriggers.value.push(enterTrigger)

    if (isRestoring) {
      projectIn(index, true).progress(1)
      return
    }

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: projectsContent,
          start: 'top center',
          once: true,
        },
      })
      .fromTo(
        '.nav-item h4',
        { y: '100%', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: {
            from: 'end',
            each: 0.05,
            ease: 'power1',
          },
        }
      )

      .add(projectIn(index, true), 0.05)
      .fromTo(
        navMarkers,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.25,
          repeat: 2,
          yoyo: true,
          ease: 'power1.inOut',
        },
        '>-=0.5'
      )
    if (tl.scrollTrigger) {
      scrollTriggers.value.push(tl.scrollTrigger)
    }
    return tl
  }

  function moveMarkers(index: number) {
    const { projectsNav, navMarkers } = getElement(index)

    const projectsNavRect = projectsNav.getBoundingClientRect()
    // Largeur réelle du texte (le <li> fait 100% de la nav, pas la largeur du nom)
    const title = document.querySelector(`.nav-project--${index} h4`)
    const range = document.createRange()
    range.selectNodeContents(title!)
    const textRect = range.getBoundingClientRect()
    const textWidth = textRect.width

    // Marqueurs toujours à 12px (5.3px en mobile) du texte de chaque côté
    const markerWidth = navMarkers.querySelector('img')?.getBoundingClientRect().width ?? 8
    const gap = isMobile() ? 5.3 : 12
    // Centrage vertical sur le texte
    const centerY = textRect.top - projectsNavRect.top + textRect.height / 2
    const top = centerY - navMarkers.getBoundingClientRect().height / 2
    gsap.to(navMarkers, { top, width: textWidth + 2 * (markerWidth + gap) })
  }

  function wrapLinesWithInner() {
    const lineElements = document.querySelectorAll('.description .line')

    lineElements.forEach((line) => {
      const content = line.innerHTML

      line.innerHTML = `<div class="inner">${content}</div>`
    })
  }

  function cleanup() {
    scrollTriggers.value.forEach((trigger) => trigger.kill())
    scrollTriggers.value = []
  }
  return { projectIn, projectOut, projectsEnter, moveMarkers, wrapLinesWithInner, cleanup }
}
