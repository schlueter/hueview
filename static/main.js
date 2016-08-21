(function () {
'use strict';
window.log = statement => document.getElementById('logger').innerHTML = '<pre>' + statement + '</pre>' + document.getElementById('logger').innerHTML;

function loadScript(url) {
  return new Promise(function(resolve, reject) {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
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
  .catch(error => console.log('errored', error))

const main = function() {
  const hueston = new Hueston()
  const hueView = new HueView(hueston)
  hueView.makeButtonsForLights()
    .catch(error => console.log('Error!', error))
}
})()
