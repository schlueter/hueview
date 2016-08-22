(function () {
'use strict';
(function () {
  const logView = document.createElement('div')
  logView.id = 'logger'
  logView.style = 'color: green; height: 100px; padding: 10px; overflow: scroll; background: black;'
  const body = document.getElementsByTagName('body')[0]
  console.log(body.children[0])
  body.insertBefore(logView, body.children[0])
  window.log = statement => {
    logView.innerHTML += '<pre>' + statement
    logView.scrollTop = logView.scrollHeight
  }
})()

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
  .then(values => main())
  .catch(prefixError('errored'))

const main = () => {
  const hueston = new Hueston()
  const hueView = new HueView(hueston)
  hueView.makeButtonsForLights()
    .catch(prefixError('Error!'))}
})()
