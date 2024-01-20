import Splide from '@splidejs/splide'
import '@splidejs/splide/css'
import './style.styl'

const sel = (e) => document.querySelector(e)
const selAll = (e) => document.querySelectorAll(e)
const l = (...e) => console.log(...e)
const isDomEl = (el) => el instanceof Document || el instanceof Element

const contentDd$ = sel('.lib-filter__dd--content')
function toggleItems(_el) {
  l('f')
  selAll('.lib-item').forEach((el) => {
    l(el)

    if (el.classList.contains('lib-item--' + _el)) {
      el.classList.remove('hide')
    } else {
      el.classList.add('hide')
    }
  })
}
contentDd$.addEventListener('change', (e) => {
  l(e.target.value)
  switch (e.target.value) {
    case 'blog':
      toggleItems('blog')
      break
    case 'podcast':
      toggleItems('podcast')
      break
    case 'article':
      toggleItems('article')
      break
    case 'whitepaper':
      toggleItems('whitepaper')
      break
    case 'video':
      toggleItems('video')
      break
    case 'webinar':
      toggleItems('webinar')
      break
    default:
      selAll('.lib-item').forEach((el) => {
        el.classList.remove('hide')
      })
  }
})

sel('.clear-filter').addEventListener('click', (e) => {
  contentDd$.value = 'all'
  contentDd$.dispatchEvent(new Event('change'))
})

// ;['article', 'blog', 'podcast', 'news'].forEach((el_) => {
selAll('.lib-item__slider').forEach((el) => {
  // const el = sel('.slider--' + el_)
  const name = 'lib-item'
  addSplideClasses(el)

  const slider = new Splide(el, {
    arrows: false,
    pagination: false,
    gap: '2rem',
    // type: 'loop',
    rewind: true,
    perPage: 3,
    perMove: 3,
    speed: 1500,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    breakpoints: {
      747: {
        perPage: 2,
      },
      478: {
        perPage: 1,
      },
    },
  }).mount()
  l(slider.Components.Controller.toPage(1))

  connectSplideArrows(slider, el, name)
  connectSplideBullets(slider, el, name)
})

export function onDomReady(run) {
  if (document.readyState !== 'loading') {
    run()
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      run()
    })
  }
}
export function connectSplideBullets(splide, slider$, classPrefix) {
  // parse bullets inside the container and repopulate
  const pagination$ = slider$.querySelector(`.${classPrefix}__pagination`)
  // let bulletPressed = false
  if (splide.length > 1) {
    const bullet$ = slider$.querySelector(`.${classPrefix}__pagination .bullet:not(.bullet--active)`)
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < Math.ceil(splide.length / splide.options.perPage); i++) {
      let clone$ = bullet$.cloneNode(true)
      clone$.addEventListener('click', (e) => {
        // bulletPressed = true
        splide.go(i * splide.options.perPage)
      })
      fragment.appendChild(clone$)
    }
    fragment.firstChild.classList.add('bullet--active')
    pagination$.replaceChildren(fragment)
  } else {
    pagination$.replaceChildren()
  }
  splide.on('move', function (newIndex, oldIndex) {
    const index = splide.Components.Controller.toPage(splide.index)

    slider$.querySelector(`.${classPrefix}__pagination .bullet--active`).classList.remove('bullet--active')
    slider$.querySelector(`.${classPrefix}__pagination .bullet:nth-of-type(${index + 1})`).classList.add('bullet--active')
  })
}
export function connectSplideArrows(splide, slider$, classPrefix) {
  slider$.querySelector(`.${classPrefix}__arrows .arrow--left`).addEventListener('pointerdown', function () {
    splide.go('<')
  })

  slider$.querySelector(`.${classPrefix}__arrows .arrow:not(.arrow--left)`).addEventListener('pointerdown', function () {
    splide.go('>')
  })
}
export function addSplideClasses(slider) {
  let splide
  if (typeof slider === 'string') {
    splide = document.querySelector('.' + slider)
  } else if (isDomEl(slider)) {
    splide = slider
  }
  const track = splide.children[0]
  const list = track.children[0]
  const slide = list.childNodes
  splide.classList.add('splide')
  track.classList.add('splide__track')
  list.classList.add('splide__list')
  slide.forEach((slide) => slide.classList.add('splide__slide'))
}
