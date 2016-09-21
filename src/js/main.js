(function () {
'use strict';
Promise.all([
  'static/hueston.js',
  'static/hueview.js',
  'static/log.js'
].map(url => new Promise(function(resolve, reject) {
    const head = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.src = url
    script.async = false
    script.onload = resolve
    script.onerror = reject
    head.appendChild(script)
})))
  .then(() => new HueView(new Hueston()))
  .catch(error => console.error('Error loading scripts:', error))
})()
