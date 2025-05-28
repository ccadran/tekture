import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import projectsData from '~/assets/data/projects.json'

export function useProjectAnimation() {
  function getElement(index?: number) {
    const targetProject = document.querySelector(`.project--${index}`) as HTMLElement
    const projectsSection = document.querySelector('.projects') as HTMLElement
    const projectsContent = document.querySelector('.project-layout') as HTMLElement
    const navMarkers = document.querySelector('projects-navigation .markers') as HTMLElement
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

  function projectsEnter(index: number) {
    const { projectsSection, projectsContent, navMarkers } = getElement()
    ScrollTrigger.create({
      trigger: projectsSection,
      start: 'top bottom-=10%',
      onEnter: () => {
        window.lenis?.scrollTo(projectsContent, {
          offset: 0,
          duration: 1.2,
          lock: true,
        })
      },
    })

    gsap
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
  }

  function moveMarkers(index: number) {
    const { projectsNav, navMarkers } = getElement(index)
    const currentNavItem = document.querySelector(`.nav-project--${index}`)?.getBoundingClientRect()

    const projectsNavRect = projectsNav.getBoundingClientRect()
    const relativeTop = currentNavItem!.top - projectsNavRect!.top
    const currentNavItemWidth = currentNavItem!.width

    gsap.to(navMarkers, { top: relativeTop, width: currentNavItemWidth + 40 })
  }

  function scrollToProject(index: number) {
    const { projectsSection } = getElement()
    const sectionStart = projectsSection.offsetTop
    const totalScrollable = projectsSection.scrollHeight - window.innerHeight
    const step = totalScrollable / projectsData.length + 1
    const targetScroll = sectionStart + step * index

    window.lenis!.scrollTo(targetScroll, {
      lock: true,
      immediate: true,
    })
  }

  function wrapLinesWithInner() {
    const lineElements = document.querySelectorAll('.line')

    lineElements.forEach((line) => {
      const content = line.innerHTML

      line.innerHTML = `<div class="inner">${content}</div>`
    })
  }

  return { projectIn, projectOut, projectsEnter, moveMarkers, scrollToProject, wrapLinesWithInner }
}
