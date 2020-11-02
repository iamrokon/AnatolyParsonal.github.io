var app = new Vue({
  el: '#app',
  data: {
    message: 'Anatoly Raklyar'
  },
  mounted() {
    // this.$route.push({ awd: 'awd' })
    // var params = {
    //   a: 1,
    //   b: 2,
    //   c: 3
    // }
    // var queryString = Object.keys(params)
    //   .map((key) => key + '=' + params[key])
    //   .join('&')
    setTimeout(() => {
      document.getElementById('popup-article').style.display = 'flex'
    }, 6000)
    document.querySelector('.popup__close').addEventListener('click', () => {
      document.getElementById('popup-article').style.display = 'none'
    })
  }
})
// utilities
var get = function (selector, scope) {
  scope = scope ? scope : document
  return scope.querySelector(selector)
}

var getAll = function (selector, scope) {
  scope = scope ? scope : document
  return scope.querySelectorAll(selector)
}

// setup typewriter effect in the terminal demo
if (document.getElementsByClassName('demo').length > 0) {
  /*   var i = 0;
  var txt = `scribbler
            [Entry mode; press Ctrl+D to save and quit; press Ctrl+C to quit without saving]

            ###todo for new year dinner party

            - milk
            - butter
            - green onion
            - lots and lots of kiwis 🥝`;
  var speed = 60;

  function typeItOut () {
    if (i < txt.length) {
      document.getElementsByClassName('demo')[0].innerHTML += txt.charAt(i);
      i++;
      setTimeout(typeItOut, speed);
    }
  }

  setTimeout(typeItOut, 1800); */
}

// toggle tabs on codeblock
window.addEventListener('load', function () {
  // get all tab_containers in the document
  var tabContainers = getAll('.tab__container')

  // bind click event to each tab container
  for (var i = 0; i < tabContainers.length; i++) {
    get('.tab__menu', tabContainers[i]).addEventListener('click', tabClick)
  }

  // each click event is scoped to the tab_container
  function tabClick(event) {
    var scope = event.currentTarget.parentNode
    var clickedTab = event.target
    var tabs = getAll('.tab', scope)
    var panes = getAll('.tab__pane', scope)
    var activePane = get(`.${clickedTab.getAttribute('data-tab')}`, scope)

    // remove all active tab classes
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active')
    }

    // remove all active pane classes
    for (var i = 0; i < panes.length; i++) {
      panes[i].classList.remove('active')
    }

    // apply active classes on desired tab and pane
    clickedTab.classList.add('active')
    activePane.classList.add('active')
  }
})

//in page scrolling for documentaiton page
var btns = getAll('.js-btn')
var sections = getAll('.js-section')

function setActiveLink(event) {
  // remove all active tab classes
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove('selected')
  }

  event.target.classList.add('selected')
}

function smoothScrollTo(i, event) {
  var element = sections[i]
  setActiveLink(event)

  window.scrollTo({
    behavior: 'smooth',
    top: element.offsetTop - 20,
    left: 0,
  })
}

if (btns.length && sections.length > 0) {
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', smoothScrollTo.bind(this, i))
  }
}

// fix menu to page-top once user starts scrolling
window.addEventListener('scroll', function () {
  var docNav = get('.doc__nav > ul')

  if (docNav) {
    if (window.pageYOffset > 63) {
      docNav.classList.add('fixed')
    } else {
      docNav.classList.remove('fixed')
    }
  }
})

// responsive navigation
var topNav = get('.menu')
var icon = get('.toggle')

window.addEventListener('load', function () {
  function showNav() {
    if (topNav.className === 'menu') {
      topNav.className += ' responsive'
      icon.className += ' open'
    } else {
      topNav.className = 'menu'
      icon.classList.remove('open')
    }
  }
  icon.addEventListener('click', showNav)
})

document.querySelectorAll('.button').forEach((button) => {
  let duration = 3000,
    svg = button.querySelector('svg'),
    svgPath = new Proxy(
      {
        y: null,
        smoothing: null,
      },
      {
        set(target, key, value) {
          target[key] = value
          if (target.y !== null && target.smoothing !== null) {
            svg.innerHTML = getPath(target.y, target.smoothing, null)
          }
          return true
        },
        get(target, key) {
          return target[key]
        },
      }
    )

  button.style.setProperty('--duration', duration)

  svgPath.y = 20
  svgPath.smoothing = 0

  button.addEventListener('click', (e) => {
    e.preventDefault()

    if (!button.classList.contains('loading')) {
      button.classList.add('loading')

      gsap.to(svgPath, {
        smoothing: 0.3,
        duration: (duration * 0.065) / 1000,
      })

      gsap.to(svgPath, {
        y: 12,
        duration: (duration * 0.265) / 1000,
        delay: (duration * 0.065) / 1000,
        ease: Elastic.easeOut.config(1.12, 0.4),
      })

      setTimeout(() => {
        svg.innerHTML = getPath(0, 0, [
          [3, 14],
          [8, 19],
          [21, 6],
        ])
      }, duration / 2)
    }
  })
})

function getPoint(point, i, a, smoothing) {
  let cp = (current, previous, next, reverse) => {
      let p = previous || current,
        n = next || current,
        o = {
          length: Math.sqrt(
            Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)
          ),
          angle: Math.atan2(n[1] - p[1], n[0] - p[0]),
        },
        angle = o.angle + (reverse ? Math.PI : 0),
        length = o.length * smoothing
      return [
        current[0] + Math.cos(angle) * length,
        current[1] + Math.sin(angle) * length,
      ]
    },
    cps = cp(a[i - 1], a[i - 2], point, false),
    cpe = cp(point, a[i - 1], a[i + 1], true)
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

function getPath(update, smoothing, pointsNew) {
  let points = pointsNew
      ? pointsNew
      : [
          [4, 12],
          [12, update],
          [20, 12],
        ],
    d = points.reduce(
      (acc, point, i, a) =>
        i === 0
          ? `M ${point[0]},${point[1]}`
          : `${acc} ${getPoint(point, i, a, smoothing)}`,
      ''
    )
  return `<path d="${d}" />`
}

