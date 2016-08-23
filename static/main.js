(function () {
  'use strict';
  const logView = document.createElement('div')
  logView.id = 'logger'
  logView.style = 'color: green; height: 500px; padding: 10px; overflow: scroll; background: black;'
  const body = document.getElementsByTagName('body')[0]
  body.insertBefore(logView, body.children[0])
  window.log = statement => {
    logView.innerHTML += '<pre>' + statement
    logView.scrollTop = logView.scrollHeight
  }
})()

;(function () {
'use strict';
const prefixError = prefix => error => console.error(prefix, error)
function loadScript(url) {
  return new Promise(function(resolve, reject) {
    const head = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.src = url
    script.async = false
    script.onload = () => resolve(url)
    head.appendChild(script)
  })
}

Promise.all([
  'static/hueston.js',
  'static/hueview.js'
].map(loadScript))
<<<<<<< a61b8c13b04e46093fed71120fa6294ca8856092
  .then(values => main())
  .catch(prefixError('errored'))
=======
  .then(() => main())
  .catch(error => Error(error))
>>>>>>> Break up view functions

const main = () => {
  const hueston = new Hueston()
  const hueView = new HueView(hueston)
<<<<<<< a61b8c13b04e46093fed71120fa6294ca8856092
  hueView.makeButtonsForLights()
    .catch(prefixError('Error!'))}
=======
}
>>>>>>> Break up view functions
})()
