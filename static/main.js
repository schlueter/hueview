~function () {
  'use strict';
  const logView = document.createElement('div')
  logView.id = 'logger'
  logView.style = 'color: green; height: 500px; padding: 10px; overflow: scroll; background: black;'
  const body = document.getElementsByTagName('body')[0]
  body.insertBefore(logView, body.children[0])
  window.log = (...args) => {
    logView.innerHTML += '<pre>' + args.join(' ')
    logView.scrollTop = logView.scrollHeight
  }
}()

~function () {
'use strict';
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
  .then(() => new HueView(new Hueston()))
  .catch(error => console.error('Error loading scripts:', error))
}()
