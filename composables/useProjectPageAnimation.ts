import gsap from 'gsap'

export function useProjectPageAnimation({
  splitedText,
  imageRefs,
  focusedImage,
  focusedContent,
  currentFocusedSliderImage,
  activeIndex,
  prevNavigation,
  nextNavigation,
  projectTitle,
  currentFocusedImage,
  projectImages,
}: {
  splitedText: Ref
  imageRefs: Ref
  focusedImage: Ref
  focusedContent: Ref
  currentFocusedSliderImage: Ref
  activeIndex: Ref
  prevNavigation: Ref
  nextNavigation: Ref
  projectTitle: Ref
  currentFocusedImage: Ref
  projectImages: Ref
}) {
  function enterAnim() {
    const projectNameTl = gsap.timeline()

    //timeline of the anim of each word of the project name
    splitedText.value.words.forEach((word: HTMLElement) => {
      projectNameTl.to(
        word,
        {
          duration: 1,
          scrambleText: {
            text: word.textContent as string,
            tweenLength: true,
          },
        },
        0
      )
    })

    const enterTl = gsap.timeline({ delay: 1 })
    const images = imageRefs.value.map((el: HTMLElement) => el.querySelector('img'))
    enterTl
      .fromTo(focusedImage.value!, { scale: 1.3 }, { scale: 1 })
      .fromTo(
        focusedContent.value!,
        {
          transform: 'translate(-50%,-50%)',
          top: '50%',
        },
        {
          transform: 'translate(-50%,-30%)',
          top: '30%',
          onComplete() {
            gsap.set('.utils-project-informations', { display: 'flex' })
          },
        },
        0
      )
      .add(projectNameTl, 0)
      .fromTo(
        projectTitle.value,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          onComplete() {
            currentFocusedSliderImage.value = 0
          },
        },
        0
      )
      .fromTo(
        images,
        { transform: 'translateX(-100%)', opacity: 0 },
        {
          transform: 'translateX(0%)',
          opacity: 1,
          duration: 1.25,
          stagger: {
            each: 0.085,
            ease: 'power1.in',
          },
        },
        0.15
      )
      .fromTo(
        '.counter',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
        },
        0.75
      )
      .to(
        activeIndex.value,
        {
          scrambleText: {
            text: '1',
            chars: '0123456789',
            speed: 1,
          },
          duration: 1.5,
        },
        0.75
      )
      .add(prevNavigation.value.animate(), 1)
      .add(nextNavigation.value.animate(), 1.15)
      .fromTo(
        '.slider-navigation.prev',
        { opacity: 0 },
        {
          opacity: 1,
        },
        1
      )
      .fromTo(
        '.slider-navigation.next',
        { opacity: 0 },
        {
          opacity: 1,
        },
        1.15
      )
      .fromTo(
        '.utils-project-informations',
        { opacity: 0, y: '-100%' },
        {
          opacity: 1,
          y: '0%',
        },

        1.25
      )
  }
  function nextImage() {
    const newImage = (currentFocusedImage.value + 1) % projectImages!.value.length
    changeActiveImage(newImage)
  }
  function prevImage() {
    const newImage = (currentFocusedImage.value - 1 + projectImages!.value.length) % projectImages!.value.length
    changeActiveImage(newImage)
  }
  function changeActiveImage(targetImageIndex: number) {
    animateIndexChange(currentFocusedImage.value, targetImageIndex)
    currentFocusedImage.value = targetImageIndex
    currentFocusedSliderImage.value = targetImageIndex
  }

  function animateIndexChange(previousIndex: number, targetIndex: number) {
    const indexWrapper = document.querySelector('.index-wrapper')
    const allIndexes = indexWrapper?.querySelectorAll('.index')

    if (!allIndexes || allIndexes.length === 0) return

    let isProgressing = targetIndex > previousIndex
    if (Math.abs(targetIndex - previousIndex) > 1) {
      if (targetIndex - previousIndex > 1) {
        isProgressing = true
      } else {
        isProgressing = false
      }
    }

    const indexTl = gsap.timeline({ defaults: { duration: 0.3, ease: 'power1.inOut' } })

    indexTl
      .to(allIndexes[previousIndex], { x: isProgressing ? '100%' : '-100%' })
      .fromTo(allIndexes[targetIndex], { x: isProgressing ? '-100%' : '100%' }, { x: '0%' }, 0.1)
  }
  return { enterAnim, nextImage, prevImage, changeActiveImage }
}
