import Splide from '@splidejs/splide'
import '@splidejs/splide/css'
import './style.styl'

const sel = (e) => document.querySelector(e)
const selAll = (e) => document.querySelectorAll(e)
const l = (...e) => console.log(...e)
const isDomEl = (el) => el instanceof Document || el instanceof Element

const contentDd$ = sel('.lib-filter__dd--content')
const sliderPrefix = 'lib-item'
let sliders = []
function toggleItems(_el) {
  selAll('.lib-item').forEach((el) => {
    if (el.classList.contains('lib-item--' + _el)) {
      el.classList.remove('hide')
    } else {
      el.classList.add('hide')
    }
  })
}
contentDd$.addEventListener('change', (e) => {
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

let refreshSliderTo
//  const refreshSliderOb   =
// const config =
// function initSliderOb(slider)
// {
//   const refreshSliderOb = new MutationObserver(function (mutationList, observer) {
//     for (const mutation of mutationList) {
//       if (mutation.type === 'childList') {
//         refreshSlider(slider)
//       }
//     }
//   })
//   selAll('.lib-item__slider').forEach((el) => {
//     refreshSliderOb.observe(el, { childList: true, subtree: true })
//   })
// }
//
function initObserver(element$, timeout = 100, observerName = 'default', callback) {
  // if (element$.observer?.[observerName]) return
  const observer = new MutationObserver(function (mutations) {
    element$.observerTimer = element$.observerTimer || {}

    const timer = element$.observerTimer?.[observerName] || Math.round(Math.random() * 10000)

    clearTimeout(timer)
    element$.observerTimer[observerName] = setTimeout(() => {
      // l('upd:', timer, element)
      l(observerName, element$)

      callback()
      // observer.disconnect()
    }, timeout)
  })
  observer.observe(element$, { childList: true, attributes: false })
  element$.observer = element$.observer || {}
  element$.observer[observerName] = observer
}
window.fsAttributes = window.fsAttributes || []
window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
    const [filterInstance] = filterInstances

    // The `renderitems` event runs whenever the list renders items after filtering.
    filterInstance.listInstance.on('renderitems', (renderedItems) => {
      // console.log(renderedItems)
      sliders.forEach((slider, i) => {
        l(i)
        initObserver(slider.root.querySelector('.splide__list'), 100, 'refresh', () => {
          slider.refresh()
        })
        initObserver(slider.root.querySelector('.splide__list'), 200, 'bullets', () => {
          initSplideBullets(slider, sliderPrefix)
        })
        slider.refresh()
        slider.go(0)
        initSplideBullets(slider, sliderPrefix)

        // slider.Components.Controller.toPage(1)
        // refreshSlider(slider)
      })
    })
  },
])

// ;['article', 'blog', 'podcast', 'news'].forEach((el_) => {
onDomReady(() => {
  selAll('.lib-item__slider').forEach((el) => {
    // const el = sel('.slider--' + el_)
    addSplideClasses(el)

    const slider = new Splide(el, {
      arrows: false,
      pagination: false,
      gap: '2rem',
      // type: 'loop',
      // rewind: true,
      perPage: 3,
      perMove: 3,
      speed: 1500,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      breakpoints: {
        991: {
          perPage: 2,
        },
        478: {
          perPage: 1,
        },
      },
    }).mount()
    sliders.push(slider)

    initSplideArrows(slider, sliderPrefix)
    initSplideBullets(slider, sliderPrefix)
    slider.on('resized', () => {
      // initSplideBullets(slider, sliderPrefix)
    })
  })
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
export function initSplideBullets(splide, classPrefix) {
  const slider$ = splide.root
  // parse bullets inside the container and repopulate
  const pagination$ = slider$.querySelector(`.${classPrefix}__pagination`)
  const pages = Math.ceil(splide.length / splide.options.perPage)
  if (pages > 1) {
    // l(slider$, pages)
    pagination$.parentElement.style.maxHeight = 'none'
    // pagination$.style.visibility = 'visible'
    // slider$.querySelector(`.${classPrefix}__arrows`).style.visibility = 'visible'

    const bullet$ = slider$.querySelector(`.${classPrefix}__pagination .bullet:not(.bullet--active)`)
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < pages; i++) {
      let clone$ = bullet$.cloneNode(true)
      clone$.addEventListener('click', (e) => {
        splide.go('>' + i)
      })
      fragment.appendChild(clone$)
    }
    fragment.firstChild.classList.add('bullet--active')
    pagination$.replaceChildren(fragment)
  } else {
    // pagination$.replaceChildren()
    pagination$.parentElement.style.maxHeight = '0px'
    // pagination$.style.visibility = 'hidden'
    // slider$.querySelector(`.${classPrefix}__arrows`).style.visibility = 'hidden'
  }
  splide.on('move', function (newIndex, oldIndex) {
    if (pages < 2) return
    // const index = splide.Components.Controller.toPage(splide.index) // works but the calculation can be wrong as the bullets are manually added
    const index = Math.ceil(newIndex / splide.options.perPage)

    slider$.querySelector(`.${classPrefix}__pagination .bullet--active`).classList.remove('bullet--active')
    slider$.querySelector(`.${classPrefix}__pagination .bullet:nth-of-type(${index + 1})`).classList.add('bullet--active')
  })
}
export function initSplideArrows(splide, classPrefix) {
  const slider$ = splide.root
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
