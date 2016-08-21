(function () {
'use strict';
window.log = statement => document.getElementById('logger').innerHTML = '<pre>' + statement + '</pre>' + document.getElementById('logger').innerHTML;

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
