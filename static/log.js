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
